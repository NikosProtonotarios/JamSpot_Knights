import React, { useState } from "react";
import "./RegisterShowRunner.css";

function RegisterShowRunner() {
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ShowRunner Registration Data:", formData);
   
  };

  return (
    <div className="showrunnerContainer">
      <h1>Register as a ShowRunner</h1>
      <form onSubmit={handleSubmit} className="registerShowRunnerForm">
        {/* Name Input */}
        <div className="formGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterShowRunner;
