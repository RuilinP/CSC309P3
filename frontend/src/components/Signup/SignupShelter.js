import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/login-signup.css';
import '../../assets/styles/main.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { login } from '../../utils/auth';

function SignupShelter() {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        organization: '',
        email: '',
        'phone_number': '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        password: '',
        'mission_statement': '',
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
                `http://localhost:8000/accounts/shelters/`,
                signupForm,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            ).then(async (response) => {
                await login(signupForm.email, signupForm.password);
                navigate(`/signup/shelter/done`);
            });
        }  catch(error) {
        }
    };

    return (
        <main className="login-signup-main">
            <div className="login-signup-box">
                <div>
                    <h3 className="fw-bold">Create a Pet Shelter Account</h3>
                    <p className="fs-6"><span className="fw-bold">Are you a Pet Seeker?</span> Sign up <span className="link-dark" role="button" onClick={() => { navigate(`/signup/seeker`) }}>here</span>.</p>
                </div>

                <Form className="p-0" noValidate validated={validated} onSubmit={ (event) => handleSubmit(event) }>
                    <Form.Group className="mb-3" controlId="organization">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control required type="text" placeholder="Enter organization here" value={ signupForm.organization } onChange={ (event) => setSignupForm({ ...signupForm, organization: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your organization's name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email here" value={ signupForm.email } onChange={ (event) => setSignupForm({ ...signupForm, email: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone-number">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control required type="text" placeholder="Enter phone number here" value={ signupForm.phone_number } onChange={ (event) => setSignupForm({ ...signupForm, 'phone_number': event.target.value }) } />
                        <Form.Text muted>
                            Example format: 123-456-7890
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control required type="text" placeholder="Enter address here" value={ signupForm.address } onChange={ (event) => setSignupForm({ ...signupForm, address: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>Country</Form.Label>
                        <Form.Control required type="text" placeholder="Enter country here" value={ signupForm.country } onChange={ (event) => setSignupForm({ ...signupForm, country: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your country.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="state">
                        <Form.Label>State/Province</Form.Label>
                        <Form.Control required type="text" placeholder="Enter state/province here" value={ signupForm.state } onChange={ (event) => setSignupForm({ ...signupForm, state: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your state/province.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control required type="text" placeholder="Enter city here" value={ signupForm.city } onChange={ (event) => setSignupForm({ ...signupForm, city: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your city.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="zip">
                        <Form.Label>Zip/Postal Code</Form.Label>
                        <Form.Control required type="text" placeholder="Enter zip/postal code here" value={ signupForm.zip } onChange={ (event) => setSignupForm({ ...signupForm, zip: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your zip/postal code.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Enter password here" value={ signupForm.password } onChange={ (event) => setSignupForm({ ...signupForm, password: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your password.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="mission-statement">
                        <Form.Label>Mission Statement</Form.Label>
                        <Form.Control required as="textarea" rows="3" placeholder="Enter mission statement here" value={ signupForm.mission_statement } onChange={ (event) => setSignupForm({ ...signupForm, 'mission_statement': event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your mission statement.
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

export default SignupShelter;
