const bcrypt = require("bcrypt");
const User = require("../model/user_model");


exports.getProfile = async (req, res) => {
  try {
    const user = await User.checkid(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    delete user.password;

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { email, first_name, last_name } = req.body;
    const id = req.user.id;

    if (!email || !first_name || !last_name) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const exist = await User.checkemail(email);
    if (exist && exist.id !== id) {
      return res.status(400).json({ message: "Email ถูกใช้แล้ว" });
    }

    await User.updateuser(id, email, first_name, last_name);

    res.json({ success: true, message: "แก้ไขข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "แก้ไขข้อมูลไม่สำเร็จ" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req.user.id;

    if (!password) {
      return res.status(400).json({ message: "กรุณากรอกรหัสผ่านใหม่" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.updatepassword(id, hash);

    res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เปลี่ยนรหัสผ่านไม่สำเร็จ" });
  }
};