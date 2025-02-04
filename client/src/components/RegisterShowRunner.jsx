import React, { useState } from "react";
import "./RegisterShowRunner.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function RegisterShowRunner() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "showRunner",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registrationData = {
      ...formData,
      userType: "showRunner", // Explicitly set userType to 'showRunner'
    };
    try {
      const response = await axios.post(
        "https://jamspot-knights-2.onrender.com/users/register",
        registrationData
      );

      if (response.status === 201) {
        navigate("/login");
        alert(
          "Welcome, mighty ShowRunner! 🎩✨ Your event creation powers are unmatched. Let the jam sessions begin and the stage be yours to command! 🎤🎸⚔️"
        );
      }
    } catch (error) {
      console.log("Error during registration", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="registerShowRunnerImage">
      <div
        style={{ fontFamily: "Pirata One", color: "black" }}
        className="showrunnerContainer"
      >
        <div className="jamspotnav-title">
          <Link to="/">
            <h4
              style={{ fontFamily: "'Pirata One', serif", fontSize: "30px" }}
              className="jamspotLetters"
            >
              JamSpot Knights
            </h4>
          </Link>
        </div>
        <h1 className="registerSho">Register as a ShowRunner</h1>
        <form onSubmit={handleSubmit} className="registerShowRunnerForm">
          {/* Name Input */}
          <div className="formGroup">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="username"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="formGroup">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="formGroup">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Register Button */}
          <button className="registerShowRunnerButton" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterShowRunner;
