const jwt = require('jsonwebtoken');
const config = require('config');
// Executes it after admin user
module.exports = function (req, res, next) {
    //403: Forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
    next();
}