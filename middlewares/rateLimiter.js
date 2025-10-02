const rateLimit = require("express-rate-limit");

const limiter = rateLimit({                             // rate limiting middleware to limit repeated requests to public APIs
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, try again later.",
});

module.exports = limiter;                 // Max 5 login attempts per 15 minutes from one IP.  