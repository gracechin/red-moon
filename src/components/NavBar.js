import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar({ onReset, onAdd, onExport, onImport }) {
  return (
    <>
      <Navbar>
        <Navbar.Brand href="/">Red Moon 🌕</Navbar.Brand>
        <Nav>
          {onReset && onExport && onImport && (
            <NavDropdown title="More..." id="collasible-nav-dropdown">
              <NavDropdown.Item onClick={onReset}>🗑️ Clear</NavDropdown.Item>
              <NavDropdown.Item onClick={onExport}>📤 Export</NavDropdown.Item>
              <NavDropdown.Item onClick={onImport}>📥 Import</NavDropdown.Item>
            </NavDropdown>
          )}
          {!!onAdd && <Nav.Link onClick={onAdd}>+ Entry</Nav.Link>}
          <div className="nav-link">
            <Link to="/settings">⚙️</Link>
          </div>
          <div className="nav-link">
            <Link to="/settings">ⓘ</Link>
          </div>
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
