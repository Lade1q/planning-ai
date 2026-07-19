import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * Authentication guard middleware.
 * - Checks for Bearer token in Authorization header
 * - Verifies the access token
 * - Attaches userId and user payload to the request
 * - Returns 401 if token is missing, invalid, or expired
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    const decoded = verifyToken(token, secret);
    req.userId = decoded.userId;
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}
