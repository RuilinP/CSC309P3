import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';
import '../../assets/styles/profile.css';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

function ProfileShelter() {
    const navigate = useNavigate();
    const [account, setAccount] = useState({
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
        avatar: null,
    });
    const [oldAccount, setOldAccount] = useState({
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
        avatar: null,
    });
    const [validated, setValidated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const token = getAccessToken();
    let tokenUser;
    if (token) {
        tokenUser = jwtDecode(token); 
    } else {
        navigate(`/404`);
    }

    useEffect(() => {
        async function fetchAccount() {
            try {
                const response = await axios.get(`http://localhost:8000/accounts/shelters/${tokenUser.user_id}/`, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                });
                const { password, ...rest } =  response.data;
                rest.password = '';
                setAccount(rest);
                setOldAccount(rest);
            } catch(error) {
            }
        }

        fetchAccount();
    }, []);

    useEffect(() => {
        if (isEditing) {
            setValidated(false);
        }
    }, [isEditing]);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        updateAccount();
    };

    const updateAvatar = async (avatarImage) => {
        let form_data = new FormData();
        form_data.append('avatar', avatarImage, avatarImage.name);

        try {
            await axios.patch(
                `http://localhost:8000/accounts/shelters/${tokenUser.user_id}/`,
                form_data,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            ).then((response) => {
                setAccount({ ...account, avatar: URL.createObjectURL(avatarImage) });
                setOldAccount(account);
            });
        }  catch(error) {
        }
    }

    const updateAccount = async () => {
        let updatedData = {};
        if (account.password.length > 0) {
            const { id, last_login, avatar, ...rest } = account;
            updatedData = rest;
        } else {
            const { id, last_login, avatar, password, ...rest } = account;
            updatedData = rest;
        }

        try {
            await axios.patch(
                `http://localhost:8000/accounts/shelters/${tokenUser.user_id}/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        'Content-Type': 'application/json',
                    }
                }
            ).then((response) => {
                setOldAccount(account);
                setIsEditing(false);
            });
        }  catch(error) {
        }
    }

    return (
        <main className="profile-main">
            <div className="d-flex flex-column align-items-center gap-3">
                <div className="profile-picture">
                    <img src={ account.avatar ? account.avatar : "../../assets/images/default-profile-picture.png" } alt="profile picture" />
                </div>
                <label for="avatar" className="btn btn-dark">
                    Change Photo
                    <Form.Control id="avatar" className="d-none" type="file" accept="image/*" onInput={ (event) => {
                        updateAvatar(event.target.files[0]);
                    } } />
                </label>
            </div>

            <div className="login-signup-box">
                <Form className="p-0 login-signup-form" noValidate validated={validated} onSubmit={ (event) => handleSubmit(event) }>
                    <div className="d-flex justify-content-between gap-3">
                        <h3 className="fw-bold">Pet Shelter Profile</h3>
                        { !isEditing ? 
                            <button className="btn btn-dark align-self-start" onClick={() => setIsEditing(true)}>Edit</button>
                            :
                            <div className="multiple-buttons">
                                <button className="btn btn-dark align-self-start" onClick={() => updateAccount()}>Save</button>
                                <button className="btn btn-outline-dark align-self-start" onClick={() => { setIsEditing(false); setAccount(oldAccount) }}>Cancel</button>
                            </div>
                        }
                    </div>

                    <Form.Group className="mb-1" controlId="organization">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter organization here" value={ account.organization } onChange={ (event) => setAccount({ ...account, organization: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your organization's name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="email" placeholder="Enter email here" value={ account.email } onChange={ (event) => setAccount({ ...account, email: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="phone-number">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter phone number here" value={ account.phone_number } onChange={ (event) => setAccount({ ...account, 'phone_number': event.target.value }) } />
                        <Form.Text muted>
                            Example format: 123-456-7890
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter address here" value={ account.address } onChange={ (event) => setAccount({ ...account, address: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your address.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="city">
                        <Form.Label>Country</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter country here" value={ account.country } onChange={ (event) => setAccount({ ...account, country: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your country.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="state">
                        <Form.Label>State/Province</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter state/province here" value={ account.state } onChange={ (event) => setAccount({ ...account, state: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your state/province.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter city here" value={ account.city } onChange={ (event) => setAccount({ ...account, city: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your city.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="zip">
                        <Form.Label>Zip/Postal Code</Form.Label>
                        <Form.Control readOnly={!isEditing} required type="text" placeholder="Enter zip/postal code here" value={ account.zip } onChange={ (event) => setAccount({ ...account, zip: event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your zip/postal code.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="mission-statement">
                        <Form.Label>Mission Statement</Form.Label>
                        <Form.Control readOnly={!isEditing} required as="textarea" rows="3" placeholder="Enter mission statement here" value={ account.mission_statement } onChange={ (event) => setAccount({ ...account, 'mission_statement': event.target.value }) } />
                        <Form.Control.Feedback type="invalid">
                            Please enter your mission statement.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </div>
        </main>
    );
}

export default ProfileShelter;
