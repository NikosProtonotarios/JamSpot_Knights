import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Frontpage() {
  const navigate = useNavigate();
  let token = null;
    let decoded = null;
  
    try {
      if (localStorage.getItem("authToken")) {
        token = localStorage.getItem("authToken");
        decoded = jwtDecode(token);
        console.log(decoded.userId);
      }
    } catch (error) {
      console.log(error);
    }

  const handleLogout = () => {
    if (localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      navigate("/login");
      alert(
        "You have left the JamSpot Knights! 🎸🎤 Come back when you're ready to rock again!"
      );
    }
  };

  return (
    <div className="mainContainer">
      <div className="navContainer">
        <div className="jamspotnav-title">
          <h4 className="JamSpotLogo" style={{ fontFamily: "'Pirata One', serif", fontSize: "30px" }}>
            JamSpot Knights
          </h4>
        </div>

        <div className="buttons-nav"> 
          {token ? <><button
            className="logoutButton"
            style={{ fontFamily: "'Pirata One', serif" }}
            onClick={handleLogout}
          >
            Logout
          </button></> : <><Link to="/signup">
            <button 
              className="signUpButton"
              style={{ fontFamily: "'Pirata One', serif" }}
            >
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button
              className="loginButton"
              style={{ fontFamily: "'Pirata One', serif" }}
            >
              Login
            </button>
          </Link></>}
          
          
        </div>
      </div>
      <div className="middleContainer">
        <div className="mainTitle">
          <h1 style={{ fontFamily: "'Pirata One', serif" }}>JamSpot Knights</h1>
        </div>

        <div className="middleContainer">
          <div className="checkButtonsContainer">
            <div className="middle-check-fonts">
              <Link to="/events">
                <h3
                  style={{ fontFamily: "'Pirata One', serif" }}
                  
                >
                  Check the Events
                </h3>
              </Link>
            </div>
            <div className="middle-check-fonts">
              <Link to="/musicians">
                <h3 style={{ fontFamily: "'Pirata One', serif" }}>
                  Check the musicians
                </h3>
              </Link>
            </div>
          </div>
        </div>
        <div className="mainDescription">
          <h3>
            Find your spot in the next jam night, brave musician! <br />
            Whether you're a jam night warrior or a jam night hero,
            <br />
            JamSpot Knights is your stage to shine!
          </h3>
        </div>
      </div>
      <footer>
        <div className="footerContainer">
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
  );
}

export default Frontpage;
