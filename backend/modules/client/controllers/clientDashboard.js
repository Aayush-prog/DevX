const mongoose = require("mongoose");

const clientDashboard = async (req, res) => {
  const UserModel = mongoose.model("User");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  });
  res.status(200).send({ data: getUser });
  const jobs = await JobModel.find({ developer: getUser._id });
  res.status(200).send({ data: getUser, jobs });
};

module.exports = clientDashboard;