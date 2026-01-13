const Product = require('../model/product_model');

/**
 * GET /products
 */
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.listProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลสินค้าไม่สำเร็จ" });
  }
};

/**
 * POST /products
 * admin, staff
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, unit, min_stock } = req.body;

    if (!name || !category_id || !unit) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const id = await Product.createProduct({
      name,
      category_id,
      unit,
      min_stock
    });

    res.status(201).json({
      message: "เพิ่มสินค้าสำเร็จ",
      product_id: id
    });
  } catch (err) {
    res.status(500).json({ message: "เพิ่มสินค้าไม่สำเร็จ" });
  }
};

/**
 * PUT /products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    await Product.updateProduct(req.params.id, req.body);
    res.json({ message: "แก้ไขสินค้าสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "แก้ไขสินค้าไม่สำเร็จ" });
  }
};

/**
 * DELETE /products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.json({ message: "ลบสินค้าสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบสินค้าไม่สำเร็จ" });
  }
};

/**
 * POST /products/:id/stock
 */
exports.updateStock = async (req, res) => {
  try {
    const { quantity, action, note } = req.body;

    await Product.updateStock(
      req.params.id,
      quantity,
      req.user.id,
      action,
      note
    );

    res.json({ message: "ปรับสต็อกสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ปรับสต็อกไม่สำเร็จ" });
  }
};

/**
 * GET /products/low-stock
 */
exports.lowStock = async (req, res) => {
  try {
    const data = await Product.lowStockProducts();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ" });
  }
};