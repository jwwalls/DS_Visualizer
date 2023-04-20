import React from "react";
import { Link } from "react-router-dom";
import { clearScene } from "../static/script";

import { cubes3 } from "../static/script";
import * as THREE from "three";

const Navbar = () => {
  const handleLinkClick = () => {
    
    clearScene(scene,cubes3);
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark"
        style={{ zIndex: 3 }}
      >
        <div className="container-fluid" style={{ zIndex: 3 }}>
          <Link to="/" className="navbar-brand "onClick={handleLinkClick}>
            Data Structure Visualizer
          </Link>
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
                <Link to="/array" className="nav-link" onClick={handleLinkClick} >
                  Array
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/linked_list" className="nav-link" onClick={handleLinkClick} >
                  Linked List
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/grid" className="nav-link" onClick={handleLinkClick} >
                  2-D Grid
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/binary_tree" className="nav-link" onClick={handleLinkClick} >
                  Binary Tree
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/graph" className="nav-link" onClick={handleLinkClick} >
                  Graph
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
