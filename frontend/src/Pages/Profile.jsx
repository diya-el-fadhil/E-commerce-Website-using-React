import React, { useEffect, useState } from 'react';
import './CSS/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

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