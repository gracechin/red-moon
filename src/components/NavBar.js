import React from "react";
import { Nav, Navbar } from "react-bootstrap";

function NavBar({ onReset, onAdd }) {
  return (
    <>
      <Navbar>
        <Navbar.Brand href="#home" style={{ color: "white" }}>
          Red Moon 🌕
        </Navbar.Brand>
        <Nav>
          <Nav.Link style={{ color: "white" }} onClick={onReset}>
            Clear
          </Nav.Link>
          <Nav.Link style={{ color: "white" }} onClick={onAdd}>
            + Entry
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
