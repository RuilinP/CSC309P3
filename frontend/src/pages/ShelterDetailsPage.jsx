import React, { useState, useEffect } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { useNavigate, useParams } from 'react-router-dom';
import ClickHandlerLink from '../components/common/ClickHandlerLink';
import { getAccessToken } from '../utils/auth';

function ShelterDetails() {
    const { shelterId } = useParams();
    const navigate = useNavigate();
    const [shelterInfo, setShelterInfo] = useState({
        avatar: '',
        organization: '', 
        email: '',
        phone_number: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        mission_statement: ''
    });

    const [comments, setComments] = useState([]);
    const accessToken = getAccessToken();

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accounts/shelters/${shelterId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    navigate("/404");
                }
                const data = await response.json();
                setShelterInfo({
                    avatar: data.avatar,
                    organization: data.organization,
                    email: data.email,
                    phone_number: data.phone_number,
                    address: data.address,
                    country: data.country,
                    state: data.state,
                    city: data.city,
                    zip: data.zip,
                    mission_statement: data.mission_statement
                });
                console.log(data.avatar);
            } catch (error) {
                navigate("/404");
            }
        };

        const fetchTwoComments = async () => {
            try {
                const response = await fetch(`http://localhost:8000/shelters/${shelterId}/comments/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setComments(data.results.slice(0, 2));
            } catch (error) {
                navigate("/404");
            }
        };
        
        fetchProfileInfo();
        fetchTwoComments();
    }, [shelterId]);

    // Concatenating address components
    const fullAddress = `${shelterInfo.address}, ${shelterInfo.city}, ${shelterInfo.state} ${shelterInfo.zip}, ${shelterInfo.country}`;

    return (
        <div className='bg-secondary'>
            <Header />
            <main>
                <div className="container white-container p-3 mt-sm-4 mb-sm-4">
                    {/* Section 1: Profile */}
                    <section id="profile" className="my-5">
                        <div className="section-heading mb-4">
                            <h2>{shelterInfo.organization}</h2>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-4 d-flex justify-content-center justify-content-md-end">
                                <div className="profile-pic-container">
                                    <img src={`${shelterInfo.avatar}`} alt="Shelter Profile" />
                                </div>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <div className="statement-container px-3 px-md-0">
                                    <p>{shelterInfo.mission_statement}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Ratings & Reviews */}
                    <section id="reviews" className="my-5">
                        <div className="section-heading">
                            <div className="d-flex align-items-center">
                                <h2>Ratings & Reviews</h2>
                            </div> 
                        </div>           

                        {/* Centering wrapper */}
                        <div className="d-flex flex-column align-items-center">
                            {comments.map(comment => (
                                <div key={comment.id} className="row mb-4 w-75">
                                    <div className="col-md-8 d-flex align-items-center">
                                        <div className="review-content px-3 px-md-0">
                                            <p>{`"${comment.text}"`}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Learn More Button */}
                            <div className="d-flex justify-content-center mt-3 w-100">
                                <ClickHandlerLink className={"btn btn-dark mt-4"} children={`More Reviews`} url={`/shelters/${shelterId}/comments/`} />
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Contact Us */}
                    <section id="contact" className="container my-5">
                        <div className="section-heading">
                            <h2>Contact Us</h2>
                        </div>

                        <div className="row justify-content-start ms-3">
                            {/* ... other elements ... */}
                            <div className="col-lg-4">
                                <ul className="list-unstyled">
                                    <li><strong>Phone:</strong> {shelterInfo.phone_number}</li>
                                    <br />
                                    <li><strong>Email:</strong> <a href={`mailto:${shelterInfo.email}`}>{shelterInfo.email}</a></li>
                                    <br />
                                    <li><strong>Address:</strong> {fullAddress}</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ShelterDetails;
