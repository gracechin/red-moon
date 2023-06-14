import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  Col,
  Row,
  Container,
  Form,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { saveSettings, getSettings } from "../utils/dataStorage";
import {
  CHART_VIEW_OPTIONS,
  CHART_VIEW_KEY,
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
  DEF_TEMP_TAKEN_TIME_KEY,
} from "../utils/constants";

const FieldRow = ({ children, name }) => {
  return (
    <>
      <Row>
        <Col>
          <Form.Label>{name}</Form.Label>
        </Col>
        <Col>{children}</Col>
      </Row>
      <br />
    </>
  );
};

function SettingsPage() {
  const navigate = useNavigate();
  const [defSettings, setDefSettings] = useState(getSettings());

  // TODO: Reset to default settings
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
      <Container className="settings">
        <h1>Settings</h1>
        <Form method="post" onSubmit={handleSubmit}>
          <FieldRow name="Chart view">
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
          </FieldRow>
          <FieldRow name="Chart start date">
            <Form.Control
              name={CHART_START_DATE_KEY}
              type="date"
              defaultValue={defSettings[CHART_START_DATE_KEY]}
            />
          </FieldRow>
          <FieldRow name="Chart # of cycle days">
            <Form.Control
              name={CHART_NUM_OF_CYCLE_DAYS_KEY}
              type="number"
              min={1}
              defaultValue={defSettings[CHART_NUM_OF_CYCLE_DAYS_KEY]}
            />
          </FieldRow>
          <FieldRow name="Default temp taken time">
            <Form.Control
              name={DEF_TEMP_TAKEN_TIME_KEY}
              type="time"
              defaultValue={defSettings[DEF_TEMP_TAKEN_TIME_KEY]}
            />
          </FieldRow>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default SettingsPage;
