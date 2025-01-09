const mongoose = require("mongoose");
const getJobs = async (req, res) => {
  console.log("in job");
  const JobModel = mongoose.model("Job");
  const jobs = await JobModel.find();
  res.status(200).send({ data: jobs });
};
module.exports = getJobs;
