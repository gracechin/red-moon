import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

function NavBar() {
  return (
    <>
      <Nav variant="pills" defaultActiveKey="/">
        <Nav.Item>
          <Link to="/">Home</Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default NavBar;
