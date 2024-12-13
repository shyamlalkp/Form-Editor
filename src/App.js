import React, { useState } from "react";
import FormPreview from "./components/formPreview";

const FormEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewLink, setPreviewLink] = useState("");

  const saveForm = async () => {
    const formData = {
      title: formTitle,
      headerImage,
      questions,
    };

    try {
      const response = await fetch("/api/create-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Form created successfully");
        setPreviewLink(`/preview/${result.formId}`);
      } else {
        alert("Error creating form");
      }
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type,
        label: "",
        image: null,
        options: type === "CheckBox" ? [""] : [],
        grid: { rows: [""], columns: [""] },
      },
    ]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(questions.map((q) => (q.id === id ? updatedQuestion : q)));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleHeaderImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setHeaderImage(URL.createObjectURL(file));
    }
  };

  const handleQuestionImageChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedQuestion = questions.find((q) => q.id === id);
      updateQuestion(id, {
        ...updatedQuestion,
        image: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Form Editor</h1>

      {!isPreviewMode ? (
        <>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div className="mb-4">
            {headerImage && (
              <img
                src={headerImage}
                alt="Header"
                className="w-full h-40 object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => addQuestion("Text")}
            >
              Add Text Question
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => addQuestion("CheckBox")}
            >
              Add Checkbox Question
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              onClick={() => addQuestion("Grid")}
            >
              Add Grid Question
            </button>
          </div>
          <button
            className="flex bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 justify-between px-2 py-2"
            onClick={FormPreview}
          >
            Save Form
          </button>

          {/* Display Preview Link */}
          {previewLink && (
            <p className="mt-4 text-blue-500">
              Preview Form:{" "}
              <a href={previewLink} target="_blank" rel="noop">
                {previewLink}
              </a>
            </p>
          )}

          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="p-4 border rounded shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Question Label"
                    value={question.label}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        ...question,
                        label: e.target.value,
                      })
                    }
                  />
                  <button
                    className="text-red-500 ml-4"
                    onClick={() => removeQuestion(question.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-2">
                  {question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      className="w-full h-32 object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleQuestionImageChange(question.id, e)}
                  />
                </div>

                {question.type === "CheckBox" && (
                  <div>
                    <h4 className="font-semibold mb-2">Options:</h4>
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const updatedOptions = [...question.options];
                            updatedOptions[index] = e.target.value;
                            updateQuestion(question.id, {
                              ...question,
                              options: updatedOptions,
                            });
                          }}
                        />
                        <button
                          className="text-red-500 ml-2"
                          onClick={() => {
                            const updatedOptions = question.options.filter(
                              (_, i) => i !== index
                            );
                            updateQuestion(question.id, {
                              ...question,
                              options: updatedOptions,
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                      onClick={() =>
                        updateQuestion(question.id, {
                          ...question,
                          options: [...question.options, ""],
                        })
                      }
                    >
                      Add Option
                    </button>
                  </div>
                )}

                {question.type === "Grid" && (
                  <div>
                    <h4 className="font-semibold mb-2">Grid:</h4>
                    <div className="mb-2">
                      <label className="block font-semibold">Rows:</label>
                      {question.grid.rows.map((row, index) => (
                        <input
                          key={index}
                          type="text"
                          className="w-full p-2 border rounded mb-2"
                          placeholder={`Row ${index + 1}`}
                          value={row}
                          onChange={(e) => {
                            const updatedRows = [...question.grid.rows];
                            updatedRows[index] = e.target.value;
                            updateQuestion(question.id, {
                              ...question,
                              grid: { ...question.grid, rows: updatedRows },
                            });
                          }}
                        />
                      ))}
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={() =>
                          updateQuestion(question.id, {
                            ...question,
                            grid: {
                              ...question.grid,
                              rows: [...question.grid.rows, ""],
                            },
                          })
                        }
                      >
                        Add Row
                      </button>
                    </div>
                    <div>
                      <label className="block font-semibold">Columns:</label>
                      {question.grid.columns.map((column, index) => (
                        <input
                          key={index}
                          type="text"
                          className="w-full p-2 border rounded mb-2"
                          placeholder={`Column ${index + 1}`}
                          value={column}
                          onChange={(e) => {
                            const updatedColumns = [...question.grid.columns];
                            updatedColumns[index] = e.target.value;
                            updateQuestion(question.id, {
                              ...question,
                              grid: {
                                ...question.grid,
                                columns: updatedColumns,
                              },
                            });
                          }}
                        />
                      ))}
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={() =>
                          updateQuestion(question.id, {
                            ...question,
                            grid: {
                              ...question.grid,
                              columns: [...question.grid.columns, ""],
                            },
                          })
                        }
                      >
                        Add Column
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="mt-6 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            onClick={() => setIsPreviewMode(true)}
          >
            Preview Form
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">{formTitle}</h2>
          {headerImage && (
            <img
              src={headerImage}
              alt="Header"
              className="w-full h-40 object-cover mb-4"
            />
          )}
          {questions.map((question) => (
            <div key={question.id} className="p-4 border rounded mb-4">
              <h4 className="font-semibold">{question.label}</h4>
              {question.image && (
                <img
                  src={question.image}
                  alt="Question"
                  className="w-full h-32 object-cover mb-2"
                />
              )}
              {question.type === "CheckBox" && (
                <ul>
                  {question.options.map((option, index) => (
                    <li key={index} className="mb-2">
                      <label>
                        <input type="checkbox" className="mr-2" /> {option}
                      </label>
                    </li>
                  ))}
                </ul>
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
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setIsPreviewMode(false)}
          >
            Edit Form
          </button>
        </>
      )}
    </div>
  );
};

export default FormEditor;
