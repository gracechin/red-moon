import React from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import { Form, Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { saveSettings, getSettings } from "../utils/dataStorage";
import { CHART_VIEW_OPTIONS, CHART_VIEW_KEY } from "../utils/constants";

function SettingsPage() {
  const navigate = useNavigate();
  const defSettings = getSettings();

  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    saveSettings(formJson);
    navigate("/");
  }
  return (
    <div className="wrapper">
      <NavBar />
      <div>Settings</div>
      <Form method="post" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formSituation">
          <Form.Label>Chart View</Form.Label>
          <br />
          <ToggleButtonGroup
            type="radio"
            name={CHART_VIEW_KEY}
            defaultValue={defSettings[CHART_VIEW_KEY]}
          >
            {Object.values(CHART_VIEW_OPTIONS).map((opt, idx) => (
              <ToggleButton
                key={idx}
                id={`tbg-btn-${opt.name}`}
                value={opt.name}
              >
                {opt.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default SettingsPage;
