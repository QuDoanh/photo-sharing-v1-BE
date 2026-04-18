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

module.exports = {
  getPhotosOfUser,
};