import React, { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
import { Chart, getElementAtEvent } from "react-chartjs-2";
import {
  storeEntry,
  clearStoredEntries,
  getStoredEntries,
} from "../utils/dataStorage";
import { getCurrentDate, getCurrentTime } from "../utils/dateTime";
import { SimpleModal } from "../components/Modal.js";
import { PeriodChart } from "../components/Chart";
import NavBar from "../components/NavBar";

// Data

const DAILY_SITUATION_OPTIONS = [
  {
    name: "Dry",
    icon: "🌕",
  },
  {
    name: "Sticky",
    icon: "",
  },
  {
    name: "Creamy",
    icon: "☁️",
  },
  {
    name: "Egg white",
    icon: "",
  },
  {
    name: "Period",
    icon: "🩸",
  },
];

// UI

const PERIOD_ENTRY_MODE = {
  EDIT: "Edit",
  NEW: "New",
};

function PeriodEntryModal({
  show,
  onHide,
  onSubmit,
  defaultData: {
    Situation: defSituation,
    Date: defDate,
    Time: defTime,
    Temperature: defTemp,
  },
  mode,
}) {
  const isAddNewMode = mode === PERIOD_ENTRY_MODE.NEW;
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry(formJson);
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
              defaultValue={(!isAddNewMode && defDate) || getCurrentDate()}
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
                defaultValue={(!isAddNewMode && defTemp) || null}
              />
            </Col>
            <Col>
              <Form.Control
                name="Time"
                type="time"
                defaultValue={(!isAddNewMode && defTime) || getCurrentTime()}
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
            defaultValue={(!isAddNewMode && defSituation) || "Dry"}
            className="mb-2"
          >
            {DAILY_SITUATION_OPTIONS.map((option, idx) => {
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

function HomePage() {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [entries, setEntries] = useState(getStoredEntries());

  const refreshData = () => {
    setEntries(getStoredEntries());
  };

  return (
    <Container>
      <NavBar
        onReset={() => setShowDeleteConfirmModal(true)}
        onAdd={() => {
          setSelectedColumn(-1);
          setShowEntryModal(true);
        }}
      />
      <PeriodChart
        entries={entries}
        onClickColumn={(colIdx) => {
          setSelectedColumn(colIdx);
          setShowEntryModal(true);
        }}
        hideTableHeading={true}
      />
      <PeriodEntryModal
        show={showEntryModal}
        onHide={() => setShowEntryModal(false)}
        onSubmit={() => {
          refreshData();
          setShowEntryModal(false);
        }}
        defaultData={
          selectedColumn > -1 && entries.length > 0
            ? entries[selectedColumn]
            : {}
        }
        mode={
          selectedColumn > -1 ? PERIOD_ENTRY_MODE.EDIT : PERIOD_ENTRY_MODE.NEW
        }
      />
      <SimpleModal
        show={showDeleteConfirmModal}
        heading="Delete all data?"
        onHide={() => setShowDeleteConfirmModal(false)}
      >
        <Button
          variant="primary"
          onClick={() => setShowDeleteConfirmModal(false)}
        >
          Cancel
        </Button>
        <Button variant="secondary" onClick={clearStoredEntries}>
          Delete
        </Button>
      </SimpleModal>
    </Container>
  );
}

export default HomePage;
