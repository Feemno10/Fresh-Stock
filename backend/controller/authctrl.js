const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../model/user_model');


exports.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role } = req.body;

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ"
            });
        }

        // ค่า default ถ้าไม่ส่ง role มา
        const userRole = role || 'staff';

        // จำกัด role ที่สมัครเองได้
        if (!['staff', 'viewer'].includes(userRole)) {
            return res.status(400).json({
                message: "ไม่สามารถสมัคร role นี้ได้"
            });
        }

        const exist = await User.checkemail(email);
        if (exist) {
            return res.status(400).json({
                message: "Email นี้ถูกใช้ไปแล้ว"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const userId = await User.createuser({
            email,
            password: hashed,
            first_name,
            last_name,
            role: userRole
        });

        res.status(201).json({
            message: "สร้างผู้ใช้สำเร็จ",
            data: {
                id: userId,
                email,
                first_name,
                last_name,
                role: userRole
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            message: "สมัครสมาชิกไม่สำเร็จ"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        if (!email || !password) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const user = await User.checkemail(email);  
        if (!user) {
            return res.status(401).json({ message: "Email หรือ Password ไม่ถูกต้อง" });
        }
          const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Email หรือ Password ไม่ถูกต้อง" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                avatar: user.avatar,
                status: user.status
            }
        });
    } catch (err) {
        console.error('Login Error', err);
        res.status(500).json({ message: "เข้าสู่ระบบไม่สำเร็จ" });
    }
};

