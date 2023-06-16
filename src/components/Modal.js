import React, { useState } from "react";
import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import {
  storeEntry,
  addEntries,
  saveSettings,
  storeEntries,
  getAllEntries,
} from "../utils/dataStorage";
import { START_TEMP_RISE_FIELD, SETTINGS_KEYS } from "../utils/constants";
import {
  getCurrentDateStr,
  transformDateStrToDateLabel,
  dateComparison,
} from "../utils/dateTime";
import { FormInput, DateInput, Text } from "./FormInput";

export function SimpleModal({ show, heading, children, footer, onHide, size }) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      size={size || "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter">{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
}

const validateData = (data) => {
  const valid = false;
  var parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    return { valid, msg: "Data cannot be parsed as JSON. Please try again!" };
  }
  if (parsedData.length == 0)
    return { valid, msg: "No data entries detected. Please try again!" };
  if (!parsedData.every((d) => d.Date))
    return { valid, msg: "Invalid data structure. Please try again!" };
  return { valid: true, msg: "" };
};

export function ImportModal({ show, onClose, onSubmit }) {
  const [data, setData] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const onChange = (e) => {
    setData(e.target.value);
    setErrorMsg("");
  };
  const importData = () => {
    const res = validateData(data);
    setErrorMsg(res.msg);
    if (!res.valid) return;
    addEntries(JSON.parse(data));
    onSubmit();
    onClose();
  };
  const onHide = () => {
    onClose();
    setErrorMsg("");
  };
  return (
    <SimpleModal heading="📥 Import" show={show} onHide={onHide}>
      <Text
        rows={3}
        onChange={onChange}
        placeholder="Enter data in JSON format [{...}]"
        errorMsg={errorMsg}
      />
      <Button variant="primary" onClick={importData}>
        Import
      </Button>
    </SimpleModal>
  );
}

export function ExportModal({ show, data, onClose }) {
  const dataStr = JSON.stringify(data);
  const copyToClipboard = () => navigator.clipboard.writeText(dataStr);
  return (
    <SimpleModal heading="📤 Export" show={show} onHide={onClose}>
      <div className="tip-box">💡 Take a screenshot to save as an image.</div>
      Data entries in JSON format:
      <div className="code-snippet-scroll-container">
        <code>{dataStr}</code>
      </div>
      <br />
      <Button variant="primary" onClick={copyToClipboard}>
        Copy to Clipboard 📋
      </Button>
    </SimpleModal>
  );
}

export function ConfirmModal({
  show,
  heading,
  onClose,
  onSubmit,
  bodyText,
  submitButtonText,
}) {
  return (
    <SimpleModal show={show} heading={heading} size="sm" onHide={onClose}>
      <div>{bodyText}</div>
      <br />
      <Row>
        <Col>
          <Button variant="primary" onClick={onClose}>
            Cancel
          </Button>
        </Col>
        <Col className="align-right">
          <Button
            variant="secondary"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            {submitButtonText}
          </Button>
        </Col>
      </Row>
    </SimpleModal>
  );
}

export const PERIOD_ENTRY_MODE = {
  EDIT: "Edit",
  NEW: "New",
};

export function PeriodEntryModal({
  show,
  onHide,
  onSubmit,
  defaultData,
  mode,
  dateConfig,
  inputFieldsConfig,
}) {
  const isAddNewMode = mode === PERIOD_ENTRY_MODE.NEW;
  const defDate = defaultData.Date;

  const fieldsConfig = inputFieldsConfig.map((f) =>
    defaultData[f.name]
      ? {
          ...f,
          defaultValue: defaultData[f.name],
          defaultChecked: defaultData[f.name],
        }
      : f
  );
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry({
      ...defaultData,
      [START_TEMP_RISE_FIELD.name]: false,
      ...formJson,
    });
    onHide();
    onSubmit && onSubmit();
  }

  return (
    <SimpleModal
      show={show}
      heading={
        !isAddNewMode && defDate
          ? `${transformDateStrToDateLabel(defDate)}`
          : "+ Add New Entry"
      }
      onHide={onHide}
      size="md"
    >
      <Form method="post" onSubmit={handleSubmit}>
        {isAddNewMode && (
          <DateInput
            label="Date"
            name="Date"
            type="date"
            max={dateConfig.maxDate}
            min={dateConfig.minDate}
            defaultValue={(!isAddNewMode && defDate) || getCurrentDateStr()}
          />
        )}
        <Form.Group className="mb-3" controlId="formTemp">
          <Form.Label>Basal Temperature</Form.Label>
          <Row>
            <Col>
              <Form.Control
                name="Temperature"
                type="float"
                placeholder="Temp in °C"
                defaultValue={
                  (!isAddNewMode && defaultData.Temperature) || null
                }
              />
            </Col>
            <Col>
              <Form.Control
                name="Time"
                type="time"
                defaultValue={defaultData.Time}
              />
            </Col>
          </Row>
        </Form.Group>
        <FormInput
          {...START_TEMP_RISE_FIELD}
          defaultChecked={defaultData[START_TEMP_RISE_FIELD.name] == "on"}
        />
        {fieldsConfig.map((f) => (
          <FormInput {...f} />
        ))}
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </SimpleModal>
  );
}

export function StartNewCycleModal({ show, onClose, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    saveSettings(formJson);

    const startDate = formJson[SETTINGS_KEYS.CHART_START_DATE];
    const entriesToKeep = getAllEntries().filter(
      (e) => !(dateComparison(e.Date, startDate) < 0)
    );
    storeEntries(entriesToKeep);

    onClose();
    onSubmit && onSubmit();
  }

  return (
    <SimpleModal
      size="md"
      heading="✨ Start New Cycle"
      show={show}
      onHide={onClose}
    >
      <Form method="post" onSubmit={handleSubmit}>
        <DateInput
          label="First Day of Cycle"
          name={SETTINGS_KEYS.CHART_START_DATE}
          type="date"
          defaultValue={getCurrentDateStr()}
        />
        <div>* Note: Data before this start date will be deleted!</div>
        <br />
        <Button variant="primary" type="submit">
          Start
        </Button>
      </Form>
    </SimpleModal>
  );
}
