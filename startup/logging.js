const winston = require('winston');
//require('express-async-errors');
require('winston-mongodb');
module.exports = function() {
    /* process.on('uncaughtException', (err) => {
        console.log('We got an uncaught exception');
        winston.error(err.message,err);
        process.exit(1);
    }); */
    winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true}), 
    new winston.transports.File({filename: 'uncaughtExceptions.log'}));
    process.on('unhandledRejection', (err) => {
    // console.log('We got an uncaught exception');
    // winston.error(err.message,err);
    // process.exit(1);
    throw err;
    });  
    winston.add(winston.transports.File, {filename: 'logfile.log'});
    winston.add(winston.transports.MongoDB, {db: 'mongodb://localhost/vidly', level: 'info'});
};