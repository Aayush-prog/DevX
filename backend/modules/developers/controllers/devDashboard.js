const mongoose = require("mongoose");

const devDashboard = async (req, res) => {
  const UserModel = mongoose.model("User");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  });
  res.status(200).send({ data: getUser });
};

module.exports = devDashboard;
