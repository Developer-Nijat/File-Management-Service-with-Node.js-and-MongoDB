const jwt = require("jsonwebtoken");
const config = require("config");

const accessDeniedError = (res) =>
  res
    .status(401)
    .json(getBrokenRuleError("Access denied. No token provided.", 401));

const getBrokenRuleError = (message, code = undefined) => ({
  message,
  status: 401,
});

function getToken(req) {
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.query?.token ||
    req.params?.token;
  return token;
}

module.exports = (req, res, next) => {
  let token = getToken(req);

  if (!token) return accessDeniedError(res);

  try {
    if (token && token.startsWith("Bearer")) {
      token = token.replace("Bearer ", "");
    }

    if (token) {
      const decoded = jwt.verify(token, config.get("JWT_SECRET"));
      req.claims = decoded;
    } else {
      req.claims = { type: "Admin" };
    }
    next();
  } catch (ex) {
    //if invalid token
    console.error(ex);

    res.status(401).json(getBrokenRuleError("Invalid token", 401));
  }
};
