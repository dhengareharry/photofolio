import React from "react";
import "../CSS/Navbar.css";

export default function Navbar({ navigateToAlbumsForm }) {
  return (
    <div className="nav-container">
      <div className="nav-bar" onClick={navigateToAlbumsForm}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/1358/1358994.png"
          alt="logo"
        />
        <span>PhotoFolio</span>
      </div>
    </div>
  );
}
