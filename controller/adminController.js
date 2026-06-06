const User = require("../db/userModel");
const { createToken, verifyToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { login_name, password } = req.body;

    if (!login_name) {
      return res.status(400).json({ message: "login_name không hợp lệ" });
    }

    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).json({ message: "login_name không tồn tại" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const userInfo = {
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const token = createToken(userInfo);

    return res.status(200).json({
      ...userInfo,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Chưa đăng nhập" });
  }

  return res.status(200).json({ message: "Đã đăng xuất" });
};

const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(200).json(null);
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    return res.status(200).json({
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    return res.status(200).json(null);
  }
};

module.exports = { login, logout, getCurrentUser };
