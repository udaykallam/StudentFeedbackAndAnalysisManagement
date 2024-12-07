import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import Home from '../Navbar';

const ViewCourses = () => {
  const { studentId, authorizationToken } = useAuth(); 
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/student/${studentId}/courses`, {
          method: 'GET',
          headers: {
            Authorization: authorizationToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRegisteredCourses(data);
        } else {
          console.error('Failed to fetch registered courses');
        }
      } catch (error) {
        console.error('Error fetching registered courses:', error);
      }
    };

    if (studentId) {
      fetchRegisteredCourses();
    }
  }, [studentId, authorizationToken]);

  return (
    <div>
      <Home />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Your Registered Courses</h2>
        <div className="row">
          {registeredCourses.length > 0 ? (
            registeredCourses.map((course) => (
              <div key={course.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="my-0">{course.courseName}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text"><strong>Course Code:</strong> {course.courseCode}</p>
                    <p className="card-text"><strong>Year:</strong> {course.yearOfOffering}</p>
                    <p className="card-text"><strong>Selected Faculty:</strong> {course.selectedFaculty?.name || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning text-center" role="alert">
                No registered courses found.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;
