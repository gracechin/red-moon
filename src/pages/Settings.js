import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { SwitchInput, Text } from "../components/FormInput";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { saveSettings, getSettings, getAllEntries } from "../utils/dataStorage";
import { SETTINGS_KEYS, OPTIONAL_ENTRY_INPUT_FIELDS } from "../utils/constants";

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
  const defSettings = getSettings();
  const defShowChartDescr = defSettings[SETTINGS_KEYS.SHOW_CHART_DESCR];
  const [disableChartDescr, setDisableChartDescr] = useState(
    !defShowChartDescr
  );
  const tempRange = calcTempRange();
  const onChangeShowChartDescr = () => {
    setDisableChartDescr(!disableChartDescr);
  };

  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    saveSettings({
      ...defOptionalFieldSettings,
      [SETTINGS_KEYS.SHOW_CHART_DESCR]: false,
      ...formJson,
    });
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
              name={SETTINGS_KEYS.COVERLINE_TEMP}
              label={SETTINGS_KEYS.COVERLINE_TEMP}
              type="number"
              placeholder="Temp in °C"
              max={tempRange.max}
              min={tempRange.min}
              defaultValue={defSettings[SETTINGS_KEYS.COVERLINE_TEMP]}
            />
          </FieldRow>
          <h4>🗒️ Chart Description</h4>
          <SwitchInput
            label="Show"
            name={SETTINGS_KEYS.SHOW_CHART_DESCR}
            onChange={onChangeShowChartDescr}
            compress={true}
            defaultChecked={defSettings[SETTINGS_KEYS.SHOW_CHART_DESCR] == "on"}
          />
          <Text
            name={SETTINGS_KEYS.CHART_DESCR}
            rows={2}
            placeholder="Enter chart description..."
            disabled={disableChartDescr}
            defaultValue={defSettings[SETTINGS_KEYS.CHART_DESCR]}
          />
          {/* TODO: Create template for chart description */}
          {/* <Button
            variant="secondary"
            onClick={() => console.log("hello")}
            disabled={disableChartDescr}
          >
            Use suggested template
          </Button> */}
          <br />
          <h4>📏 Chart length</h4>
          <FieldRow name="Cycle start date">
            <Form.Control
              name={SETTINGS_KEYS.CHART_START_DATE}
              type="date"
              defaultValue={defSettings[SETTINGS_KEYS.CHART_START_DATE]}
            />
          </FieldRow>
          <FieldRow name="Number of cycle days">
            <Form.Control
              name={SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS}
              type="number"
              min={1}
              defaultValue={defSettings[SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS]}
            />
          </FieldRow>
          <h4>📋 Tracking</h4>
          <FieldRow name="Default temp taken time">
            <Form.Control
              name={SETTINGS_KEYS.DEF_TEMP_TAKEN_TIME}
              type="time"
              defaultValue={defSettings[SETTINGS_KEYS.DEF_TEMP_TAKEN_TIME]}
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
