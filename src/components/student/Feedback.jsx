import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Home from "../Navbar";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Feedback = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/feedback/forms/${formId}`)
      .then((res) => setForm(res.data))
      .catch((error) => console.error("Error fetching form data:", error));
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form || !form.id) {
      alert("Feedback form ID is missing.");
      return;
    }
    console.log(form.id);
    
  
    try {
      await axios.post("http://localhost:8080/api/feedback/submit", {
        feedbackFormId: form.id, 
        responses: responses,
      });
  
      toast.success("Feedback submitted successfully!");
      navigate('/feedbacklist');
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error.message);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };
  

  const updateResponse = (questionId, answer) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  return form ? (
    <>
      <Home />
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center mb-4">{form.formName}</h3>

          {form.questions.map((q) => (
            <div key={q.id} className="mb-4">
              <label className="form-label">{q.questionText}</label>
              <div className="form-check">
                {q.options.map((option, index) => (
                  <div key={index} className="form-check">
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      id={`${q.id}-${index}`}
                      className="form-check-input"
                      onChange={(e) => updateResponse(q.id, e.target.value)}
                    />
                    <label htmlFor={`${q.id}-${index}`} className="form-check-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-50">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </>
  ) : (
    <div className="text-center mt-5">
      <p>Loading form...</p>
    </div>
  );
};

export default Feedback;
