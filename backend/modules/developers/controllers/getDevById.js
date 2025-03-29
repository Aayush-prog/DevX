const mongoose = require("mongoose");
const getDevById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const UserModel = mongoose.model("User");
  const developer = await UserModel.findById(id).populate("completedJobs");
  res.status(200).send({ data: developer });
};
module.exports = getDevById;
