const mongoose = require("mongoose");
const createJob = async (req, res) => {
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const { title, description, budget, requiredTags } = req.body;
  try {
    const newJob = await JobModel.create({
      title,
      description,
      budget,
      requiredTags,
      client: req.user._id,
    });
    await UserModel.updateOne(
      { _id: req.user._id },
      {
        $push: { openJobs: newJob._id },
      }
    );
    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};
modeul.exports = createJob;
