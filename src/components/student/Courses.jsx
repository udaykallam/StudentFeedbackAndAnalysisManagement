import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../Navbar';
import { useAuth } from '../../store/AuthContext';

const Courses = () => {
  const { studentId } = useAuth();
  const [courses, setCourses] = useState([]);
  const [offeringYear, setOfferingYear] = useState(1); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/student/courses/${offeringYear}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        toast.error(`Error fetching courses: ${error.message}`);
      }
    };

    fetchCourses();
  }, [offeringYear]);

  useEffect(() => {
    console.log("Student ID:", studentId); 
  }, [studentId]);
  

  const handleRegister = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const response = await fetch(`http://localhost:8080/api/student/courses/${courseId}/instructors`);
      if (!response.ok) throw new Error('Failed to fetch instructors');
      const data = await response.json();
      setInstructors(data);
      setShowModal(true); 
    } catch (error) {
      toast.error(`Error fetching instructors: ${error.message}`);
    }
  };

  const confirmRegistration = async () => {
    if (!selectedInstructor) {
      toast.error('Please select an instructor before confirming registration.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/student/register/${selectedCourse}/${studentId}/${selectedInstructor}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructorId: selectedInstructor }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error registering for course: ${errorData.message}`);
        return;
      }

      toast.success('Successfully registered for the course!');
      setShowModal(false); 
    } catch (error) {
      toast.error(`Error registering for course: ${error.message}`);
    }
  };

  return (
    <>
      <Home />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Available Courses</h1>
        <div className="mb-4">
          <label htmlFor="offeringYear" className="form-label">Select Offering Year:</label>
          <select
            id="offeringYear"
            className="form-select"
            onChange={(e) => setOfferingYear(e.target.value)}
            value={offeringYear}
          >
            <option value={1}>Year 1</option>
            <option value={2}>Year 2</option>
            <option value={3}>Year 3</option>
            <option value={4}>Year 4</option>
          </select>
        </div>

        <div className="row">
          {courses.map((course) => (
            <div className="col-md-4 mb-4" key={course.id}>
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h4 className="my-0">{course.courseName}</h4>
                </div>
                <div className="card-body">
                  <h1 className="card-title pricing-card-title">{course.courseCode}</h1>
                  <p className="card-text">Year of Offering: {course.yearOfOffering}</p>
                  <button
                    className="btn btn-lg btn-block btn-outline-primary"
                    onClick={() => handleRegister(course.id)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Instructor</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="instructorSelect">Choose an instructor:</label>
                  <select
                    id="instructorSelect"
                    className="form-select"
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                  >
                    <option value="">Select an instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={confirmRegistration}>
                    Confirm Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Courses;
