import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onePage }) => {
  // Smooth scroll for anchor links
  const handleNavClick = (e, id) => {
    if (onePage && id) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {onePage ? (
          <a className="navbar-brand" href="#home" onClick={(e) => handleNavClick(e, 'home')}>
            Austin & Jordyn
          </a>
        ) : (
          <Link className="navbar-brand" to="/">
            Austin & Jordyn
          </Link>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {onePage ? (
                <a className="nav-link" href="#home" onClick={(e) => handleNavClick(e, 'home')}>
                  Home
                </a>
              ) : (
                <Link className="nav-link" to="/">
                  Home
                </Link>
              )}
            </li>
            <li className="nav-item">
              {onePage ? (
                <a className="nav-link" href="#album" onClick={(e) => handleNavClick(e, 'album')}>
                  Album
                </a>
              ) : (
                <Link className="nav-link" to="/album">
                  Album
                </Link>
              )}
            </li>
            <li className="nav-item">
              {onePage ? (
                <a
                  className="nav-link"
                  href="#guestbook"
                  onClick={(e) => handleNavClick(e, 'guestbook')}
                >
                  Guestbook
                </a>
              ) : (
                <Link className="nav-link" to="/guestbook">
                  Guestbook
                </Link>
              )}
            </li>
            <li className="nav-item">
              {onePage ? (
                <a className="nav-link" href="#map" onClick={(e) => handleNavClick(e, 'map')}>
                  Map
                </a>
              ) : (
                <Link className="nav-link" to="/map">
                  Map
                </Link>
              )}
            </li>
            <li className="nav-item">
              {onePage ? (
                <a className="nav-link" href="#family" onClick={(e) => handleNavClick(e, 'family')}>
                  Family Tree
                </a>
              ) : (
                <Link className="nav-link" to="/family-tree">
                  Family Tree
                </Link>
              )}
            </li>
            <li className="nav-item">
              {onePage ? (
                <a className="nav-link" href="#party" onClick={(e) => handleNavClick(e, 'party')}>
                  Wedding Party
                </a>
              ) : (
                <Link className="nav-link" to="/wedding-party">
                  Wedding Party
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
