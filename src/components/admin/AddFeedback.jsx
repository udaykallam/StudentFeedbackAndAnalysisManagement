import React, { useState } from "react";
import axios from "axios";
import Home from "../Navbar";

const AddFeedback = () => {
  const [formName, setFormName] = useState(""); 
  const [questions, setQuestions] = useState([
    { questionText: "", options: [""] } 
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/feedback/create", {
        formName,
        questions,
      });
      alert("Feedback form created successfully!");
      setFormName(""); 
      setQuestions([{ questionText: "", options: [""] }]); 
    } catch (error) {
      console.error(error);
      alert("Failed to create feedback form. Please try again.");
    }
  };

  const addQuestion = () => setQuestions([...questions, { questionText: "", options: [""] }]);

  const updateQuestionText = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value; 
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <>
      <Home />
      <div style={styles.container}>
        <h2 style={styles.heading}>Create Feedback Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Form Title"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            style={styles.input}
          />
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} style={styles.questionContainer}>
              <input
                type="text"
                placeholder={`Question ${questionIndex + 1}`}
                value={question.questionText}
                onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                style={styles.input}
              />
              <div style={styles.optionsContainer}>
                <p style={styles.optionsLabel}>Options:</p>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} style={styles.optionItem}>
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        updateOption(questionIndex, optionIndex, e.target.value)
                      }
                      style={styles.optionInput}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  style={styles.addButton}
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addQuestion} style={styles.addButton}>
            Add Question
          </button>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};


const styles = {
  container: {
    margin: "20px auto",
    padding: "20px",
    maxWidth: "800px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  questionContainer: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  optionsContainer: {
    marginTop: "10px",
  },
  optionsLabel: {
    fontWeight: "bold",
  },
  optionItem: {
    marginBottom: "10px",
  },
  optionInput: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  addButton: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default AddFeedback;
