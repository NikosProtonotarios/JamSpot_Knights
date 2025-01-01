import "./Signup.css";
import { Link } from "react-router-dom";

import React from "react";
function SignUp() {
  return (
    <div className="signContainer">
      <div className="jamspotnav-title">
        <Link to="/">
          <h4 style={{fontFamily: "'Pirata One', serif", fontSize: "30px"}} className="jamspotLetters">JamSpot Knights</h4>
          </Link>
        </div>
      <h2 style={{ fontFamily: "'Pirata One', serif" }} className="signTitle">Are you a ShowRunner or a Musician?</h2>
      <div className="signUp">
        <Link to={"/registershowrunner"}>
          <button className="showRunnerButton" style={{ fontFamily: "'Pirata One', serif", color: "white" }}>ShowRunner</button>
        </Link>
        <Link to={"/registermusician"}>
          <button className="musicianButton" style={{ fontFamily: "'Pirata One', serif", color: "white" }}>Musician</button>
        </Link>
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

export default SignUp;