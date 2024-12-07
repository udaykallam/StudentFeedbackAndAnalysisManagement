import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Home from "../Navbar";

const FeedbackForms = () => {
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/feedback/forms")
      .then((res) => setFeedbackForms(res.data))
      .catch((error) => console.error("Error fetching feedback forms:", error));
  }, []);

  const handleAnalysis = (formId) => {
    setSelectedFormId(formId);
  };

  return (
    <>
      <Home />
      <div className="container my-5">
        <h3 className="mb-4">Feedback Forms</h3>
        <div className="row">
          {feedbackForms.map((form) => (
            <div key={form.id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{form.formName}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAnalysis(form.id)}
                  >
                    Show Analysis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedFormId && <Analysis formId={selectedFormId} />}
      </div>
    </>
  );
};

const Analysis = ({ formId }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (!formId) return;

    axios.get(`http://localhost:8080/api/feedback/forms/${formId}`)
      .then((res) => setQuestions(res.data.questions))
      .catch((error) => console.error("Error fetching questions:", error));

    axios.get(`http://localhost:8080/api/feedback/responses/${formId}`)
      .then((res) => setResponses(res.data))
      .catch((error) => console.error("Error fetching responses:", error));
  }, [formId]);

  const renderPieChart = (questionId, options) => {
    const data = responses.reduce((acc, r) => {
      const answer = r.responses[questionId];
      if (answer) {
        acc[answer] = (acc[answer] || 0) + 1;
      }
      return acc;
    }, {});

    const pieData = Object.entries(data).map(([key, value]) => ({ label: key, value }));

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(`#pieChart-${questionId}`)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie(pieData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

    svg
      .selectAll("text")
      .data(pie(pieData))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data.label)
      .style("fill", "#fff")
      .style("font-size", "12px");
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Analysis for Feedback Form {formId}</h3>
      {questions.map((question) => (
        <div key={question.id} className="mb-4">
          <h5>{question.questionText}</h5>
          <svg id={`pieChart-${question.id}`} className="d-block mx-auto"></svg>
          {renderPieChart(question.id, question.options)}
        </div>
      ))}
    </div>
  );
};

export default FeedbackForms;
