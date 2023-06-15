import React from "react";
import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import { storeEntry, getSettings } from "../utils/dataStorage";
import {
  getCurrentDateStr,
  transformDateStrToDateLabel,
} from "../utils/dateTime";
import {
  DEF_TEMP_TAKEN_TIME_KEY,
  ENTRY_INPUT_FIELDS,
} from "../utils/constants";
import { FormInput } from "./FormInput";

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
        <Col>
          <Button variant="secondary" onClick={onSubmit}>
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
}) {
  const isAddNewMode = mode === PERIOD_ENTRY_MODE.NEW;
  const settings = getSettings();
  const defTime = settings[DEF_TEMP_TAKEN_TIME_KEY];
  const defDate = defaultData.Date;

  const fieldsConfig = ENTRY_INPUT_FIELDS.map((f) =>
    defaultData[f.name] ? { ...f, defaultValue: defaultData[f.name] } : f
  );
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    storeEntry({ ...defaultData, ...formJson });
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
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              name="Date"
              type="date"
              max={dateConfig.maxDate}
              min={dateConfig.minDate}
              defaultValue={(!isAddNewMode && defDate) || getCurrentDateStr()}
            />
          </Form.Group>
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
                defaultValue={(!isAddNewMode && defaultData.Time) || defTime}
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
