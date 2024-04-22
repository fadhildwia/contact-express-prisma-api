import { prismaClient } from "../applications/database.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    try {
      const accessToken = authHeader.split(' ')[1];
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

      await prismaClient.user.findUnique({
        where: {
          username: decoded.userId,
        },
      });
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
