import React, { useEffect, useState } from 'react';
import RatingStars from '../RatingStars';
import { getAccessToken } from '../../../utils/auth';

const AverageRating = ({ shelterId }) => {
    
    const [comments, setComments] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [profileImage, setProfileImage] = useState('');
    const accessToken = getAccessToken();

    const fetchProfileImage = async () => {
        try {
            const response = await fetch(`http://localhost:8000/accounts/shelters/${shelterId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setProfileImage(data.avatar);
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    const calculateAverageRating = (comments) => {
        if (!comments || comments.count === 0) {
            return 0;
        }
    
        let totalRating = 0;
        let count = 0;
    
        comments.forEach(comment => {
            if (comment.rating && !isNaN(comment.rating)) {
                totalRating += parseInt(comment.rating, 10); // Ensuring it's an integer
                count++;
            }
        });
    
        if (count === 0) return 0;

        return Math.round(totalRating / count);
    };
    

    useEffect(() => {
        fetchProfileImage();

        const handleNewComment = () => {
            fetch(`http://localhost:8000/shelters/${shelterId}/comments/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => response.json())
                .then(json => {
                    setComments(json.results);
                    setAvgRating(calculateAverageRating(json.results));
                });
        };

        handleNewComment();

        window.addEventListener('commentPosted', handleNewComment);

        return () => {
            window.removeEventListener('commentPosted', handleNewComment);
        };
    }, []);


    return (
        <div className="avgrating-container">
            <div className="d-flex row justify-content-center">
                <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
                    <div className="profile-pic-container">
                        <img src={profileImage} alt="Shelter Profile" />
                    </div>
                </div>
                <div className="col-md-6 d-md-flex align-items-center">
                    <div className="text-center mt-3">
                        <h3>Overall Rating:</h3>
                        <h2><RatingStars rating={avgRating} /></h2>
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default AverageRating;
