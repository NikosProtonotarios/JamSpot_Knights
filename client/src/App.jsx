import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Frontpage from "./components/Frontpage";

function App() {
  return (
    <Router>
      <div>
        <Frontpage />
      </div>
    </Router>
  );
}

export default App;
