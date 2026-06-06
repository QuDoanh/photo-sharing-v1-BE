const User = require("../db/userModel");

const getUserList = async (req, res) => {
  try {
    const userList = await User.find({}, "_id first_name last_name");
    res.status(200).json(userList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách user", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await User.findById(
      id,
      "_id first_name last_name location description occupation"
    );

    if (!userById) {
      return res.status(400).json({ message: "Không tìm thấy user!" });
    }
    return res.status(200).json(userById);
  } catch (error) {
    return res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const {
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    } = req.body;

    if (!login_name || login_name.trim() === "") {
      return res.status(400).json({ message: "login_name không được để trống" });
    }

    const existing = await User.findOne({ login_name: login_name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "password không được để trống" });
    }

    if (!first_name || first_name.trim() === "") {
      return res.status(400).json({ message: "first_name không được để trống" });
    }

    if (!last_name || last_name.trim() === "") {
      return res.status(400).json({ message: "last_name không được để trống" });
    }

    const newUser = new User({
      login_name: login_name.trim(),
      password: password.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location || "",
      description: description || "",
      occupation: occupation || "",
    });

    await newUser.save();

    return res.status(200).json({
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserList, getUserById, registerUser };
