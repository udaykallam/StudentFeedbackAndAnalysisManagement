import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Home from "../Navbar";

const FeedbackList = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/feedback/forms")
      .then((res) => setForms(res.data))
      .catch((error) => console.error("Error fetching feedback forms:", error));
  }, []);

  const fillForm = (formId) => {
    navigate(`/feedback/${formId}`); 
  };

  return (
    <>
      <Home />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Feedback Forms</h2>
        {forms.length > 0 ? (
          <div className="row">
            {forms.map((form) => (
              <div key={form.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{form.formName}</h5>
                    <button
                      onClick={() => fillForm(form.id)}
                      className="btn btn-primary w-100"
                    >
                      Fill Form
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No feedback forms available.</p>
        )}
      </div>
    </>
  );
};

export default FeedbackList;
