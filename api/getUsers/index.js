const { executeSQL } = require('../shared/rawmimarequest');

getUsers = function (context, req) {    
    const method = req.method.toLowerCase();
    var sql = "SELECT * FROM [dbo].[Users] FOR JSON AUTO;"

    executeSQL(context, sql)
}

module.exports = getUsers;

