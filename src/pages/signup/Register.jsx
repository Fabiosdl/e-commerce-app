import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        
        try {
            const response = await fetch('https://app.fslwebsolutions.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInputs)    
            });
        
            if (response.ok) {
                navigate('/successful-signUp');  // Redirect to success page
            } else {
                const data = await response.json(); // Parse JSON error response
                setErrorMessage(data.description || data.detail || 'Invalid sign up inputs');
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
        } finally {
            setLoading(false); // Stop loading spinner or button
        }
        
    };

    return (
        <div className={styles["page-container"]}>
        <div className={styles["signup-container"]}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-group"]}>
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        id="name"
                        placeholder='Full Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles["form-group"]}>
                    <label htmlFor="email"></label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        title="Please enter a valid email address"
                    />
                </div>

                <div className={styles["form-group"]}>
                    <label htmlFor="password"></label>
                    <input
                        type="password"
                        id="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="8"
                        pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
                        title="Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                    />
                </div>

                <div className={styles["form-group"]}>
                    <label htmlFor="confirmPassword"></label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <div className={styles["error-message"]}>{errorMessage}</div>}
                <div className={styles.button} >
                    <button className={styles.signup} type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <button className={styles.login} type='button' onClick={() => navigate('/login')}> 
                        Login
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default SignUpPage;