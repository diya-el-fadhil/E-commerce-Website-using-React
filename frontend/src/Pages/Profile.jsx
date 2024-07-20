import React, { useEffect, useState } from 'react';
import './CSS/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                console.log('Token:', token); // Log the token to check if it's present
                
                if (!token) {
                    throw new Error('No auth token found');
                }

                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Profile data:', data); // Log the received data
                setUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    if (error) {
        return <p className="error">Error: {error}</p>;
    }

    if (!user) {
        return <p className="loading">Loading...</p>;
    }

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>
            <div className="profile-info">
                <h2>Personal Information</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default Profile;