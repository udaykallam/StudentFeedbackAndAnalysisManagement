import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "../Navbar";

const AddFeedback = () => {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]); // Stores available courses
  const [expirationDate, setExpirationDate] = useState("");
  const [questions, setQuestions] = useState([]);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses/all"); // Example endpoint
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Add a new question to the form
  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", ""] }]);
  };

  // Update question text
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  // Update question options
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const feedbackForm = {
      courseId: parseInt(courseId),
      title,
      expirationDate,
      questions,
    };

    try {
      await axios.post("http://localhost:8080/api/feedback/create", feedbackForm);
      alert("Feedback form created successfully!");
    } catch (error) {
      console.error("Error creating feedback form:", error);
      alert("Failed to create feedback form.");
    }
  };

  return (
    <>
    <Home/>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Feedback Form</h2>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Feedback Title
        </label>
        <input
          type="text"
          id="title"
          className="form-control"
          placeholder="Enter feedback title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="courseId" className="form-label">
          Select Course
        </label>
        <select
          id="courseId"
          className="form-select"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="expirationDate" className="form-label">
          Expiration Date
        </label>
        <input
          type="datetime-local"
          id="expirationDate"
          className="form-control"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-4">
          <h5>Question {qIndex + 1}</h5>
          <div className="mb-2">
            <label htmlFor={`question-${qIndex}`} className="form-label">
              Question Text
            </label>
            <input
              type="text"
              id={`question-${qIndex}`}
              className="form-control"
              placeholder="Enter question"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
          </div>
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="mb-2">
              <label
                htmlFor={`option-${qIndex}-${oIndex}`}
                className="form-label"
              >
                Option {oIndex + 1}
              </label>
              <input
                type="text"
                id={`option-${qIndex}-${oIndex}`}
                className="form-control"
                placeholder={`Enter option ${oIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
              />
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() =>
              setQuestions(
                questions.map((q, index) =>
                  index === qIndex
                    ? { ...q, options: [...q.options, ""] }
                    : q
                )
              )
            }
          >
            Add Option
          </button>
        </div>
      ))}
      <button className="btn btn-success" onClick={handleSubmit}>
        Submit Feedback Form
      </button>
    </div>
    </>
  );
};

export default AddFeedback;
