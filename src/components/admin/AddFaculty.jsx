import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import Home from '../Navbar.jsx';
import { useAuth } from '../../store/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import Loading from '../Loading.jsx';

const AddFaculty = () => {
  const [faculty, setFaculty] = useState({
    name: '',
    facultyId: '',
    mail: '',
    department: '',
    experience: '',
    qualification: '',
  });

  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty({ ...faculty, [name]: value });
  };

  const validateForm = () => {
    const { facultyId, mail, name, department, experience, qualification } = faculty;

    if (!name || !facultyId || !mail || !department || !experience || !qualification) {
      toast.error('All fields are required.');
      return false;
    }

    if (facultyId.length !== 4 || isNaN(facultyId)) {
      toast.error('Faculty ID must be exactly 4 digits.');
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@kluniversity\.in$/;
    if (!emailPattern.test(mail)) {
      toast.error('Email must be in the format of facultyname@kluniversity.in.');
      return false;
    }

    if (isNaN(experience) || experience < 0) {
      toast.error('Experience must be a non-negative number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); 

    try {
      const response = await fetch('http://localhost:8080/api/admin/add-faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faculty),
      });

      if (response.ok) {
        toast.success('Faculty added successfully!');
        setFaculty({
          name: '',
          facultyId: '',
          mail: '',
          department: '',
          experience: '',
          qualification: '',
        });
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false); 
    }
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file.');
      return;
    }

    setLoading(true); 

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('http://localhost:8080/api/admin/upload-faculty', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Faculty added successfully from CSV!');
        setCsvFile(null);
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while uploading CSV. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['name', 'facultyId', 'mail', 'department', 'experience', 'qualification'];
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'faculty_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Home />
      <div className="container mt-5">
        <h2>Add Faculty</h2>
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={faculty.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Faculty ID</label>
              <input
                type="text"
                className="form-control"
                name="facultyId"
                value={faculty.facultyId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mail</label>
              <input
                type="text"
                className="form-control"
                name="mail"
                value={faculty.mail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                name="department"
                value={faculty.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Experience (in years)</label>
              <input
                type="number"
                className="form-control"
                name="experience"
                value={faculty.experience}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Qualification</label>
              <input
                type="text"
                className="form-control"
                name="qualification"
                value={faculty.qualification}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding Faculty...' : 'Add Faculty'}
            </button>
          </form>
        )}

        <hr className="my-4" />
        <center>
          <h3>Add Faculty via Excel</h3>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept=".csv"
              onChange={handleCsvChange}
            />
          </div>
          <button className="btn btn-primary me-2" onClick={handleCsvUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadTemplate}>
            Download CSV Template
          </button>
        </center>
      </div>

      <br />
      <br />
    </>
  );
};

export default AddFaculty;
