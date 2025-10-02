const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/email");
const { Op } = require("sequelize");

const cookieOptions = {                             // cookie options for security
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true", // set true in prod with HTTPS
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

function signToken(user) {                      // function to sign the jwt token
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

// Checked and verified
exports.signup = async (req, res) => {                  // signup function to create a new user
  const { username, email, password, role } = req.body;

  try {
    // ✅ Check if user exists by email OR username
    const existing = await User.findOne({
      where: { 
        [Op.or]: [{ email }, { username }] 
        },
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Username or email already taken" });

    // ✅ Create new user
    const user = await User.create({ username, email, password, role });

    // ✅ Generate token and set cookie
    const token = signToken(user);
    res.cookie(process.env.COOKIE_NAME || "token", token, cookieOptions);

    res.status(201).json({ message: "Signup successful", user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    // here i handle the error if any error occurs during the process
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Checked and verified
exports.login = async (req, res) => {                       // login function to authenticate the user
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password)
    return res.status(400).json({ message: "Missing fields" });
  try {
    const user = await User.findOne({
      // ✅ here i find the user by email or username
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" }); // if user not found return invalid credentials

    // ✅ Check password
    const isValid = await user.isValidPassword(password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Generate token and set cookie
    const token = signToken(user);
    res.cookie(process.env.COOKIE_NAME || "token", token, cookieOptions);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // ✅ here i handle the error if any error occurs during the process
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Checked and verified
exports.logout = async (req, res) => {                  // logout function to clear the cookie
  res.clearCookie(process.env.COOKIE_NAME || "token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
  });
  res.json({ message: "Logged out" });          
};

// Not Checked
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  try {
    // find user by email
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(200)
        .json({ message: "If account exists, password reset email sent" }); // avoid email enumeration

    // generate token
    const token = crypto.randomBytes(32).toString("hex");               // generate a random token
    const hashed = crypto.createHash("sha256").update(token).digest("hex");                 // hash the token

    // save token and expiry to user
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;        // 1 hour
    await user.save();              // save the user

    // send email
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}&id=${user.id}`;              // reset url with token and user id
    const message = `You requested a password reset. Click link: ${resetUrl}. If you didn't request, ignore.`;                  // email message
    await sendEmail({                  // send email with the help of sendEmail function    
      to: user.email,
      subject: "Password Reset",
      text: message,
    });

    res.json({ message: "If account exists, password reset email sent" });
  } catch (err) {   
    // handle error if any error occurs during the process
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Not Checked
exports.resetPassword = async (req, res) => {                                   // reset password function to reset the user password
  const { token, id, newPassword } = req.body;
  if (!token || !id || !newPassword)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: {
        id,
        resetPasswordToken: hashed,
        resetPasswordExpires: { [User.sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Optionally send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password changed",
      text: "Your password has been changed.",
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
