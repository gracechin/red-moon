import React, { useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { StartNewCycleModal } from "../components/Modal.js";
import { Link } from "react-router-dom";
import logo from "../assets/red_moon_logo.svg";

function NavBar({ onReset, onAdd, onExport, onImport, refreshData }) {
  const [showNewCycleModal, setShowNewCycleModal] = useState(false);

  return (
    <>
      <Navbar>
        <Navbar.Brand href="/">
          Red Moon <img src={logo} alt="Red Moon Logo" />
        </Navbar.Brand>
        <Nav>
          {onReset && onExport && onImport && (
            <NavDropdown title="..." id="collasible-nav-dropdown">
              <NavDropdown.Item onClick={() => setShowNewCycleModal(true)}>
                ✨ Start New Cycle
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onExport}>📤 Export</NavDropdown.Item>
              <NavDropdown.Item onClick={onImport}>📥 Import</NavDropdown.Item>
              <NavDropdown.Item onClick={onReset}>🗑️ Clear</NavDropdown.Item>
            </NavDropdown>
          )}
          {!!onAdd && <Nav.Link onClick={onAdd}>+ Add New Entry</Nav.Link>}
          <div className="nav-link">
            <Link to="/settings">⚙️</Link>
          </div>
          <div className="nav-link">
            <Link to="/about">ⓘ</Link>
          </div>
        </Nav>
      </Navbar>
      <StartNewCycleModal
        show={showNewCycleModal}
        onClose={() => setShowNewCycleModal(false)}
        onSubmit={refreshData}
      />
    </>
  );
}

export default NavBar;
