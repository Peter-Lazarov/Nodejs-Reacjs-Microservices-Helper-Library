import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from './error-handler';
import fs from 'fs';
import path from 'path';

const secretPath = path.resolve(__dirname, 'secret.txt');
const apiGatewayToken = fs.readFileSync(secretPath, 'utf8').trim();

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export function verifyGatewayRequest(req: Request, _res: Response, next: NextFunction): void {
  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(token, apiGatewayToken) as { id: string; iat: number };
    if (!tokens.includes(payload.id)) {
      throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
    }
  } catch (error) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  next();
}
