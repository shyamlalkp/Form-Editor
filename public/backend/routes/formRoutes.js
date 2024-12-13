const express = require("express");
const { Form } = require("./models");
const router = express.Router();

// Route to create a form
router.post("/create-form", async (req, res) => {
  const { title, headerImage, questions } = req.body;

  try {
    const form = new Form({ title, headerImage, questions });
    await form.save();
    res
      .status(201)
      .json({ message: "Form created successfully", formId: form._id });
  } catch (error) {
    res.status(400).json({ message: "Error creating form", error });
  }
});

// Route to get the form data by ID (for preview)
router.get("/form/:id", async (req, res) => {
  const formId = req.params.id;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: "Error fetching form", error });
  }
});

// Route to save form responses
router.post("/submit-response", async (req, res) => {
  const { formId, responses } = req.body;

  try {
    const formResponse = new Response({ formId, responses });
    await formResponse.save();
    res.status(201).json({ message: "Response saved successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error saving response", error });
  }
});

module.exports = router;
