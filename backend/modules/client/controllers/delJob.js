const mongoose = require("mongoose");
const delJob = async (req, res) => {
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const { jobId } = req.params;
  try {
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this job",
      });
    }

    await JobModel.findByIdAndDelete(jobId);
    if (job.status === "Completed") {
      await UserModel.updateOne(
        { _id: req.user._id },
        { $pull: { completedJobs: new mongoose.Types.ObjectId(`{jobId}`) } }
      );
    } else if (job.status === "In Progress") {
      await UserModel.updateOne(
        { _id: req.user._id },
        { $pull: { ongoingJobs: new mongoose.Types.ObjectId(`{jobId}`) } }
      );
    } else {
      await UserModel.updateOne(
        { _id: req.user._id },
        { $pull: { openJobs: new mongoose.Types.ObjectId(`{jobId}`) } }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};

module.exports = delJob;