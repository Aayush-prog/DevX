const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
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
      type: [String],
      default: [],
    },
    applied: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "User",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Job", jobSchema);