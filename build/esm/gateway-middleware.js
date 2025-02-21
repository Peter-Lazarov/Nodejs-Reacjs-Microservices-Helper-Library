import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from './error-handler';
import fs from 'fs';
import path from 'path';
const secretPath = path.resolve(__dirname, '../../../../../../../.gateway-test');
let apiGatewayToken = '';
if (fs.existsSync(secretPath)) {
  apiGatewayToken = fs.readFileSync(secretPath, 'utf8').trim();
  //console.log(apiGatewayToken);
} else {
  console.log(`The file does not exist. Please create the file at the expected path: ${secretPath} with the gateway token.`);
}
const tokens = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];
export function verifyGatewayRequest(req, _res, next) {
  var _req$headers, _req$headers2;
  if (!((_req$headers = req.headers) != null && _req$headers.gatewaytoken)) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  const token = (_req$headers2 = req.headers) == null ? void 0 : _req$headers2.gatewaytoken;
  if (!token) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  try {
    const payload = JWT.verify(token, apiGatewayToken);
    if (!tokens.includes(payload.id)) {
      throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
    }
  } catch (error) {
    throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  next();
}
//# sourceMappingURL=gateway-middleware.js.map