const User = require('../model/user_model');


exports.listUsers = async (req, res) => {
  try {
    const users = await User.listUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error('LIST USERS ERROR:', err);
    res.status(500).json({
      message: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.checkid(id);

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    delete user.password;

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลผู้ใช้ไม่สำเร็จ" });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, role } = req.body;

    if (!first_name || !last_name || !role) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    if (!['admin', 'staff', 'viewer'].includes(role)) {
      return res.status(400).json({ message: "role ไม่ถูกต้อง" });
    }

    await User.updateUserByAdmin(id, {
      first_name,
      last_name,
      role
    });

    res.json({
      success: true,
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ"
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({
      message: "อัปเดตข้อมูลผู้ใช้ไม่สำเร็จ"
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const bcrypt = require('bcrypt');

    const hash = await bcrypt.hash('123456', 10);
    await User.updatepassword(id, hash);

    res.json({
      success: true,
      message: "รีเซ็ตรหัสผ่านเป็น 123456 เรียบร้อย"
    });
  } catch (err) {
    res.status(500).json({
      message: "รีเซ็ตรหัสผ่านไม่สำเร็จ"
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.deleteuser(id);

    res.json({
      success: true,
      message: "ลบผู้ใช้งานเรียบร้อย"
    });
  } catch (err) {
    res.status(500).json({
      message: "ลบผู้ใช้งานไม่สำเร็จ"
    });
  }
};
