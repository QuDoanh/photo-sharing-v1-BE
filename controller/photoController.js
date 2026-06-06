const User = require("../db/userModel");
const Photo = require("../db/photoModel");

const getPhotosOfUser = async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return response.status(400).json({
        message: "User ID không hợp lệ hoặc không tồn tại",
      });
    }

    const photos = await Photo.find({ user_id: userId }).lean();

    const userIds = new Set();
    photos.forEach((photo) => {
      if (photo.comments && photo.comments.length > 0) {
        photo.comments.forEach((comment) => {
          userIds.add(comment.user_id.toString());
        });
      }
    });

    const commentUsers = await User.find(
      { _id: { $in: Array.from(userIds) } },
      "_id first_name last_name"
    ).lean();

    const userMap = {};
    commentUsers.forEach((u) => {
      userMap[u._id.toString()] = u;
    });

    const result = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: (photo.comments || []).map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: userMap[comment.user_id.toString()] || null,
      })),
    }));

    response.status(200).json(result);
  } catch (error) {
    response.status(400).json({
      message: "Không lấy được ảnh của user",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const photoId = req.params.photo_id;
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Nội dung comment không được để trống" });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(400).json({ message: "Không tìm thấy ảnh" });
    }

    const newComment = {
      comment: comment.trim(),
      date_time: new Date(),
      user_id: req.user._id,
    };

    photo.comments.push(newComment);
    await photo.save();

    const savedComment = photo.comments[photo.comments.length - 1];
    const user = await User.findById(req.user._id, "_id first_name last_name");

    return res.status(200).json({
      _id: savedComment._id,
      comment: savedComment.comment,
      date_time: savedComment.date_time,
      user: user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file ảnh" });
    }

    const newPhoto = new Photo({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: req.user._id,
      comments: [],
    });

    await newPhoto.save();

    return res.status(200).json({
      _id: newPhoto._id,
      file_name: newPhoto.file_name,
      date_time: newPhoto.date_time,
      user_id: newPhoto.user_id,
      comments: [],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPhotosOfUser,
  addComment,
  uploadPhoto,
};
