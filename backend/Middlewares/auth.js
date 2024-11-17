const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send("Unauthorize / Access Denied ");

  token = token.split(" ")[1];
  if (token === "null" || !token)
    return res.status(401).send("Unauthorized request");

  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verifiedUser) {
      return res.status(401).send("Unauthorized request");
    }

    req.user = verifiedUser; // Attach user info to the request
    next(); // Pass control to the next middleware function
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token has expired");
    } else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("Invalid Token");
    } else {
      return res
        .status(500)
        .send("An error occurred while verifying the token");
    }
  }
};

exports.IsAdmin = async (req, res, next) => {
  if (req.user.user_type == 1) {
    next();
  }else{
  return res.status(401).send("Role Unauthorized!");
  }
};

exports.IsUser = async (req, res, next) => {
  if (req.user.user_type == 0) {
    next();
  }else{
  return res.status(401).send("Unauthorized!");
  }
};
