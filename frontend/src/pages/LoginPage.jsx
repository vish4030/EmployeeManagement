import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import { setUserDetails } from "../reducers/UserReducer";
import "./Style.css";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitToBackend = useCallback(async (url, userData) => {
    try {
      const response = await axios.post(url, userData);
      const { token, user } = response.data;


      // Save JWT token to localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("name", user?.name)

     dispatch(setUserDetails(user));

      return response.status;
    } catch (error) {
      if (error.response) {
        setErrors((prev) => ({
          ...prev,
          server: error.response.data.message || "Something went wrong!",
        }));
      } else {
        console.error("Network error:", error);
      }
      return null;
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!userData.password) {
      newErrors.password = "Password is required.";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      const status = await submitToBackend(
        "http://localhost:9090/api/v1/auth/login",
        userData
      );
      setIsSubmitting(false);

      if (status === 200) {
        //alert("Login Successful!");
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="login-container container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Please log in to access your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              name="email"
              value={userData.email}
              handleChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <Input
              type="password"
              name="password"
              value={userData.password}
              handleChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {errors.server && <p className="server-error">{errors.server}</p>}

          <div className="form-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <span className="forgot-password">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !userData.email.trim() || !userData.password}
            className="btn login-button"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <div className="login-image">
        <h3>Your branding or promotional image here.</h3>
      </div>
    </div>
  );
};

export default Login;
