import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/login-signup.css';

function Login() {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Initialize error state
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the tokens in local storage or context
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                // Redirect user or do something upon successful login
                navigate(`/`);
            } else {
                // Handle errors, e.g. display error message to the user
                setError('Incorrect email or password.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <main class="login-signup-main">
            <div class="login-signup-box">
                <h3 class="fw-bold">Welcome Back!</h3>

                { error ? 
                    <Alert variant="danger">
                        {error}
                    </Alert>
                : '' }

                <Form className="p-0 login-signup-form" noValidate onSubmit={ (event) => handleSubmit(event) }>
                    <Form.Group className="mb-1" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email here" value={ loginForm.email } onChange={ (event) => setLoginForm({ ...loginForm, email: event.target.value }) } />
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Enter password here" value={ loginForm.password } onChange={ (event) => setLoginForm({ ...loginForm, password: event.target.value }) } />
                    </Form.Group>
        
                    <div className="mt-1">
                        <button class="btn btn-dark align-self-start" type="submit" onclick="showError()">Login</button>
                        <div class="mt-1">
                            <p class="fs-6"><span class="fw-bold">Don't have an account?</span> Sign up <span role="button" class="link-dark" onClick={() => navigate(`/signup`)}>here</span>.</p>
                        </div>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export default Login;
