const Product = require('../model/product_model');

/* ===========================
   CREATE PRODUCT
=========================== */
exports.create = async (req, res) => {
  try {
    const { name, category_id, unit, quantity, min_stock } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อสินค้า" });
    }

    const productId = await Product.createProduct({
      name,
      category_id,
      unit,
      quantity,
      min_stock
    });

    res.status(201).json({
      message: "เพิ่มสินค้าสำเร็จ",
      id: productId
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "เพิ่มสินค้าไม่สำเร็จ" });
  }
};

/* ===========================
   GET ALL PRODUCTS
=========================== */
exports.list = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "โหลดสินค้าไม่สำเร็จ" });
  }
};

/* ===========================
   GET PRODUCT BY ID
=========================== */
exports.detail = async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "โหลดสินค้าไม่สำเร็จ" });
  }
};

/* ===========================
   UPDATE PRODUCT
=========================== */
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    await Product.updateProduct(id, req.body);

    res.json({ message: "แก้ไขสินค้าสำเร็จ" });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "แก้ไขสินค้าไม่สำเร็จ" });
  }
};

/* ===========================
   DELETE PRODUCT
=========================== */
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    await Product.deleteProduct(id);

    res.json({ message: "ลบสินค้าสำเร็จ" });

  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "ลบสินค้าไม่สำเร็จ" });
  }
};

/* ===========================
   LOW STOCK
=========================== */
exports.lowStock = async (req, res) => {
  try {
    const products = await Product.getLowStock();
    res.json(products);
  } catch (err) {
    console.error("LOW STOCK ERROR:", err);
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ" });
  }
};