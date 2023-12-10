import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/login-signup.css';
import '../../assets/styles/main.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { login, getAccessToken } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

function SignupSeekerContinued() {
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        first_name: '',
    });
    const [signupForm, setSignupForm] = useState({
        'phone_number': '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        preferences: [],
    });

    useEffect(() => {
        const token = getAccessToken();
        let tokenUser;
        if (token) {
            tokenUser = jwtDecode(token); 
        } else {
            navigate(`/404`);
        }

        async function fetchAccount() {
            try {
                const response = await axios.get(`http://localhost:8000/accounts/seekers/${tokenUser.user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                });
                setAccount(response.data);
            } catch(error) {
            }
        }

        fetchAccount();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        updateAccount();
    };

    const updateAccount = async () => {
        const token = getAccessToken();
        let tokenUser;
        if (token) {
            tokenUser = jwtDecode(token); 
        } else {
            navigate(`/404`);
        }

        const updatedData = {};
        for (let [key, value] of Object.entries(signupForm)) {
            if (value.length > 0) {
                updatedData[key] = value;
            }
        }

        if (Object.keys(updatedData).length === 0) {
            navigate(`/signup/seeker/done`);
            return;
        }

        try {
            await axios.patch(
                `http://localhost:8000/accounts/seekers/${tokenUser.user_id}/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        'Content-Type': 'application/json',
                    }
                }
            ).then((response) => {
                navigate(`/signup/seeker/done`);
            });
        }  catch(error) {
        }
    };

    return (
        <main className="login-signup-main">
            <div className="login-signup-box">
                <div>
                    <h3 className="fw-bold">Almost Done, {account.first_name}!</h3>
                    <p className="fs-6"><span className="fw-bold">This is optional.</span> Help us find the perfect pet for you by filling in a bit more information.</p>
                </div>

                <Form className="p-0" onSubmit={ (event) => handleSubmit(event) }>
                    <Form.Group className="mb-3" controlId="phone-number">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone number here" value={ signupForm.phone_number } onChange={ (event) => setSignupForm({ ...signupForm, 'phone_number': event.target.value }) } />
                        <Form.Text muted>
                            Example format: 123-456-7890
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter address here" value={ signupForm.address } onChange={ (event) => setSignupForm({ ...signupForm, address: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" placeholder="Enter country here" value={ signupForm.country } onChange={ (event) => setSignupForm({ ...signupForm, country: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your country.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="state">
                        <Form.Label>State/Province</Form.Label>
                        <Form.Control type="text" placeholder="Enter state/province here" value={ signupForm.state } onChange={ (event) => setSignupForm({ ...signupForm, state: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your state/province.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" placeholder="Enter city here" value={ signupForm.city } onChange={ (event) => setSignupForm({ ...signupForm, city: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your city.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="zip">
                        <Form.Label>Zip/Postal Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter zip/postal code here" value={ signupForm.zip } onChange={ (event) => setSignupForm({ ...signupForm, zip: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your zip/postal code.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="preferences">
                        <Form.Label>Preferences</Form.Label>
                        {
                            ['dog', 'cat', 'hamster', 'bird', 'rabbit'].map((pet) => {
                                return <Form.Check
                                    type="checkbox"
                                    checked={Object.values(account.preferences).some((preference) =>
                                        preference.preference === pet
                                    )}
                                    value={pet}
                                    label={pet[0].toUpperCase() + pet.slice(1)}
                                    id={`preference-${pet}`}
                                    onClick={() => setSignupForm({ ...signupForm, preferences: [
                                        ...signupForm.preferences,
                                        { preference: pet }
                                    ] })}
                                />;
                            })
                        }
                    </Form.Group>

                    <div className="mt-4">
                        <div className="multiple-buttons">
                            <button className="btn btn-dark align-self-start" type="submit">Continue</button>
                            <button className="btn btn-outline-dark align-self-start" onClick={() => navigate(`/signup/seeker/done`)}>Skip</button>
                        </div>
                        <div className="mt-1">
                            <p className="fs-6">You can always update this information from your profile.</p>
                        </div>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export default SignupSeekerContinued;
