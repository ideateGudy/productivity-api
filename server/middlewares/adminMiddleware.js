// import authMiddleware from "./authMiddleware";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (decodedToken.role !== "admin") {
        const response = {
          status: false,
          message: `You are not authorized to view this page`,
        };
        return res.status(401).send(response);
      }
    });
  }
  next();
};

//MORE WORK TO BE DONE HERE TO HANDLE ERROR WHILE SWITCHING USERS

export default adminAuthMiddleware;
