import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Settings from "./pages/Settings.js";
import About from "./pages/About.js";
import Terms from "./pages/Terms.js";

// Bootstrap CSS & Bundle JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="terms" element={<Terms />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
