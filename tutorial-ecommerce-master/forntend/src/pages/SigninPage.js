import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

const SigninPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { signin } = useAuth();

    const isValidForm = () => {
        return username.trim().length > 0 && password.trim().length > 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isValidForm()) {
            await signin(username, password);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h1 className="auth-title">Login</h1>
                    <p className="auth-subtitle">Masukkan username dan password anda</p>

                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="auth-input"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            toggleMask
                            feedback={false}
                            className="auth-input"
                            inputClassName="auth-input"
                        />
                    </div>

                    <div className="auth-actions">
                        <Button 
                            type="submit" 
                            className="auth-button"
                            disabled={!isValidForm()}
                        >
                            Sign In
                        </Button>
                        <div className="auth-link-container">
                            <span>Belum punya akun? </span>
                            <Link to="/signup" className="auth-link">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SigninPage;