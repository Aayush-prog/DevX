const mongoose = require("mongoose");
const getDevById = async (req, res) => {
  const id = req.params;
  const UserModel = mongoose.model("User");
  const developer = await UserModel.findById(id);
  res.status(200).send({ data: developer });
};
module.exports = getDevById;
