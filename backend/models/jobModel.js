const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["open", "in progress", "completed"],
      default: "open",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    requiredTags: {
      type: [String], // Array of tags required for the job
      default: [],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
