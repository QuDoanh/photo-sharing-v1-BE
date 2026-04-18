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
      "_id  first_name last_name  location description occupation",
    );

    if (!userById) {
      res.status(400).json({ message: "Không tìm thấy user!" });
    }
    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

module.exports = { getUserList, getUserById };
