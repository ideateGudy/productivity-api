import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // const token = req.cookies.jwt;
  const token = req.headers.authorization?.split(" ")[1];

  //Check if token exists
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      // console.log(err.message);
      // console.error("auth-----",err);
      if (err) {
        if (err.message === "jwt expired") {
          const response = {
            status: false,
            message: `Token Expired`,
            expiredAt: err.expiredAt,
          };
          return res.status(401).send(response);
        } else if (err.message === "invalid signature") {
          const response = {
            status: false,
            message: `Invalid Signature`,
          };
          return res.status(400).send(response);
        } else if (err.message === "jwt malformed") {
          const response = {
            status: false,
            message: `Token Malformed`,
          };
          return res.status(400).send(response);
        } else if (err.message === "invalid token") {
          const response = {
            status: false,
            message: `Invalid Token`,
          };
          return res.status(400).send(response);
        } else if (err.message.includes("Bad control character in string")) {
          const response = {
            status: false,
            message: `SyntaxError: Bad control character in string literal in JSON`,
          };
          return res.status(400).send(response);
        } else if (err.message.includes("is not valid JSON")) {
          const response = {
            status: false,
            message: `SyntaxError: Unexpected: token is not valid JSON`,
          };
          return res.status(400).send(response);
        } else if (err.message.includes("Expected ':' after ")) {
          const response = {
            status: false,
            message: `SyntaxError: Expected ':' after property name in JSON`,
          };
          return res.status(400).send(response);
        }
      }

      console.log(decodedToken);

      if (decodedToken.userId !== req.params.id) {
        console.log(decodedToken);
        const response = {
          status: false,
          message: `You Are not logged in Yet. Logged in User is: ${decodedToken.username}`,
        };
        // console.log("You Are not logged in Yet");
        // console.log(token);
        return res.status(401).send(response);
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
  } else {
    const response = {
      status: false,
      message: `You are not logged in. Please Login to view this page`,
    };
    return res.status(401).send(response);
  }

  // next();
};

export default authMiddleware;
