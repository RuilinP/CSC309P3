import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/login-signup.css';

function Signup() {
    const navigate = useNavigate();

    return (
        <main className="login-signup-main">
            <div className="login-signup-box">
                <h4 className="fw-bold text-center">Are you a Pet Seeker or a Pet Shelter?</h4>

                <div className="login-signup-form text-center">
                    <button className="btn primary d-flex flex-column align-items-center p-3" onClick={() => { navigate('/signup/seeker') }}>
                        <span className="fw-bold">Pet Seeker!</span>
                        <span>I'm looking to adopt a pet.</span>
                    </button>

                    <button className="btn primary d-flex flex-column align-items-center p-3" onClick={() => { navigate('/signup/shelter') }}>
                        <span className="fw-bold">Pet Shelter!</span>
                        <span>I'm listing pets for adoption.</span>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Signup;
