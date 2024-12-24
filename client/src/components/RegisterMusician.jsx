import React, { useState } from "react";
import "./RegisterMusician.css";

function RegisterMusician() {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    instruments: "",
    bio: "",
    photo: null,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("instruments", formData.instruments);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("photo", formData.photo);

    // Log the data
    console.log("Musician Registration Data:", formData);
  };

  return (
    <div className="musicianContainer">
      <h1>Register as a Musician</h1>
      <form onSubmit={handleSubmit} className="registerMusicianForm">
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

        {/* Instruments Input */}
        <div className="formGroup">
          <label htmlFor="instruments">Intruments:</label>
          <input
            type="instruments"
            id="instruments"
            name="instruments"
            value={formData.instruments}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bio Input */}
        <div className="formGroup">
          <label className="label-bio" htmlFor="bio">
            Bio:
          </label>
          <textarea
            type="bio"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>

        {/* Photo Input */}
        <div className="formGroup">
          <label htmlFor="photo">Upload your photo:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            required
          />
        </div>

        {/* Register Button */}
        <div className="button-register">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterMusician;
