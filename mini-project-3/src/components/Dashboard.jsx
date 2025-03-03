import React from "react";
import Converter from "./Converter";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="main">
      <h1>Welcome to Your Dashboard</h1>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default Dashboard;
