import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/login-signup.css';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

function SignupShelterDone() {
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        organization: '',
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
                const response = await axios.get(`http://localhost:8000/accounts/shelters/${tokenUser.user_id}/`, {
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

    return (
        <main className="login-signup-main">
            <div className="login-signup-box">
                <h3 className="fw-bold">Welcome, {account.organization}!</h3>

                <p>Your registration is complete.</p>

                <div className="multiple-buttons">
                    <button className="btn btn-dark align-self-start" onClick={() => { navigate('/shelter/manage_pets') }}>Start Listing Pets</button>
                    <button className="btn btn-outline-dark align-self-start" onClick={() => { navigate('/profile/shelter') }}>View Profile</button>
                </div>
            </div>
        </main>
    );
}

export default SignupShelterDone;
