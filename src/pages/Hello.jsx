import React, { useState, useEffect } from 'react';
import api from '../api';

const HelloPage = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found. Please log in.');
                }

                const response = await api.get(`http://localhost:8080/user/${userId}`);
                
                if(!response)
                    throw new Error('Could not retrieve user');

                console.log(response.data);
                setUsername(response.data.name);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return <h1>Hello, {username}!</h1>;
};

export default HelloPage;
