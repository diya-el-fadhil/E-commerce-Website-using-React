import React, { useEffect, useState } from 'react';

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
        return <p>Loading...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Profile Page</h1>
            <div>
                <h2>Personal Information</h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
};

export default Profile;
