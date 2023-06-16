import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { SwitchInput } from "../components/FormInput";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { saveSettings, getSettings, getAllEntries } from "../utils/dataStorage";
import {
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
  DEF_TEMP_TAKEN_TIME_KEY,
  OPTIONAL_ENTRY_INPUT_FIELDS,
  COVERLINE_TEMP_KEY,
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

const calcTempRange = () => {
  const allEntries = getAllEntries();
  const tempValues = allEntries
    .filter((e) => !!e.Temperature)
    .map((e) => e.Temperature);
  return {
    max: Math.max.apply(null, tempValues),
    min: Math.min.apply(null, tempValues),
  };
};

function SettingsPage() {
  const navigate = useNavigate();
  const defOptionalFieldSettings = OPTIONAL_ENTRY_INPUT_FIELDS.reduce(
    (acc, v) => ({ ...acc, [v.name]: false }),
    {}
  );
  const [defSettings, setDefSettings] = useState(getSettings());
  const tempRange = calcTempRange();

  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    saveSettings({ ...defOptionalFieldSettings, ...formJson });
    navigate("/");
  }
  return (
    <div className="wrapper">
      <NavBar />
      <Container className="settings">
        <h1>Settings</h1>
        <Form method="post" onSubmit={handleSubmit}>
          <h4>📝 Annotations</h4>
          <FieldRow name="Coverline">
            <Form.Control
              name={COVERLINE_TEMP_KEY}
              label={COVERLINE_TEMP_KEY}
              type="number"
              placeholder="Temp in °C"
              max={tempRange.max}
              min={tempRange.min}
              defaultValue={defSettings[COVERLINE_TEMP_KEY]}
            />
          </FieldRow>
          <h4>📏 Chart length</h4>
          <FieldRow name="Cycle start date">
            <Form.Control
              name={CHART_START_DATE_KEY}
              type="date"
              defaultValue={defSettings[CHART_START_DATE_KEY]}
            />
          </FieldRow>
          <FieldRow name="Number of cycle days">
            <Form.Control
              name={CHART_NUM_OF_CYCLE_DAYS_KEY}
              type="number"
              min={1}
              defaultValue={defSettings[CHART_NUM_OF_CYCLE_DAYS_KEY]}
            />
          </FieldRow>
          <h4>🗒️ Tracking</h4>
          <FieldRow name="Default temp taken time">
            <Form.Control
              name={DEF_TEMP_TAKEN_TIME_KEY}
              type="time"
              defaultValue={defSettings[DEF_TEMP_TAKEN_TIME_KEY]}
            />
          </FieldRow>
          <FieldRow name="Other items to track">
            {OPTIONAL_ENTRY_INPUT_FIELDS.map((f) => (
              <SwitchInput
                label={`${f.name} ${f.icon}`}
                name={f.name}
                compress={true}
                defaultChecked={defSettings[f.name] == "on"}
              />
            ))}
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
