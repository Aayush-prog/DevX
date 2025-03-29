const mongoose = require("mongoose");
const uploadQuestion = async (req, res) => {
  const QuestionModel = mongoose.model("Question");
  try {
    const { question, options, correctAnswer } = req.body;
    const newQuestion = await QuestionModel.create({
      question,
      options,
      correctAnswer,
    });
    res.status(200).send({ newQuestion });
  } catch (e) {
    res.status(400).send({ failed });
  }
};
module.exports = uploadQuestion;
