import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import Home from '../Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../../store/AuthContext';
import { Navigate } from 'react-router-dom';

const Faculty = () => {

    // const {user}=useAuth();

    // if (user.role !== 'ADMIN') {
    //     return <Navigate to="/home" />;
    // }

    const [faculties, setFaculties] = useState([]);
    const [filteredFaculties, setFilteredFaculties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/admin/faculty')
            .then(response => {
                setFaculties(response.data);
                setFilteredFaculties(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredFaculties(faculties.filter(faculty => 
            faculty.name.toLowerCase().includes(term) || 
            faculty.facultyId.toLowerCase().includes(term) ||
            faculty.department.toLowerCase().includes(term)
        ));
    };

    const deleteFaculty = (id) => {
        axios.delete(`http://localhost:8080/api/admin/faculty/${id}`)
            .then(() => {
                setFaculties(prevFaculties => prevFaculties.filter(faculty => faculty.id !== id));
                setFilteredFaculties(prevFaculties => prevFaculties.filter(faculty => faculty.id !== id));
                toast.success('Faculty removed successfully');
            })
            .catch(error => {
                console.error(error);
                toast.error('Error in removing faculty');
            });
    };

    const handleUpdate = (faculty) => {
        setSelectedFaculty(faculty);
        setShowModal(true);
    };

    const handleSave = () => {
        axios.put(`http://localhost:8080/api/admin/faculty/${selectedFaculty.id}`, selectedFaculty)
            .then(() => {
                setFaculties(prevFaculties => 
                    prevFaculties.map(fac => fac.id === selectedFaculty.id ? selectedFaculty : fac)
                );
                setFilteredFaculties(prevFaculties => 
                    prevFaculties.map(fac => fac.id === selectedFaculty.id ? selectedFaculty : fac)
                );
                toast.success('Data updated successfully');
                setShowModal(false);
            })
            .catch(error => console.error(error));
    };

    return (
        <>
        <Home/>
        <div className="container mt-5">
            <h2>Faculty List</h2>
            <Form.Control
                type="text"
                placeholder="Search by name, ID, or department"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3"
            />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>RefId</th>
                        <th>Name</th>
                        <th>Faculty ID</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Experience</th>
                        <th>Qualification</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFaculties.map(faculty => (
                        <tr key={faculty.id}>
                            <td>{faculty.id}</td>
                            <td>{faculty.name}</td>
                            <td>{faculty.facultyId}</td>
                            <td>{faculty.mail}</td>
                            <td>{faculty.department}</td>
                            <td>{faculty.experience}</td>
                            <td>{faculty.qualification}</td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleUpdate(faculty)}>Update</Button>
                                <Button variant="danger" onClick={() => deleteFaculty(faculty.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Update Modal */}
            {selectedFaculty && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Faculty</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFacultyName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedFaculty.name}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFacultyId">
                                <Form.Label>Faculty ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedFaculty.facultyId}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, facultyId: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFacultyMail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedFaculty.mail}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, mail: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFacultyDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedFaculty.department}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, department: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFacultyExperience">
                                <Form.Label>Experience</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedFaculty.experience}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, experience: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFacultyQualification">
                                <Form.Label>Qualification</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedFaculty.qualification}
                                    onChange={(e) => setSelectedFaculty({ ...selectedFaculty, qualification: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
        </>
    );
};

export default Faculty;
