import "./LogIn.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:2000/users/login",
        loginData
      );

      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem("authToken", token);

        navigate("/");
        alert(`🎸 Welcome to JamSpot Knights! 🎸
You're logged in, and it's time to make some noise 🤘 🤘`);
      }
    } catch (error) {
      console.log("Error during registration", error);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };
  return (
    <div>
      <div className="jamspotnav-title">
        <Link to="/">
          <h4 className="jamspotLetters">JamSpot Knights</h4>
        </Link>
      </div>
      <div  className="login-container">
        <h2 className="h2login">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="labellogin" htmlFor="username">
              Email:
            </label>
            <input
              className="inputlogin"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="labellogin" htmlFor="password">
              Password:
            </label>
            <input
              className="inputlogin"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="buttonlogin" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
