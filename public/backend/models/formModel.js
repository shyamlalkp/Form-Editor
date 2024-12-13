const mongoose = require("mongoose");

// Schema for form questions
const questionSchema = new mongoose.Schema({
  type: String,
  label: String,
  image: String,
  options: [String],
  grid: {
    rows: [String],
    columns: [String],
  },
});

// Schema for form data
const formSchema = new mongoose.Schema({
  title: String,
  headerImage: String,
  questions: [questionSchema],
});

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      answer: mongoose.Schema.Types.Mixed,
    },
  ],
});

const Form = mongoose.model("Form", formSchema);
const Response = mongoose.model("Response", responseSchema);

module.exports = { Form, Response };
