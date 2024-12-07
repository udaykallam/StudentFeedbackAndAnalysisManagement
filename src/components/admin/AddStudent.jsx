import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import Home from '../Navbar.jsx';
import { useAuth } from '../../store/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import Loading from '../Loading.jsx'
const AddStudent = () => {
    const [student, setStudent] = useState({
        universityId: '',
        currentYear: '',
        dateOfBirth: '',
        department: '',
        mail: '',
        mobileNumber: '',
        name: '',
    });

    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading
    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const validateForm = () => {
        const { universityId, mail, mobileNumber, currentYear } = student;
        if (universityId.length !== 10 || isNaN(universityId)) {
            toast.error('University ID must be 10 digits.');
            return false;
        }
        const mailPattern = /^[a-zA-Z0-9._%+-]+@kluniversity\.in$/;
        if (!mailPattern.test(mail)) {
            toast.error('Mail must be in the format of universityid@kluniversity.in.');
            return false;
        }
        if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
            toast.error('Mobile number must be 10 digits.');
            return false;
        }
        if (currentYear < 1 || currentYear > 4) {
            toast.error('Current Year must be between 1 and 4.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true); // Start loading
        try {
            const response = await fetch('http://localhost:8080/api/admin/add-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student),
            });

            if (response.ok) {
                toast.success('Student added successfully!');
                setStudent({
                    universityId: '',
                    currentYear: '',
                    dateOfBirth: '',
                    department: '',
                    mail: '',
                    mobileNumber: '',
                    name: '',
                });
            } else {
                const errorMessage = await response.text();
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!csvFile) {
            toast.error("Please select a CSV file to upload.");
            return;
        }

        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await fetch('http://localhost:8080/api/admin/upload-students', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success("CSV file uploaded successfully!");
                setCsvFile(null); // Clear file after upload
            } else {
                const errorMessage = await response.text();
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred during file upload. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleDownloadTemplate = () => {
        const csvTemplate = `universityId,name,currentYear,dateOfBirth,department,mail,mobileNumber\n1234567890,John Doe,3,2000-01-01,Computer Science,johndoe@kluniversity.in,9876543210`;
        const blob = new Blob([csvTemplate], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <Home />
            <div className="container mt-5">
                <h2>Add Student</h2>

                {/* Show Loading component if loading state is true */}
                {loading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">University ID</label>
                            <input
                                type="text"
                                className="form-control"
                                name="universityId"
                                value={student.universityId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={student.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Current Year</label>
                            <input
                                type="number"
                                className="form-control"
                                name="currentYear"
                                value={student.currentYear}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateOfBirth"
                                value={student.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <select
                                className="form-select"
                                name="department"
                                value={student.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="Computer Science">CSE</option>
                                <option value="Information Technology">ECE</option>
                                <option value="Electronics">EEE</option>
                                <option value="Mechanical Engineering">AIDS</option>
                                <option value="Civil Engineering">CSIT</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mail</label>
                            <input
                                type="email"
                                className="form-control"
                                name="mail"
                                value={student.mail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="mobileNumber"
                                value={student.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding Student...' : 'Add Student'}
                        </button>
                    </form>
                )}
                <hr />

                <center>
                    <h2>Add Students via Excel</h2>
                    <div className="mt-3">
                        <button className="btn btn-secondary" onClick={handleDownloadTemplate}>Download CSV Template</button>
                    </div>
                    <br />
                    <div className="mt-3">
                        <input type="file" accept=".csv" onChange={handleFileChange} />
                        <button className="btn btn-success ms-2" onClick={handleFileUpload} disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload CSV'}
                        </button>
                    </div>
                </center>
                <br />
                <br />
            </div>
        </>
    );
};

export default AddStudent;
