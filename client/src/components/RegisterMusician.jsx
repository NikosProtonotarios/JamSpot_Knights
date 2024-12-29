import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterMusician.css";
import axios from "axios";

function RegisterMusician() {
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    instruments: "",
    bio: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state when form is submitted

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("instruments", formData.instruments);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("photo", formData.photo);

    try {
      const response = await axios.post(
        "http://localhost:2000/users/register/musician",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("🎶 🛡️ Welcome, Brave Musician! You've joined the JamSpot Knights and are ready to make your mark in the jam nights!");
        navigate("/"); // Navigate to home page after success
      }
    } catch (error) {
      console.log("Error during registration", error);
      alert("Error during registration");
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  return (
    <div className="musicianContainer">
      <h1>Register as a Musician</h1>

      <form onSubmit={handleSubmit} className="registerMusicianForm">
        <div className="formGroup">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="formGroup">
          <label htmlFor="instruments">Instruments:</label>
          <input
            type="text"
            id="instruments"
            name="instruments"
            value={formData.instruments}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="button-register">
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterMusician;
