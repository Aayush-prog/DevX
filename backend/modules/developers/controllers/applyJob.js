const mongoose = require("mongoose");
const applyJob = async (req, res) => {
  const JobModel = mongooose.model("job");
  const user = req.user;
  const jobId = req.params;
  try {
    const updated = await JobModel.findByIdAndUpdate(jobId, {
      $push: { applicants: user._id },
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
