const mongoose = require("mongoose");
const getJobs = async () => {
  const JobModel = mongoose.model("Job");
  const jobs = await JobModel.find();
};
modules.exports = getJobs;
