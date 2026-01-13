const { pool } = require('./conn');

/* ===== GET ===== */
async function listCategories() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT id, name, created_at FROM categories ORDER BY id DESC"
    );
    return rows;
  } finally {
    conn.release();
  }
}

async function getCategoryById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM categories WHERE id=?",
      [id]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}

/* ===== CREATE ===== */
async function createCategory(name) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* ===== UPDATE ===== */
async function updateCategory(id, name) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE categories SET name=? WHERE id=?",
      [name, id]
    );
  } finally {
    conn.release();
  }
}

/* ===== DELETE ===== */
async function deleteCategory(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "DELETE FROM categories WHERE id=?",
      [id]
    );
  } finally {
    conn.release();
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
