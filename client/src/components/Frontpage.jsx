import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

function Frontpage() {

  // Logout handler
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    alert("You have left the JamSpot Knights! 🎸🎤 Come back when you're ready to rock again!");
  };

  return (
    <div className="mainContainer">
      <div className="navContainer">
        <div className="jamspotnav-title">
          <h4>JamSpot Knights</h4>
        </div>

        <div className="buttons-nav">
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="mainTitle">
        <h1>JamSpot Knights</h1>
      </div>

      <div className="middleContainer">
        <div>
          <Link to="/events">
            <h3 className="middle-check-fonts">Check the Events</h3>
          </Link>
        </div>
        <div className="middle-check-fonts">
          <Link to="/musicians">
            <h3>Check the musicians</h3>
          </Link>
        </div>
      </div>
      <div className="mainDescription">
        <h3>
          Find your spot in the next jam night, brave musician! <br />
          Whether you're a jam night warrior or a jam night hero,<br />
          JamSpot Knights is your stage to shine!
        </h3>
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
