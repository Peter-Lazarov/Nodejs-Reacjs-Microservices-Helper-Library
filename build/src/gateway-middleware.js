"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGatewayRequest = verifyGatewayRequest;
var tslib_1 = require("tslib");
var jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
var error_handler_1 = require("./error-handler");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var secretPath = path_1.default.resolve(__dirname, 'secret.txt');
var apiGatewayToken = fs_1.default.readFileSync(secretPath, 'utf8').trim();
var tokens = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];
function verifyGatewayRequest(req, _res, next) {
    var _a, _b;
    if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.gatewaytoken)) {
        throw new error_handler_1.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
    }
    var token = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.gatewaytoken;
    if (!token) {
        throw new error_handler_1.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
    }
    try {
        var payload = jsonwebtoken_1.default.verify(token, apiGatewayToken);
        if (!tokens.includes(payload.id)) {
            throw new error_handler_1.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request payload is invalid');
        }
    }
    catch (error) {
        throw new error_handler_1.NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method: Request not coming from api gateway');
    }
    next();
}
//# sourceMappingURL=gateway-middleware.js.map