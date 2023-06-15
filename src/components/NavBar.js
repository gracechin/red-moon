import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar({ onReset, onAdd, onExport, onImport }) {
  return (
    <>
      <Navbar>
        <Navbar.Brand href="/">Red Moon 🌕</Navbar.Brand>
        <Nav>
          <div className="nav-link">
            <Link to="/settings">⚙️ Settings</Link>
          </div>
          {!!onReset && <Nav.Link onClick={onReset}>🗑️ Clear</Nav.Link>}
          {!!onAdd && <Nav.Link onClick={onAdd}>+ Entry</Nav.Link>}
          {!!onExport && <Nav.Link onClick={onExport}>📤 Export</Nav.Link>}
          {!!onImport && <Nav.Link onClick={onImport}>📥 Import</Nav.Link>}
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
