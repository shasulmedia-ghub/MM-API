import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Layout from "../component/Layout";
import { useAuth } from "../context/AuthContext";
import ROUTES from "../constants/routes";
import authService from "../services/authService";
import "../App.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const response =
            await authService.login({
                email: formData.email,
                password: formData.password,
            });

        alert(response.message);
        console.log(response.data);
        login(response.data);   
        navigate(ROUTES.DASHBOARD);
    }

    catch (err) {
        setError(
            err.response?.data?.message ||
            "Login Failed"
        );
    }
};

    return (
        <>
            <Layout>
            <div
                className="app-container py-4"
                style={{ minHeight: "50vh" }}
            >

                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-5">
                        <div className="mario-form-card shadow border-1 solid rounded-10">
                            <div className="card-body p-4">
                                <h2 className="mario-form-title
                                                text-danger 
                                                fw-bold mb-4" 
                                                style={{ fontSize: "2rem", 
                                                         fontWeight: "800",
                                                         color: "#dc3545" }}>
                                    Welcome Back
                                </h2>

                                <form onSubmit={handleSubmit}>
                                     {error && (
                                         <div className="alert alert-danger text-center mb-3">
                                             {error}
                                         </div>
                                     )}

                                    <div className="mb-3">

                                        <label className="mario-form-label">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            required
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="mb-3">
                                        <label className="mario-form-label">
                                            Password
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }

                                                className="form-control"
                                                name="password"
                                                required
                                                onChange={handleChange}

                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }

                                            >

                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}

                                            </button>

                                        </div>

                                    </div>

                                    <div className="d-flex justify-content-between mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />

                                            <label className="mario-form-label">
                                                Remember Me
                                            </label>

                                        </div>

                                        <Link
                                            to={ROUTES.FORGOT_PASSWORD}
                                            className="mario-form-label text-decoration-none"
                                        >
                                            Forgot Password?
                                        </Link>

                                    </div>

                                    <button
                                        className="mario-form-label btn btn-danger btn-lg w-100 text-white fw-bold"
                                    >
                                        Login
                                    </button>

                                </form>
                                <div className="mario-form-label text-center mt-4">
                                    Don't have an account?
                                    <Link
                                        to={ROUTES.REGISTER}
                                        className="mario-form-label fw-bold text-decoration-none ms-2 text-danger"
                                    >
                                        Register
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            </Layout>

        </>

    );

}

export default Login;