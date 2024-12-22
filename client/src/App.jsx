import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Frontpage from "./components/Frontpage";
import SignUp from "./components/Signup";
import Login from "./components/LogIn";
import RegisterShowRunner from "./components/RegisterShowRunner";
import RegisterMusician from "./components/RegisterMusician";

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Frontpage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registershowrunner" element={<RegisterShowRunner />} />
          <Route path="/registermusician" element={<RegisterMusician />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;