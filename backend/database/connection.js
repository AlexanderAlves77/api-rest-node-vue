var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'rska2022',
      database : 'blog_data'
    }
  });

module.exports = knex