const firebird = require("node-firebird");
require('dotenv').config();

const dbOptions = {
    host: '127.0.0.1',
    port: 3050,
    database: 'caminho do seu banco',    
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true, 
    role: null,            
    pageSize: 4096      
};

function executeQuery(ssql, params, callback){
    firebird.attach(dbOptions, function(err, db) {            
        if (err) {
            return callback(err, []); 
        } 
        db.query(ssql, params, function(err, result) {
            db.detach();
            if (err) {
                return callback(err, []);
            } else {
                return callback(undefined, result);
            }
        });
    });
}

async function executeQueryTrx(transaction, ssql, parameters){
    return new Promise(function (resolve, reject) {
        transaction.query(ssql, parameters, function(err, result){
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    });
}

module.exports = { executeQuery, firebird, dbOptions, executeQueryTrx };
