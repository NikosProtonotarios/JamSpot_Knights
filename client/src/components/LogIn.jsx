import "./LogIn.css";
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);
  };
  return (
    <div className="login-container">
      <h2 className="h2login">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="labellogin" htmlFor="username">
            Username
          </label>
          <input
            className="inputlogin"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="input-group">
          <label className="labellogin" htmlFor="password">
            Password
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
  );
}

export default Login;
