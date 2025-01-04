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
        const { token, userId } = response.data;

        console.log("User ID from the response:", userId);

        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);

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
    <div className="page-container">
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
      <div className="content-wrap">
        <div
          style={{ fontFamily: "Pirata One", color: "black" }}
          className="login-container"
        >
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

      <footer>
        <div className="footerContainer">
          <footer>
            <div>
              <div className="footerLinks">
                <ul>
                  <li>
                    <a href="#about">About</a>
                  </li>
                  <li>
                    <a href="#contact">Contact</a>
                  </li>
                  <li>
                    <a href="#privacy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#terms">Terms & Conditions</a>
                  </li>
                </ul>
              </div>
              <div className="socialMedia">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
              <div className="contactInfo">
                <p>Email: info@jamspotknights.com</p>
                <p>Phone: +123 456 7890</p>
              </div>
              <div className="copyright">
                <p>&copy; 2024 JamSpot Knights. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </footer>
    </div>
  );
}

export default Login;
