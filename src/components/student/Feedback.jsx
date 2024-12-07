import React, { useState, useEffect } from 'react';
import Home from '../Navbar';
import axios from 'axios';

const Feedback = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`/api/feedback/questions/${courseId}`)
      .then((response) => setQuestions(response.data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, [courseId]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedback = {
      courseId,
      answers,
    };

    axios.post('/api/feedback/submit', feedback)
      .then(() => alert('Feedback submitted successfully'))
      .catch((error) => console.error('Error submitting feedback:', error));
  };

  return (
    <>
      <Home />
      <div className="container mt-5">
        <h3>Feedback Form</h3>
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.id} className="card shadow mb-3">
              <div className="card-body">
                <h5>{question.questionText}</h5>
                {question.options.map((option, index) => (
                  <div key={index} className="form-check">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      className="form-check-input"
                      onChange={() => handleOptionChange(question.id, option)}
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
