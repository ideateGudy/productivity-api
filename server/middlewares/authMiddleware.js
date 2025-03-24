import jwt from "jsonwebtoken";
import redisClient from "../redisClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  // const token = req.cookies.jwt;
  const token = req.headers.authorization?.split(" ")[1];
  const isRevoked = await redisClient.get(token);
  if (isRevoked)
    return res
      .status(401)
      .json({ message: "Token is revoked, please log in again" });

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }
  //Check if token exists
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    // console.log(err.message);
    // console.error("auth-----",err);
    if (err) {
      let errorMessage = "Authentication failed";
      let code = 400;

      if (err.message === "jwt expired") {
        errorMessage = "Token Expired";
        code = 401;
      } else if (err.message === "invalid signature") {
        errorMessage = "Invalid Signature";
      } else if (err.message === "jwt malformed") {
        errorMessage = "Token Malformed";
      } else if (err.message === "invalid token") {
        errorMessage = "Invalid Token";
      } else if (err.message.includes("Bad control character in string")) {
        errorMessage =
          "SyntaxError: Bad control character in string literal in JSON";
      } else if (err.message.includes("is not valid JSON")) {
        errorMessage = "SyntaxError: Unexpected: token is not valid JSON";
      } else if (err.message.includes("Expected ':' after ")) {
        errorMessage = "SyntaxError: Expected ':' after property name in JSON";
      }

      const response = {
        status: false,
        message: errorMessage,
        exporyDate: err.expiredAt,
      };

      return res.status(code).send(response);
    }

    req.userId = decodedToken.userId;
    req.userName = decodedToken.username;
    req.tokenExpTime = decodedToken.exp - Math.floor(Date.now() / 1000);
    req.currentActiveToken = token;

    // const expTime = decodedToken.exp - Math.floor(Date.now() / 1000);
    // console.log("expire:", expTime);
    // req.authorizedUsers =
    // console.log(decodedToken);

    // const userIdFromToken = decodedToken.userId;
    const userIdFromParams = req.params.id || req.userId;

    if (decodedToken.userId !== userIdFromParams) {
      console.log(decodedToken);
      const response = {
        status: false,
        message: `You Are not logged in Yet. Logged in User is: ${decodedToken.username}`,
        code: 403,
      };

      return res.status(403).send(response);
      // next();
    } else {
      // console.log(
      //   "You are Logged in: token: ",
      //   token,
      //   "Decoded token: ",
      //   decodedToken
      // );
      next();
    }
  });

  // next();
};

export default authMiddleware;
