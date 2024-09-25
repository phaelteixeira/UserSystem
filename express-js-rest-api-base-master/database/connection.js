var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '1q2w3e',
      database : 'apiusers'
    }
  });

module.exports = knex