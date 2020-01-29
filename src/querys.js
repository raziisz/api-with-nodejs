const Pool = require('pg').Pool
const { db } = require('./../.env');

const pool = new Pool(db)

module.exports = pool