const jwt = require("jsonwebtoken");
const User = require("./models/user");

exports.protect = async (req, res, next) => {                               // middleware to protect routes and ensure user is authenticated
  try {
    const token = req.cookies[process.env.COOKIE_NAME || "token"] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ message: "Not authenticated" });      // if no token found return not authenticated

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);           // find user by primary key
    if (!user) return res.status(401).json({ message: "User not found" });              // if user not found return user not found

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {               // handle errors such as invalid token
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};