const { pool } = require('./conn');

/* ===========================
   ADD STOCK LOG
=========================== */
async function addStockLog(data) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO stock_logs
       (product_id, type, quantity, remark, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.product_id,
        data.type,      // IN | OUT | ADJUST
        data.quantity,
        data.remark || null,
        data.user_id
      ]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* ===========================
   UPDATE PRODUCT QUANTITY
=========================== */
async function updateProductStock(product_id, quantity) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE products
       SET quantity = quantity + ?
       WHERE id = ?`,
      [quantity, product_id]
    );
  } finally {
    conn.release();
  }
}

/* ===========================
   SET PRODUCT STOCK (ADJUST)
=========================== */
async function setProductStock(product_id, quantity) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE products
       SET quantity = ?
       WHERE id = ?`,
      [quantity, product_id]
    );
  } finally {
    conn.release();
  }
}

/* ===========================
   GET STOCK LOGS
=========================== */
async function getStockLogs() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT s.id, s.type, s.quantity, s.remark, s.created_at,
              p.name AS product_name,
              u.first_name, u.last_name
       FROM stock_logs s
       JOIN products p ON s.product_id = p.id
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return rows;
  } finally {
    conn.release();
  }
}

/* ===========================
   GET STOCK LOG BY PRODUCT
=========================== */
async function getStockLogsByProduct(product_id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT * FROM stock_logs
       WHERE product_id = ?
       ORDER BY created_at DESC`,
      [product_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

module.exports = {
  addStockLog,
  updateProductStock,
  setProductStock,
  getStockLogs,
  getStockLogsByProduct
};