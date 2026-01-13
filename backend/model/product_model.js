const { pool } = require('./conn');

/* ======================
   GET
====================== */

// ดึงสินค้าทั้งหมด
async function listProducts() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, name, category_id, unit, min_stock
       FROM products
       ORDER BY id DESC`
    );
    return rows;
  } finally {
    conn.release();
  }
}

// ดึงสินค้าตาม id
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

// ดึงสินค้าตาม category
async function getProductByCategory(category_id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT * FROM products WHERE category_id = ?`,
      [category_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

/* ======================
   CREATE
====================== */

async function createProduct(data) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO products
       (name, category_id, unit, min_stock)
       VALUES (?, ?, ?, ?)`,
      [
        data.name,
        data.category_id,
        data.unit,
        data.min_stock || 0
      ]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* ======================
   UPDATE
====================== */

async function updateProduct(id, data) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE products
       SET name = ?, category_id = ?, unit = ?, min_stock = ?
       WHERE id = ?`,
      [
        data.name,
        data.category_id,
        data.unit,
        data.min_stock,
        id
      ]
    );
  } finally {
    conn.release();
  }
}

/* ======================
   DELETE
====================== */

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

module.exports = {
  listProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
