import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirection after successful registration

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userInputs = {
            name: name,
            email: email,
            password: password,
            address: address
        };

        try {

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInputs)    
            });

            if (response.ok) {
                // Redirect to login page
                navigate('/successful-signUp');
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Invalid sign up inputs');

            }
        } catch (error) {
            setErrorMessage('An error occurred while trying to sign you in. Please try again');
        }
    };

    return (
        <div className="login-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>

        <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        
        <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">SignUp</button>
        </form>
    </div>

    );
};

export default SignUpPage;