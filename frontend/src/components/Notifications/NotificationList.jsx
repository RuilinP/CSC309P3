import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationThread from './NotificationThread';
import Select from 'react-select';
import { getAccessToken } from '../../utils/auth';


function FlipPage(action) {
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Execute the passed action
    action();
}

function NotificationList() {
    const [query, setQuery] = useState({ page: 1 });
    const [totalPages, setTotalPages] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const accessToken = getAccessToken();
    const navigate = useNavigate();
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#d18dfa' : 'white',
            borderColor: state.isFocused ? '#d18dfa' : '#ddd',
            boxShadow: state.isFocused ? '0 0 0 1px d18dfa' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#d18dfa' : 'defaultBorderColor',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#d18dfa' : 'white',
            color: state.isSelected ? 'white' : '#d18dfa',
        }),

    };
    const [filter, setFilter] = useState({ value: 'all', label: 'All' });

    const filterOptions = [
        { value: 'all', label: 'All Notifications' },
        { value: 'read', label: 'Read' },
        { value: 'unread', label: 'Unread' }
    ];

    const handleFilterChange = selectedOption => {
        setFilter(selectedOption);
        setIsUpdated(!isUpdated);
        setQuery({ page: 1 })
    };

    useEffect(() => {
        const { page } = query;

        let url = `http://localhost:8000/notifications/?page=${page}`;

        if (filter.value === 'read') {
            url += '&is_read=true';
        } else if (filter.value === 'unread') {
            url += '&is_read=false';
        }

        async function fetchNotifs() {

            try {
                fetch(url, {
                    headers: {
                    'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(response => response.json())
                    .then(json => {
                        console.log(accessToken);
                        setNotifications(json.results);
                        if (json.count === 0) {
                        } else {
                            setTotalPages(Math.ceil(json.count / 10)); // page size
                        }                    
                    });                 
            } catch (error) {
                navigate('/404');
            }
        }

        if (accessToken) {
            fetchNotifs();
        }

    }, [query, filter, isUpdated]);
    
    
    return (
        <>  <div className='mx-auto col-11'>
                <Select
                    id='notification-filter'
                    styles={customStyles}
                    options={filterOptions}
                    value={filter}
                    onChange={handleFilterChange}
                />
            </div>

            {notifications && <NotificationThread notifications={notifications} setNotifications={setNotifications} isUpdated={isUpdated} setIsUpdated={setIsUpdated} />}
            {notifications && 
            <div className="d-flex justify-content-center col-12 mt-4">
                {query.page > 1 && (
                    <button className='btn btn-dark' onClick={() => FlipPage(() => setQuery({ ...query, page: query.page - 1 }))}>
                        Previous
                    </button>
                )}
                {query.page < totalPages && (
                    <button className='btn btn-dark ms-3' onClick={() => FlipPage(() => setQuery({ ...query, page: query.page + 1 }))}>
                        Next
                    </button>
                )}
            </div>
            }
            <div className="d-flex justify-content-center col-12 mt-3">

                {!notifications || notifications.length === 0 ? "You have no notification." : `Page ${query.page} out of ${totalPages}.`}

            </div>           
        </>
    );
}

export default NotificationList;
