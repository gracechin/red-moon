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
          <div className="nav-link">
            <Link to="/settings">⚙️ Settings</Link>
          </div>
          {!!onReset && (
            <Nav.Link style={{ color: "white" }} onClick={onReset}>
              🗑️ Clear
            </Nav.Link>
          )}
          {!!onAdd && (
            <Nav.Link style={{ color: "white" }} onClick={onAdd}>
              ➕ Entry
            </Nav.Link>
          )}
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
