import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar({ onReset, onAdd }) {
  return (
    <>
      <Navbar>
        <Navbar.Brand href="/" style={{ color: "white" }}>
          Red Moon 🌕
        </Navbar.Brand>
        <Nav>
          <Nav.Link style={{ color: "white" }} onClick={onReset}>
            Clear
          </Nav.Link>
          <Nav.Link style={{ color: "white" }} onClick={onAdd}>
            + Entry
          </Nav.Link>
          <Link to="/settings">Settings</Link>
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
