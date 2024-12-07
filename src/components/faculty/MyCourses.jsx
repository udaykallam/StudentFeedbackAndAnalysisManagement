import React, { useEffect, useState } from "react";
import Home from "../Navbar";
import axios from "axios";
import { useAuth } from "../../store/AuthContext";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const { facultyId } = useAuth(); // Assuming facultyId comes from AuthContext

  // Fetch courses assigned to the faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/faculty/${facultyId}/courses`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [facultyId]);

  // Fetch students for a selected course
  const handleViewStudents = async (course) => {
    setSelectedCourse(course);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/faculty/${facultyId}/courses/${course.id}/students`
      );
      setStudents(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setStudents([]);
    setSelectedCourse(null);
  };

  return (
    <>
      <Home />
      <div className="container my-4">
        <h2 className="mb-4">My Courses</h2>
        <div className="row">
          {courses.map((course, index) => (
            <div className="col-md-4" key={course.id || `course-${index}`}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{course.courseName}</h5>
                  <p className="card-text">
                    <strong>Course Code:</strong> {course.courseCode} <br />
                    <strong>Year:</strong> {course.yearOfOffering}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewStudents(course)}
                  >
                    View Students
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to display students */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Students for {selectedCourse?.courseName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {students.length > 0 ? (
                  <ul className="list-group">
                    {students.map((student, index) => (
                      <li
                        className="list-group-item"
                        key={student.id || `student-${index}`}
                      >
                        {student.name} - {student.universityId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No students have registered for this course yet.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCourses;
