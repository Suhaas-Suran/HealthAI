import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css"; // Make sure you have your CSS file for styling
import App from "./App"; // Import the App component

// Create a root element and render the App component inside it
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
