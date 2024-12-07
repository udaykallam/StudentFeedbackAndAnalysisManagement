import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo/kllogo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { storeTokenInLS } = useAuth();
    // const {user} = useAuth();
    const navigate = useNavigate();

    // if (user){
    //     navigate('/home');
    // }

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // toast.success('Login Successful');
            storeTokenInLS(data.token, data.role);
            // if (data.role === 'ADMIN') {
            //     navigate('/admin');
            // } else if (data.role === 'Student') {
            //     navigate('/student');
            // } else if (data.role === 'Faculty') {
            //     navigate('/faculty');
            // }
            navigate('/home');
        } else {
            toast.error('Invalid Credentials');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <br/>
                    <div className="text-center mb-4">
                        <center>
                        <img 
                            src={logo}
                            alt="Logo" 
                            className="img-fluid" 
                            style={{ maxWidth: '300px',alignSelf: 'center'}}/>
                        </center>
                    </div>
                    <br/>
                    <br/>
                    <form onSubmit={handleLogin} className="bg-light p-4 border rounded">
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <br/>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <p className="mt-3">
                            <a href="/forgot-password">Forgot Password?</a>
                        </p>
                        <center>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                        </center>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
