import React, { useEffect, useState } from 'react';
import './CSS/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('auth-token');
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
            setUser(data);
            setNewName(data.name);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error.message);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewName(user.name);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:4000/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError(error.message);
        }
    };

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
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <p><strong>Name:</strong> {user.name}</p>
                        <button onClick={handleEdit}>Edit Name</button>
                    </>
                )}
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default Profile;
