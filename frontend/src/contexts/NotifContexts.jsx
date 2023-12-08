import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    const fetchNotifications = async () => {

        try {
            const response = await axios.get(`http://localhost:8000/notifications/`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;
    
            // Check if there are any notifications with 'is_read' set to false
            const newNotifications = data.results.some(notification => !notification.is_read);
            setHasNewNotifications(newNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
        
    };

    useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 10000); 

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []);

    return (
        <NotificationContext.Provider value={{ hasNewNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};