import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../component/Layout";
import PageHeader from "../component/PageHeader";
import ROUTES from "../constants/routes";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    date_of_birth: "",
    address: "",
    marketing_opt_in: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
        const response =
            await authService.register(formData);
        alert(response.message);
        navigate(ROUTES.LOGIN);
    }

    catch (err) {
        setError(
            err.response?.data?.message ||
            "Registration Failed"
        );
    }
};


  const passwordStrength = () => {
    const password = formData.password;

    if (password.length < 6)
      return {
        text: "Weak",
        color: "danger",
      };

    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      password.length >= 8
    )
      return {
        text: "Strong",
        color: "success",
      };

    return {
      text: "Medium",
      color: "warning",
    };
  };

  const strength = passwordStrength();

  return (
    <Layout>

      <div
        className="py-3"
        style={{ minHeight: "80vh" }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-7">
            <div className="mario-form-card shadow-lg border-1 solid rounded-10">
              <div className="card-body p-3">

                {/* <h2 className="text-center fw-bold text-danger mb-4">
                  Create Your MarioMart Account
                </h2> */}

                <PageHeader
                title="Create Account"
                subtitle="Join MarioMart today." />

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger text-center mb-3">
                      {error}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6 mb-3">

                      <label className="mario-form-label">
                        First Name
                      </label>

                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">

                      <label className="mario-form-label">
                        Last Name
                      </label>

                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="mb-3">

                    <label className="mario-form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label className="mario-form-label">
                        Password
                      </label>

                      <div className="input-group">

                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
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

                      <small className={`text-${strength.color}`}>
                        Password Strength: {strength.text}
                      </small>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label className="mario-form-label">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="mario-form-label">
                        Gender
                      </label>

                      <select
                        name="gender"
                        className="form-select"
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select Gender
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Prefer not to say</option>
                      </select>

                    </div>

                    <div className="col-md-6 mb-3">

                      <label className="mario-form-label">
                        Date of Birth
                      </label>

                      <input
                        type="date"
                        name="date_of_birth"
                        className="form-control"
                        required
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="mb-3">

                    <label className="mario-form-label">
                      Address
                    </label>

                    <textarea
                      rows="3"
                      name="address"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-check mb-2">

                    <input
                      type="checkbox"
                      name="marketing_opt_in"
                      className="form-check-input"
                      onChange={handleChange}
                    />

                    <label className="mario-form-label">
                      Receive promotional emails and exclusive offers.
                    </label>

                  </div>

                  <div className="form-check mb-4">

                    <input
                      type="checkbox"
                      name="terms"
                      className="form-check-input"
                      required
                      onChange={handleChange}
                    />

                    <label className="mario-form-label">
                      I agree to the Terms & Conditions.
                    </label>
                  </div>

                  <button
                    className="mario-form-label btn btn-danger w-100 btn-lg fw-bold"
                    style = {{ color: 'white'}}
                  >
                    Create Account
                  </button>
                </form>

                <div 
                    className="mario-form-label"
                    style={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      marginTop: "12px" 
                    }}
                >
                  Already have an account?

                  <Link
                    to={ROUTES.LOGIN}
                    className="mario-form-label ms-2 fw-bold text-decoration-none"
                    style={{
                      color: "red",
                    }}
                  >
                    Login Here
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Register;