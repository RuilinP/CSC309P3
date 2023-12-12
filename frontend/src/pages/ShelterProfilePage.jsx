import React, { useState, useEffect } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';

function ShelterProfile() {
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
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch('http://localhost:8000/accounts/check_user_type/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserId(data.user_id);

                try {
                    const response = await fetch(`http://localhost:8000/accounts/shelters/${data.user_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const dataInfo = await response.json();
                    setShelterInfo({
                        avatar: dataInfo.avatar,
                        organization: dataInfo.organization,
                        email: dataInfo.email,
                        phone_number: dataInfo.phone_number,
                        address: dataInfo.address,
                        country: dataInfo.country,
                        state: dataInfo.state,
                        city: dataInfo.city,
                        zip: dataInfo.zip,
                        mission_statement: dataInfo.mission_statement
                    });

                } catch (error) {
                    navigate("/404");
                }
    
                try {
                    const response = await fetch(`http://localhost:8000/shelters/${data.user_id}/comments/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const dataComment = await response.json();
                    setComments(dataComment.results.slice(0, 2));
                } catch (error) {
                    navigate("/404");
                }

            } catch (error) {
                navigate("/404");
            }
        };

        fetchInfo();

    }, [userId, accessToken, navigate]);

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
                            <h2>{`${shelterInfo.organization}'s Profile `}
                            
                            </h2>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-4 d-flex justify-content-center justify-content-md-end">
                                <div className="profile-pic-container">
                                    <img src={shelterInfo.avatar} alt="Shelter Profile" />
                                </div>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <div className="statement-container px-3 px-md-0">
                                    <p>{shelterInfo.mission_statement}</p>
                                    <ul className="list-unstyled">
                                        <li><strong>Phone:</strong> {shelterInfo.phone_number}</li>
                                        <li><strong>Email:</strong> <a href={`mailto:${shelterInfo.email}`}>{shelterInfo.email}</a></li>
                                        <li><strong>Address:</strong> {fullAddress}</li>
                                    </ul>
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
                                            <p>{comment.text}</p>
                                            <p><strong>Rating:</strong> {comment.rating}</p>
                                            <p><strong>Author:</strong> {comment.author}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Learn More Button */}
                            <div className="d-flex justify-content-center mt-3 w-100">
                                <a href="reviews.html" className="btn btn-dark mt-4">More Reviews &rarr;</a>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ShelterProfile;
