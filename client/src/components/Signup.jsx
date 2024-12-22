import "./Signup.css";
import { Link } from "react-router-dom";

import React from "react";
function SignUp() {
  return (
    <div className="signContainer">
      <h2 className="signTitle">Are you a ShowRunner or a Musician?</h2>
      <div className="signUp">
        <Link to={"/registershowrunner"}>
          <button>ShowRunner</button>
        </Link>
        <Link to={"/registermusician"}>
          <button>Musician</button>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;