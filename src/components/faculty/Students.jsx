import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import Home from '../Navbar';
import { toast } from 'react-toastify';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/faculty/students')
            .then(response => {
                setStudents(response.data);
                setFilteredStudents(response.data);
            })
            .catch(error => {
                console.error(error);
                toast.error('Error fetching student data');
            });
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

    return (
        <>
            <Home />
            <div className="container mt-5">
                <h2>Students List</h2>
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default Students;
