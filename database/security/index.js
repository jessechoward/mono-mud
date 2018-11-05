/**
 * This module is designed to be provide an interface to a backend
 * set of security functions so the actual libraries used can be
 * replaced/updated with "hopefully" little impact to the rest of
 * the application.
 * 
 * Security is important!
 */

const passwordHash = require('./passwordHash');
exports.hashPassword = passwordHash.hash;
exports.verifyPassword = passwordHash.verify;

const authToken = require('./authToken');
exports.signToken = authToken.sign;
exports.verifyToken = authToken.verify;
exports.revokeToken = authToken.revoke;
