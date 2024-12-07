import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "../Navbar";

const ViewFeedback = () => {
  const [feedbackForms, setFeedbackForms] = useState([]);

  useEffect(() => {
    fetchFeedbackForms();
  }, []);

  const fetchFeedbackForms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/feedback/all");
      setFeedbackForms(response.data);
    } catch (error) {
      console.error("Error fetching feedback forms:", error);
    }
  };

  return (
    <>
      <Home />
      <div style={styles.container}>
        <h2 style={styles.heading}>Feedback Forms</h2>
        {feedbackForms.length > 0 ? (
          feedbackForms.map((form, index) => (
            <div key={index} style={styles.formContainer}>
              <h3 style={styles.formName}>{form.formName}</h3>
              {form.questions.map((question, qIndex) => (
                <div key={qIndex} style={styles.questionContainer}>
                  <p style={styles.questionText}>{qIndex + 1}. {question.questionText}</p>
                  <ul>
                    {question.options.map((option, oIndex) => (
                      <li key={oIndex} style={styles.option}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p style={styles.noData}>No feedback forms available.</p>
        )}
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
  formContainer: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  formName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "10px",
  },
  questionContainer: {
    marginBottom: "10px",
  },
  questionText: {
    fontWeight: "bold",
    color: "#333",
  },
  option: {
    marginLeft: "20px",
    color: "#555",
  },
  noData: {
    textAlign: "center",
    color: "#777",
  },
};

export default ViewFeedback;
