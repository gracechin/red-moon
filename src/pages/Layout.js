import React from "react";
import { Outlet } from "react-router-dom";
// Bootstrap CSS & Bundle JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Layout() {
  return (
    <div className="App">
      <div className="App-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
