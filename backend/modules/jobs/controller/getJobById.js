const mongoose = require("mongoose");
const getJobById = async (req, res) => {
  const id = req.params.id;
  const JobModel = mongoose.model("Job");
  const job = await JobModel.findById(id);
  console.log(job);
  res.status(200).send({ data: job });
};
module.exports = getJobById;
