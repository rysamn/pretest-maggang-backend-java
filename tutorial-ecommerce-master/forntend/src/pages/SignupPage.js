import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { APP_BASE_URL } from "../configs/constants";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        nama: "",
        email: ""
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isValidForm = () => {
        return Object.values(formData).every(field => field.trim().length > 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidForm()) return;
        
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${APP_BASE_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            navigate("/signin", { state: { registrationSuccess: true } });
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || "An error occurred during registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h1 className="auth-title">Sign Up</h1>
                    <p className="auth-subtitle">Create your account</p>

                    {error && (
                        <Message 
                            severity="error" 
                            text={error} 
                            className="auth-error-message"
                        />
                    )}

                    <div className="auth-input-group">
                        <label htmlFor="nama">Full Name</label>
                        <InputText
                            id="nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="auth-input"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="auth-input"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="auth-input"
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            toggleMask
                            feedback={false}
                            className="auth-input"
                            inputClassName="auth-input"
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="auth-actions">
                        <Button 
                            type="submit" 
                            className="auth-button"
                            disabled={!isValidForm() || isSubmitting}
                            label={isSubmitting ? "Processing..." : "Sign Up"}
                        />
                        <div className="auth-link-container">
                            <span>Already have an account? </span>
                            <Link to="/signin" className="auth-link">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;