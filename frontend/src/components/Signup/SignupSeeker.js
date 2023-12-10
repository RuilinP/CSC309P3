import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/login-signup.css';
import '../../assets/styles/main.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { login } from '../../utils/auth';

function SignupSeeker() {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        signup();
    };

    const signup = async () => {
        try {
            await axios.post(
                `http://localhost:8000/accounts/seekers/`,
                signupForm,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            ).then((response) => {
                login(signupForm.email, signupForm.password);
                navigate(`/signup/seeker/continued/`);
            });
        }  catch(error) {
        }
    };

    return (
        <main className="login-signup-main">
            <div className="login-signup-box">
                <div>
                    <h3 className="fw-bold">Create a Pet Seeker Account</h3>
                    <p className="fs-6"><span className="fw-bold">Are you a Pet Shelter?</span> Sign up <span className="link-dark" role="button" onClick={() => { navigate(`/signup/shelter`) }}>here</span>.</p>
                </div>

                <Form className="p-0" noValidate validated={validated} onSubmit={ (event) => handleSubmit(event) }>
                    <Form.Group className="mb-3" controlId="first-name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter first name here" value={ signupForm.first_name } onChange={ (event) => setSignupForm({ ...signupForm, first_name: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your first name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="first-name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter last name here" value={ signupForm.last_name } onChange={ (event) => setSignupForm({ ...signupForm, last_name: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your last name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email here" value={ signupForm.email } onChange={ (event) => setSignupForm({ ...signupForm, email: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Enter password here" value={ signupForm.password } onChange={ (event) => setSignupForm({ ...signupForm, password: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your password
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="mt-4">
                        <button className="btn btn-dark align-self-start" type="submit" >Signup</button>
                        <div className="mt-1">
                            <p className="fs-6"><span className="fw-bold">Already have an account?</span> Log in <span role="button" className="link-dark" onClick={() => { navigate('/login') }}>here</span>.</p>
                        </div>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export default SignupSeeker;
