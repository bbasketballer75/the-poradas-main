
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Austin & Jordyn</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/album">Album</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/guestbook">Guestbook</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/map">Map</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/family-tree">Family Tree</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wedding-party">Wedding Party</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
