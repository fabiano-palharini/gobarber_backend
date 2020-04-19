import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as TokenPayload; // vc força decodedToken a ser do tipo TokenPayload >> by ts

    // deixa de dar erro por causa da definicao de tipos "express.d.ts"
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
}
