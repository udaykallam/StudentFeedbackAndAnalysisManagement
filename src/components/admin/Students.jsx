import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import Home from '../Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../../store/AuthContext';
import { Navigate } from 'react-router-dom';

const Students = () => {

    // const {user}=useAuth();

    // if (user.role !== 'ADMIN') {
    //     return <Navigate to="/home" />;
    // }

    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/admin/students')
            .then(response => {
                setStudents(response.data);
                setFilteredStudents(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = students.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.universityId.toLowerCase().includes(query) ||
            student.mail.toLowerCase().includes(query) ||
            student.department.toLowerCase().includes(query) ||
            student.mobileNumber.includes(query) ||
            student.currentYear.toString().includes(query)
        );
        setFilteredStudents(filtered);
    };

    const deleteStudent = (id) => {
        axios.delete(`http://localhost:8080/api/admin/students/${id}`)
            .then(() => {
                setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
                setFilteredStudents(prevStudents => prevStudents.filter(student => student.id !== id));
                toast.success('Student removed successfully');
            })
            .catch(error => {
                console.error(error);
                toast.error('Error in removing student');
            });
    };

    const handleUpdate = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleSave = () => {
        axios.put(`http://localhost:8080/api/admin/students/${selectedStudent.id}`, selectedStudent)
            .then(() => {
                setStudents(prevStudents => 
                    prevStudents.map(stu => (stu.id === selectedStudent.id ? selectedStudent : stu))
                );
                setFilteredStudents(prevStudents => 
                    prevStudents.map(stu => (stu.id === selectedStudent.id ? selectedStudent : stu))
                );
                toast.success('Data updated successfully');
                setShowModal(false);
            })
            .catch(error => {
                console.error(error);
                toast.error('Error in updating data');
            });
    };

    return (
        <>
        <Home/>
        <div className="container mt-5">
            <h2>Students List</h2>

            {/* Search Bar */}
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by Name, University ID, Email, Department, etc."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>RefID</th>
                        <th>Name</th>
                        <th>University ID</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.universityId}</td>
                            <td>{student.mail}</td>
                            <td>{student.mobileNumber}</td>
                            <td>{student.department}</td>
                            <td>{student.currentYear}</td>
                            <td>
                                <Button 
                                    variant="warning" 
                                    className="me-2" 
                                    onClick={() => handleUpdate(student)}
                                >
                                    Update
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={() => deleteStudent(student.id)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Modal */}
            {selectedStudent && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formStudentName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedStudent.name}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStudentUniversityId">
                                <Form.Label>University ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedStudent.universityId}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, universityId: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStudentEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedStudent.mail}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, mail: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStudentMobileNumber">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedStudent.mobileNumber}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, mobileNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStudentDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedStudent.department}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStudentYear">
                                <Form.Label>Current Year</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedStudent.currentYear}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, currentYear: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
        </>
    );
};

export default Students;
