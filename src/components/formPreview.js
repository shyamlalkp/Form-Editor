import React, { useEffect, useState } from "react";

const FormPreview = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchFormData = async () => {
      const response = await fetch(`/api/form/${formId}`);
      const data = await response.json();
      setForm(data);
    };

    fetchFormData();
  }, [formId]);

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const submitForm = async () => {
    const formData = { formId, responses: [] };
    for (const [questionId, answer] of Object.entries(responses)) {
      formData.responses.push({ questionId, answer });
    }

    try {
      const response = await fetch("/api/submit-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Form submitted successfully");
      } else {
        alert("Error submitting form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">{form.title}</h2>
      {form.headerImage && (
        <img
          src={form.headerImage}
          alt="Header"
          className="w-full h-40 object-cover mb-4"
        />
      )}
      {form.questions.map((question) => (
        <div key={question.id} className="p-4 border rounded mb-4">
          <h4 className="font-semibold">{question.label}</h4>
          {question.type === "CheckBox" && (
            <div>
              {question.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.checked)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {question.type === "Grid" && (
            <table className="table-auto border-collapse border border-gray-400 w-full text-left">
              <thead>
                <tr>
                  {question.grid.columns.map((column, index) => (
                    <th key={index} className="border px-4 py-2">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.grid.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border px-4 py-2">{row}</td>
                    {question.grid.columns.map((_, colIndex) => (
                      <td key={colIndex} className="border px-4 py-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      <button
        onClick={submitForm}
        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
      >
        Submit Form
      </button>
    </div>
  );
};

export default FormPreview;
