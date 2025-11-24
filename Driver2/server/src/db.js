'use strict';

const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cnpm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true,
  namedPlaceholders: true
});

/**
 * Execute a query with the given SQL and parameters
 * @param {string} sql - The SQL query
 * @param {Array|Object} [params] - The query parameters
 * @returns {Promise<Array>} - The query results
 */
async function query(sql, params) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', {
      sql,
      params,
      error: error.message
    });
    throw error;
  }
}

/**
 * Execute a query and return the result object (for INSERT, UPDATE, DELETE)
 * @param {string} sql - The SQL query
 * @param {Array|Object} [params] - The query parameters
 * @returns {Promise<Object>} - The result object
 */
async function execute(sql, params) {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', {
      sql,
      params,
      error: error.message
    });
    throw error;
  }
}

module.exports = {
  query,
  execute,
  pool // Export pool for transactions if needed
};
