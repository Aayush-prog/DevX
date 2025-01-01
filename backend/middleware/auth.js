const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  console.log("Auth middleware called");
  console.log("Request headers:", req.headers);
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ msg: "authorization failed ,login" });
    return;
  }

  //check auth header
  try {
    const checkAuth = jwt.verify(
      authorizationHeader.split("Bearer ")[1],
      process.env.jwt_salt
    );
    req.user = checkAuth;
    console.log("in auth");
    console.log(req.user);
  } catch (e) {
    res.status(401).json({ msg: "authorization failed ,invalid token" });
    return;
  }
  next();
};
module.exports = auth;
