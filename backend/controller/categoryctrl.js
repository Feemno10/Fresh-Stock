const Category = require('../model/category_model');

/* ===== GET ===== */
exports.listCategories = async (req, res) => {
  try {
    const data = await Category.listCategories();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "โหลดหมวดหมู่ไม่สำเร็จ" });
  }
};

/* ===== CREATE ===== */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรุณากรอกชื่อหมวดหมู่" });
    }

    const id = await Category.createCategory(name);
    res.status(201).json({
      success: true,
      message: "เพิ่มหมวดหมู่สำเร็จ",
      id
    });
  } catch (err) {
    res.status(500).json({ message: "เพิ่มหมวดหมู่ไม่สำเร็จ" });
  }
};

/* ===== UPDATE ===== */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await Category.updateCategory(id, name);

    res.json({
      success: true,
      message: "แก้ไขหมวดหมู่สำเร็จ"
    });
  } catch (err) {
    res.status(500).json({ message: "แก้ไขหมวดหมู่ไม่สำเร็จ" });
  }
};

/* ===== DELETE ===== */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.deleteCategory(id);

    res.json({
      success: true,
      message: "ลบหมวดหมู่สำเร็จ"
    });
  } catch (err) {
    res.status(500).json({ message: "ลบหมวดหมู่ไม่สำเร็จ" });
  }
};
