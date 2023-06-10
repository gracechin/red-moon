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

function DailyPeriodForm({ closeModal }) {
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry(formJson);
    closeModal && closeModal();
  }

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control name="Date" type="date" defaultValue={getCurrentDate()} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formTemp">
        <Form.Label>Basal Temperature</Form.Label>
        <Row>
          <Col>
            <Form.Control
              name="Temperature"
              type="float"
              placeholder="Temp in °C"
            />
          </Col>
          <Col>
            <Form.Control
              name="Time"
              type="time"
              defaultValue={getCurrentTime()}
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
          defaultValue="Dry"
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
  );
}

export function DataEntry() {
  return (
    <>
      <p>
        Start tracking your <code>Period🩸</code>.
      </p>
      <DailyPeriodForm />
    </>
  );
}

function HomePage() {
  const [modalShow, setModalShow] = useState(false);
  const [entries, setEntries] = useState(getStoredEntries());

  const refreshData = () => {
    setEntries(getStoredEntries());
  };

  useEffect(() => {
    // refreshData();
  }, []);

  return (
    <Container>
      <NavBar onReset={clearStoredEntries} onAdd={() => setModalShow(true)} />
      <PeriodChart
        entries={entries}
        onClickColumn={() => setModalShow(true)}
        hideTableHeading={true}
      />
      <Row>
        <SimpleModal
          show={modalShow}
          heading="Period entry"
          onHide={() => setModalShow(false)}
        >
          <DailyPeriodForm closeModal={() => setModalShow(false)} />
        </SimpleModal>
      </Row>
    </Container>
  );
}

export default HomePage;
