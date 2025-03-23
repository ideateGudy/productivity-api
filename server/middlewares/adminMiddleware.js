// import authMiddleware from "./authMiddleware";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next(err);
    }

    if (decodedToken.role !== "admin") {
      const response = {
        status: false,
        message: `Access denied: You are not authorized to view this page`,
      };
      return res.status(403).send(response);
    }
    next();
  });
};

export default adminAuthMiddleware;
