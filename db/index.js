// import pg from 'pg';
//destructuring the pool logic as that's the only thing we care about
//creating pool that will connect to postgress database
const { Pool } = require('pg')
 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yelp',
    password: 'Melissa09',
    port: 5432,
  })
 
module.exports = {
  query: (text, params) => pool.query(text, params),
} 
