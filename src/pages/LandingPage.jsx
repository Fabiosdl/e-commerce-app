import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './LandingPage.module.css';

function LandingPage() {
  const [inputValue, setInputValue] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // General error messages
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });

    if (!value.trim()) {
      setErrors({ ...errors, [name]: `${name.replace(/([A-Z])/g, " $1").trim()} cannot be empty.` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation before submission
    const errorAfterSubmission = {};
    if (!inputValue.fullName.trim()) errorAfterSubmission.fullName = "Full Name cannot be empty";
    if (!inputValue.email.trim()) errorAfterSubmission.email = "Email cannot be empty";
    if (!inputValue.password.trim()) errorAfterSubmission.password = "Password cannot be empty";
    if (inputValue.password !== inputValue.confirmPassword)
      errorAfterSubmission.confirmPassword = "Passwords do not match";

    setErrors(errorAfterSubmission);
    if (Object.keys(errorAfterSubmission).length > 0) return; // Stop submission if errors exist

    setLoading(true);

    try {
      const response = await fetch("https://app.fslwebsolutions.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputValue.fullName,
          email: inputValue.email,
          password: inputValue.password,
        }),
      });

      if (response.ok) {
        window.location.href = "/successful-signUp"; // Redirect on success
      } else {
        const data = await response.json();
        setErrorMessage(data.description || data.detail || "Invalid sign-up inputs");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["App-container"]}>
      <div className={styles["left-container"]}>
        <h1>Hi there! Welcome to My E-Commerce App</h1>
        <h5>This website was developed to work with my E-Commerce API developed
          usign Spring Boot. Register to explore and test it!</h5>
      </div>

      <div className={styles["right-container"]}>
        
        <button type="button" className={styles["subscription-button"]}
        onClick={() => navigate('/login')}>
              Login Here!
            </button>

        <div className={styles["form-container"]}>
          <form id="registration" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              value={inputValue.fullName}
              onChange={handleInputChange}
              placeholder={errors.fullName ? "" : "Full Name"}
              className={`${styles.inputField} ${errors.fullName ? styles.errors : ""}`}

            />
            {errors.fullName && <span className={styles["error-message"]}>{errors.fullName}</span>}

            <input
              type="email"
              name="email"
              value={inputValue.email}
              onChange={handleInputChange}
              placeholder={errors.email ? "" : "Email Address"}
              className={`${styles.inputField} ${errors.email ? styles.errors : ""}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <input
              type="password"
              name="password"
              value={inputValue.password}
              onChange={handleInputChange}
              placeholder={errors.password ? "" : "Password"}
              className={`${styles.inputField} ${errors.password ? styles.errors : ""}`}
              autocomplete="new-password"
            />
            {errors.password && <span className={styles["error-message"]}>{errors.password}</span>}

            <input
              type="password"
              name="confirmPassword"
              value={inputValue.confirmPassword}
              onChange={handleInputChange}
              placeholder={errors.confirmPassword ? "" : "Confirm Password"}
              className={`${styles.inputField} ${errors.confirmPassword ? styles.errors : ""}`}
              autocomplete="new-password"
            />
            {errors.confirmPassword && <span className={styles["error-message"]}>{errors.confirmPassword}</span>}

            {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Sign Up Here!"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
