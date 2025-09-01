
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ProjectError from "../helper/error";

// Extend Request type to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    // Expecting format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      const err = new ProjectError("Token missing or malformed");
      err.statusCode = 401;
      throw err;
    }

    let decodedToken: { userId: string; iat: number; exp: number };

    try {
      decodedToken = jwt.verify(token, "secretmyverysecretkey") as {
        userId: string;
        iat: number;
        exp: number;
      };
    } catch (error) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    if (!decodedToken) {
      const err = new ProjectError("Not authenticated");
      err.statusCode = 401;
      throw err;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthenticated };
