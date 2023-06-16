import React from "react";
import { Outlet, Link } from "react-router-dom";
import { MY_WEB_ADDRESS } from "../utils/constants";
// Bootstrap CSS & Bundle JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Layout() {
  return (
    <div className="App">
      <Outlet />
      <div className="footer">
        <p>
          This app was made for fun 🎉 by{" "}
          <a href={MY_WEB_ADDRESS}>Grace Chin</a>.
        </p>
        <p>
          By using this app, you are agreeing to the
          <Link to="/terms">Privacy, Terms, & Disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}

export default Layout;
