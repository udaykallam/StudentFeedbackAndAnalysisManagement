import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../store/AuthContext';
import Welcome from './Welcome';
import { Navigate } from 'react-router-dom';
import Loading from 'react-loading';

const Home = () => {

    const { user, isLoading, isLoggedIn, studentName, facultyName, adminName } = useAuth(); 

    if(isLoggedIn==false){
        return <Navigate to="/" />
    }

    const displayName = user.role === 'Student' ? studentName :
    user.role === 'Faculty' ? facultyName :
    user.role === 'ADMIN' ? "Admin" : user.name;


    if (isLoading) {
        return <Loading/>;
    }

    return (
        <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">Feedback</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    {
                        user.role=='ADMIN' && <Nav.Link href="/addstudent">Add Student</Nav.Link>
                    }
                     {
                        user.role=='ADMIN' && <Nav.Link href="/addfaculty">Add Faculty</Nav.Link>
                    }
                     {
                        user.role=='ADMIN' && <Nav.Link href="/addcourse">Add Course</Nav.Link>
                    }
                     {
                        user.role=='ADMIN' && <Nav.Link href="/students">Students</Nav.Link>
                    }
                     {
                        user.role=='ADMIN' && <Nav.Link href="/faculty">Faculty</Nav.Link>
                    }
                     {
                        user.role=='ADMIN' && <Nav.Link href="/addfeedback">Feedback</Nav.Link>
                    }
                       {
                        user.role=='ADMIN' && <Nav.Link href="/analysis">Analysis</Nav.Link>
                    }
                     {
                        user.role=='Student' && <Nav.Link href="/register">Register</Nav.Link>
                    }
                     {
                        user.role=='Student' && <Nav.Link href="/courses">My Courses</Nav.Link>
                    }
                      {
                        user.role=='Student' && <Nav.Link href="/feedbacklist">Feedback</Nav.Link>
                    }
                     {/* {
                        user.role=='Student' && <Nav.Link href="/viewfeedback">View Feedback</Nav.Link>
                    } */}
                     {
                        user.role=='Faculty' && <Nav.Link href="/mycourses">My courses</Nav.Link>
                    }
                      {
                        user.role=='Faculty' && <Nav.Link href="/student-info">Student Information</Nav.Link>
                    }
                     {
                        user.role=='Faculty' && <Nav.Link href="/analysis">Analysis</Nav.Link>
                    }

                </Nav>
                <Nav className="ms-auto">
                        <Nav.Item className="text-white me-3">
                            Welcome, {displayName}
                        </Nav.Item>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
            </Navbar.Collapse>
        </Navbar>
         {/* <Welcome/> */}
           </>
    );
};

export default Home;
