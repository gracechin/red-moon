import React, { useState } from "react";
import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import { storeEntry, addEntries, saveSettings } from "../utils/dataStorage";
import { COVERLINE_TEMP_KEY, LUTEAL_START_DATE_KEY } from "../utils/constants";
import {
  getCurrentDateStr,
  transformDateStrToDateLabel,
} from "../utils/dateTime";
import { FormInput, FloatInput, DateInput } from "./FormInput";

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
  const isError = errorMsg.length > 0;
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
  return (
    <SimpleModal
      heading="📥 Import entries"
      show={show}
      onHide={() => {
        onClose();
        setErrorMsg("");
      }}
    >
      <Form.Control
        as="textarea"
        className={isError && "error"}
        rows={3}
        type="text"
        onChange={onChange}
        placeholder="Enter data in JSON format [{...}]"
      />
      {isError > 0 && <div className="errorMsg">{errorMsg}</div>}
      <br />
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
    <SimpleModal heading="📤 Export entries" show={show} onHide={onClose}>
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
    defaultData[f.name] ? { ...f, defaultValue: defaultData[f.name] } : f
  );
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry({ ...defaultData, ...formJson });
    onHide();
    onSubmit && onSubmit();
  }

  return (
    <SimpleModal
      show={show}
      heading={
        !isAddNewMode && defDate
          ? `${transformDateStrToDateLabel(defDate)}`
          : "Period entry"
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

export function InterpretModal({
  show,
  onClose,
  dateConfig,
  onSubmit,
  defaultData,
}) {
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    saveSettings(formJson);
    console.log(formJson);
    onClose();
    onSubmit && onSubmit();
  }

  return (
    <SimpleModal
      size="md"
      heading="📝 Interpret chart"
      show={show}
      onHide={onClose}
    >
      <Form method="post" onSubmit={handleSubmit}>
        <FloatInput
          label={COVERLINE_TEMP_KEY}
          name="Coverline"
          placeholder="Temp in °C"
          defaultValue={defaultData[LUTEAL_START_DATE_KEY]}
        />
        <DateInput
          label="Luteal (post ovulatory) phase start date"
          name={LUTEAL_START_DATE_KEY}
          type="date"
          max={dateConfig.maxDate}
          min={dateConfig.minDate}
          defaultValue={defaultData[LUTEAL_START_DATE_KEY]}
        />
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </SimpleModal>
  );
}
