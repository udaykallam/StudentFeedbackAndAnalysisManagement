import React, { useState, useEffect } from 'react';
import Home from "../Navbar.jsx";
import { toast } from 'react-toastify';
import { useAuth } from '../../store/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const AddCourse = () => {

//   const {user}=useAuth();

//   if (user.role !== 'ADMIN') {
//     return <Navigate to="/home" />;
// }

  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [yearOfOffering, setYearOfOffering] = useState('1'); 
  const [facultyIds, setFacultyIds] = useState([]); 
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/faculty/list'); 
        const data = await response.json();

        if (Array.isArray(data)) {
          setFacultyList(data);
        } else {
          toast.error('Invalid data format for faculty list');
        }
      } catch (error) {
        toast.error('Error fetching faculty list');
      }
    };
    fetchFaculty();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      courseCode,
      courseName,
      yearOfOffering: parseInt(yearOfOffering),
      facultyIds 
    };

    try {
      const response = await fetch('http://localhost:8080/api/admin/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      toast.success(`Course "${result.courseName}" added successfully!`);
      setCourseCode('');
      setCourseName('');
      setYearOfOffering('1');
      setFacultyIds([]);  
    } catch (error) {
      toast.error(`Error adding course: ${error.message}`);
    }
  };

  const handleFacultyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFacultyIds(selectedOptions);  
  };

  return (
    <>
      <Home />
      <div className="container mt-5">
        <h1 className="mb-4">Add a New Course</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="courseCode">Course Code:</label>
            <input 
              type="text" 
              className="form-control"
              id="courseCode"
              value={courseCode} 
              onChange={(e) => setCourseCode(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="courseName">Course Name:</label>
            <input 
              type="text" 
              className="form-control"
              id="courseName"
              value={courseName} 
              onChange={(e) => setCourseName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="yearOfOffering">Year of Offering:</label>
            <select 
              className="form-select" 
              id="yearOfOffering" 
              value={yearOfOffering} 
              onChange={(e) => setYearOfOffering(e.target.value)} 
              required
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="facultyIds">Select Faculty (hold Ctrl/Cmd to select multiple):</label>
            <select 
              multiple
              className="form-control"
              id="facultyIds" 
              value={facultyIds} 
              onChange={handleFacultyChange} 
              required
            >
              {facultyList.length > 0 ? (
                facultyList.map(faculty => (
                  <option key={faculty.facultyId} value={faculty.facultyId}>
                    {faculty.name} ({faculty.facultyId})  
                  </option>
                ))
              ) : (
                <option disabled>Loading faculty...</option>
              )}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Add Course</button>
        </form>
      </div>
    </>
  );
}

export default AddCourse;
