import React from "react";
import "./App.css";
import RRoutes from "./components/Routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <RRoutes />
    </div>
  );
}

export default App;
