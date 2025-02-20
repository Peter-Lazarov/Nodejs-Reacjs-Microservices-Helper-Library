"use strict";

exports.__esModule = true;
exports.verifyGatewayRequest = verifyGatewayRequest;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _errorHandler = require("./error-handler");
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const secretPath = _path.default.resolve(__dirname, 'secret.txt');
const apiGatewayToken = _fs.default.readFileSync(secretPath, 'utf8').trim();
const tokens = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];
function verifyGatewayRequest(req, _res, next) {
  var _req$headers, _req$headers2;
  if (!((_req$headers = req.headers) != null && _req$headers.gatewaytoken)) {
    throw new _errorHandler.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  const token = (_req$headers2 = req.headers) == null ? void 0 : _req$headers2.gatewaytoken;
  if (!token) {
    throw new _errorHandler.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  try {
    const payload = _jsonwebtoken.default.verify(token, apiGatewayToken);
    if (!tokens.includes(payload.id)) {
      throw new _errorHandler.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
    }
  } catch (error) {
    throw new _errorHandler.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
  }
  next();
}
//# sourceMappingURL=gateway-middleware.js.map