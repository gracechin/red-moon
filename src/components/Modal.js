import React from "react";
import {
  Col,
  Row,
  Button,
  Form,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
} from "react-bootstrap";
import { storeEntry } from "../utils/dataStorage";
import { getCurrentDateStr, getCurrentTimeStr } from "../utils/dateTime";
import { DAILY_SITUATION_OPTIONS } from "../utils/constants";

export function SimpleModal({ show, heading, children, footer, onHide }) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
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
}) {
  const isAddNewMode = mode === PERIOD_ENTRY_MODE.NEW;
  const defDate = defaultData.Date;
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry({ ...defaultData, ...formJson });
    onSubmit && onSubmit();
  }

  return (
    <SimpleModal
      show={show}
      heading={!isAddNewMode && defDate ? `${defDate} Entry` : "Period entry"}
      onHide={onHide}
    >
      <Form method="post" onSubmit={handleSubmit}>
        {isAddNewMode && (
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              name="Date"
              type="date"
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
                defaultValue={
                  (!isAddNewMode && defaultData.Time) || getCurrentTimeStr()
                }
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formSituation">
          <Form.Label>Daily Situation</Form.Label>
          <br />
          <ToggleButtonGroup
            name="Situation"
            type="radio"
            defaultValue={(!isAddNewMode && defaultData.Situation) || "Dry"}
            className="mb-2"
          >
            {Object.values(DAILY_SITUATION_OPTIONS).map((option, idx) => {
              return (
                <ToggleButton id={option.name} value={option.name} key={idx}>
                  {[option.icon, option.name].join(" ")}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </SimpleModal>
  );
}
