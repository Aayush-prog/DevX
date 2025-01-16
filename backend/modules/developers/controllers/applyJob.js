const mongoose = require("mongoose");
const applyJob = async (req, res) => {
  console.log("here in apply");
  const JobModel = mongoose.model("Job");
  const ApplicationModel = mongoose.model("Application");
  const UserModel = mongoose.model("User");
  const user = req.user;
  const { jobId } = req.params;
  const { coverLetter, timeframe, budget } = req.body;
  try {
    const newApplication = await ApplicationModel.create({
      coverLetter,
      timeframe,
      budget,
      developer: req.user._id,
      job: jobId,
    });

    const updated = await JobModel.findByIdAndUpdate(jobId, {
      $push: { applicants: req.user._id },
    });
    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      $push: { applied: jobId },
    });
    res.status(200).json({
      status: "success",
      message: "Job applied successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};
module.exports = applyJob;
