const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // JWT expires in 1 day
  });

  // console.log(userId, "res");

  res.cookie("jwt", token, {
    // httpOnly: true,
    // secure: true,
    // sameSite: "none",
    secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-origin in production, "lax" otherwise
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: "/",

    // domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
    // domain: ".vercel.app",
  });
  // res.cookie("jwt", token, {
  //   httpOnly: false,
  //   secure: false, // only set secure cookies in production
  //   sameSite: "strict", // helps prevent CSRF
  //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Explicit expiration date: 1 day from now
  //   path: "/", // Make sure the cookie is available for all routes
  // });
};

module.exports = generateToken;