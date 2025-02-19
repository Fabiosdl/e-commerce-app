import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirection after successful registration
import './Register.css';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const userInputs = {
            name: name,
            email: email,
            password: password
        };

        try {

            const response = await fetch('http://localhost:8080/api/auth/signup', {
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
        <div className="signup-container">
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
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">SignUp</button>
        </form>
    </div>

    );
};

export default SignUpPage;