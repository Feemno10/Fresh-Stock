const { pool } = require('./conn');

/* ===========================
   CREATE PRODUCT
=========================== */
async function createProduct(data) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO products
       (name, category_id, unit, quantity, min_stock)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.category_id,
        data.unit,
        data.quantity || 0,
        data.min_stock || 0
      ]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* ===========================
   GET ALL PRODUCTS
=========================== */
async function getAllProducts() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT p.id, p.name, p.unit, p.quantity, p.min_stock,
              c.id AS category_id, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.id DESC`
    );
    return rows;
  } finally {
    conn.release();
  }
}

/* ===========================
   GET PRODUCT BY ID
=========================== */
async function getProductById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}

/* ===========================
   UPDATE PRODUCT
=========================== */
async function updateProduct(id, data) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE products
       SET name = ?, category_id = ?, unit = ?, quantity = ?, min_stock = ?
       WHERE id = ?`,
      [
        data.name,
        data.category_id,
        data.unit,
        data.quantity,
        data.min_stock,
        id
      ]
    );
  } finally {
    conn.release();
  }
}

/* ===========================
   DELETE PRODUCT
=========================== */
async function deleteProduct(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `DELETE FROM products WHERE id = ?`,
      [id]
    );
  } finally {
    conn.release();
  }
}

/* ===========================
   LOW STOCK ALERT
=========================== */
async function getLowStock() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, name, quantity, min_stock
       FROM products
       WHERE quantity <= min_stock`
    );
    return rows;
  } finally {
    conn.release();
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStock
};