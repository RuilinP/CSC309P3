import { Button, Container, Navbar } from 'react-bootstrap';
import logo from '../../assets/images/logo.png';
import '../../assets/styles/main.css'
import '../../pages/styles/custom.css'
import '../../pages/styles/fix-pos-icon.css'
import React, { useState, useEffect } from 'react';
import ClickHandlerLink from './ClickHandlerLink';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken, logout } from '../../utils/auth';
import axios from 'axios';


function Header() {
    const navigate = useNavigate();
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const [userInfo, setUserInfo] = useState({ userType: null, userId: null });

	const accessToken = getAccessToken();
    let tokenUser;
    if (accessToken) {
        tokenUser = jwtDecode(accessToken); 
    }


    useEffect(() => {
        const fetchUserType = async () => {
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
				setUserInfo({ 
                    userType: data.user_type.toLowerCase(),
                    userId: data.user_id
                });
            } catch (error) {
                console.error('Error fetching user type:', error);
            }
        };

        const fetchNotifications = async () => {

            try {
                const response = await axios.get(`http://localhost:8000/notifications/check_unread/`, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = response.data;
                setHasNewNotifications(data.has_unread_notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        
        };

        if (accessToken) {
            fetchUserType();
            fetchNotifications();
            const intervalId = setInterval(fetchNotifications, 10000); 

            // Clear the interval when the component is unmounted
            return () => clearInterval(intervalId);    
        }
        
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <header>
            { userInfo.userType === 'shelter' || userInfo.userType === 'seeker' ?
                <div className='d-md-none fixed-bottom pr-3 pb-3'>
                    <Button className={`notif-icon btn btn-sm navbar-brand bg-transparent ${hasNewNotifications ? 'has-notifications' : ''}`} 
                        onClick={ (event) => { event.preventDefault(); navigate(`/notifications/`) } }>
                        &#x1F514;
                    </Button>
                </div>
            : '' }

			<div className='back-to-top-button'>
				<button type='button' className='btn btn-secondary btn-sm' onClick={scrollToTop}> &#x2191; </button>
			</div>

            <Navbar bg='primary' expand='sm' variant='light'>
                <Container fluid className="d-flex align-items-center">
					<Button className='navbar-brand mb-0 h1 bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/`) } }>
						<img className='logo d-line-block' src={logo} alt='PetPal Logo'></img>
					</Button>

					<button type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' className='navbar-toggler'
						aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon'></span>
					</button>

                    <div className='collapse navbar-collapse' id='navbarNav'>
                        {userInfo.userType === 'shelter' ? (
                            // Shelter user navigation
                            <ul className='navbar-nav me-auto d-flex align-items-center'>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/`) } }>Home</Button>
                                </li>
                                <li className='nav-item'>
                                    <ClickHandlerLink url={'/profile/shelter/'} className={"nav-link"} children={'Profile'}/>
                                </li>
                                <li className='nav-item'>
                                    <ClickHandlerLink url={`/shelters/${userInfo.userId}/comments/`} className={"nav-link"} children={'Shelter Reviews'}/>
                                </li>
                                <li className='nav-item'>
                                    <ClickHandlerLink url={'/shelter/manage_pets'} className={"nav-link"} children={'Animal Inventory'}/>
                                </li>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/blogs/`) } }>Blogs</Button>
                                </li>
                            </ul>
                        ) :
                        userInfo.userType === 'seeker' ? (
                            // Seeker user navigation
                            <ul className='navbar-nav me-auto d-flex align-items-center'>
                                 <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/`) } }>Home</Button>
                                </li>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/profile/seeker/`) } }>Profile</Button>
                                </li>
								<li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/pets/`) } }>Pet Search</Button>
                                </li>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/pet/application-list`) } }>My Applications</Button>
                                </li>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/blogs/`) } }>Blogs</Button>
                                </li>
                            </ul>
                        ) : (
                            // Anonymous user navigation
                            <ul className='navbar-nav me-auto d-flex align-items-center'>
                                <li className='nav-item'>
                                    <Button className='nav-link bg-transparent' onClick={ (event) => { event.preventDefault(); navigate(`/`) } }>Home</Button>
                                </li>
                            </ul>
                        )}

						{ userInfo.userType === 'shelter' || userInfo.userType === 'seeker' ? (
                            <div className="d-flex flex-row align-items-center">
                                <Button variant="dark" size="sm" onClick={ (event) => { event.preventDefault(); logout(); navigate(`/`); navigate(0) } }>Log out</Button>
                                <Button className={`btn btn-sm ms-2 me-0 navbar-brand d-none d-md-block bg-transparent ${hasNewNotifications ? 'has-notifications' : ''}`} 
                                    onClick={ (event) => { event.preventDefault(); navigate(`/notifications/`); } }>
                                    &#x1F514;
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex flex-row gap-3">
                                <Button variant="dark" size="sm" onClick={ (event) => { event.preventDefault(); navigate(`/login`) } } role="button" className="me-0">Login</Button>
                                <Button variant="dark" size="sm" onClick={ (event) => { event.preventDefault(); navigate(`/signup`) } } role="button" className="me-0">Signup</Button>
                            </div>
                        )}
                    </div>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
