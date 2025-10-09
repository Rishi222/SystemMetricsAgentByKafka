require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/email");
const { Op } = require("sequelize");

const cookieOptions = {
  // cookie options for security
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true", // set true in prod with HTTPS
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

function signToken(user) {
  // function to sign the jwt token
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

// checked,clear and verified.
exports.signup = async (req, res) => {
  // signup function to create a new user
  const { username, email, password, role } = req.body;

  try {
    // Check if user exists by email OR username
    const existing = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    // if the user is exist.
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Username or email already taken",
      });

    // Create new user
    const user = await User.create({ username, email, password, role });

    // Generate token and set cookie
    const token = signToken(user);
    res.cookie(process.env.COOKIE_NAME || "token", token, cookieOptions);

    // send the responce.
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: user,
    });
  } catch (err) {
    // here i handle the error if any error occurs during the process
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Signup failed", error: err.message });
  }
};

// checked, clear and verified
exports.login = async (req, res) => {
  // login function to authenticate the user
  const { emailOrUsername, password } = req.body;

  // if email or password is missing.
  if (!emailOrUsername || !password)
    return res
      .status(400)
      .json({
        success: false,
        message: "Email/Username and password are required",
      });
  try {
    const user = await User.findOne({
      // here i find the user by email or username
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    
    // if there is no user in db.
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "There is no user in Database. Please create your account first" }); // if user not found return invalid credentials

    // Check password
    const isValid = await user.isValidPassword(password);
    if (!isValid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Generate token and set cookie
    const token = signToken(user);
    res.cookie(process.env.COOKIE_NAME || "token", token, cookieOptions);

    // Prepare user data without sensitive info
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    // ✅ here i handle the error if any error occurs during the process
    console.error(err);
    res.status(500).json({ success: false , message: "Server error" });
  }
};

// checked,clear and verified
exports.logout = async (req, res) => {
  try{
    // logout function to clear the cookie
  res.clearCookie(process.env.COOKIE_NAME || "token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
  });
  res.status(200).json({ success: true, message: "Logged out Successfully" });
  }catch(err){      // here the error handling.
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// checked,clear and verified
exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  // if any one is missing.
  if (!email || !role)
    return res.status(400).json({ success:false, message: "Email and role are required." });

  try {
    // find user by email in db.
    const user = await User.findOne({ where: { email, role } });

    // if the user is not in db.
    if (!user)
      return res.status(404).json({
        success:false,
        message: `No account found with email '${email}' and role '${role}'.`,
      }); // avoid email enumeration

    // check for role mismatch.
    if (user.role !== role) {
      return res.status(403).json({
        success:false,
        message: `Role mismatch! You tried to reset password for '${role}', but this account belongs to '${user.role}'.`,
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex"); // generate a random token
    const hashed = crypto.createHash("sha256").update(token).digest("hex"); // hash the token

    // save token and expiry to user in db.
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save(); // save the user token and expiry to db.

    // send this which is in URL format.
    const resetUrl = `${process.env.APP_URL_CONFIG_IP}/reset-password?token=${token}&id=${user.id}`; // reset url with token and user id

    // here this part is use to send email by send
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      template: "resetPassword.html",
      variables: {
        USERNAME: user.username,
        RESET_LINK: resetUrl,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "If the email exists in our system, a password reset link has been sent...",
    });
  } catch (err) {
    // handle error if any error occurs during the process
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error during password reset" });
  }
};

// checked,clear and verified
exports.resetPassword = async (req, res) => {
  // reset password function to reset the user password
  const { token, id, newPassword } = req.body;

  if (!token || !id || !newPassword){
    return res.status(400).json({ success:false, message: "Missing required parameters" });
  }

  try {
    // Hash the token to compare
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and expiry in db.
    const user = await User.findOne({
      where: {
        id,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    // if there is no user in match.
    if (!user)
      return res.status(400).json({ success:false,  message: "Invalid or expired token" });

    // Use set to trigger hooks
    user.set({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    // save the data in db.
    await user.save();

    // Optionally send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password changed",
      text: `Hi ${user.username}, your password has been successfully changed.`,
    });

    // Generate JWT for auto-login
    const tokenJWT = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Optionally set cookie
    res.cookie("token", tokenJWT, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", // set true if HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,    // 1 day
    });

    // Return success + user info
    return res.status(200).json({
      success:true ,
      message: "Password reset successful",
      user: { id: user.id, email: user.email, role: user.role },
      token: tokenJWT,
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ success:false, message: "Server error while resetting password" });
  }
};
