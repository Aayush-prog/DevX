const mongoose = require("mongoose");
const hire = async (req, res) => {
  const { applicationId } = req.params;
  const JobModel = mongoose.model("Job");
  const UserModel = mongoose.model("User");
  const ApplicationModel = mongoose.model("Application");
  const application = await ApplicationModel.findById(applicationId);
  const job = await JobModel.findByIdAndUpdate(application.job, {
    status: "In progress",
    applicants: [],
    developer: application.developer,
  });
  const dev = await UserModel.findByIdAndUpdate(application.developer, {
    $push: { ongoingJobs: application.job },
    $pull: {
      applied: application.job,
    },
  });
};
module.exports = hire;
