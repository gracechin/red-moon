import React, { useRef, useState, useEffect } from "react";
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
import { SynchronisedGraphTable } from "../components/Chart";

// Data

const DUMMY_DATA = [
  {
    graph: { x: 1, y: 30 },
    table: [
      { name: "Date", value: "06" },
      { name: "Temp", value: "30" },
    ],
  },
  {
    graph: { x: 2, y: 25 },
    table: [
      { name: "Date", value: "07" },
      { name: "Temp", value: "25" },
    ],
  },
  {
    graph: { x: 3, y: 27 },
    table: [
      { name: "Date", value: "08" },
      { name: "Temp", value: "37" },
    ],
  },
];

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

const DAYS_OF_WEEK = ["🌞", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateLabel = (dateStr) => {
  const dayIdx = new Date(dateStr).getDay();
  const [_yyyy, mm, dd] = dateStr.split("-");
  return `${[dd, mm].join("/")} ${DAYS_OF_WEEK[dayIdx]}`;
};

const transformEntryToData = ({ Temperature, Date, Time, Situation }, idx) => {
  return {
    graph: { x: idx, y: parseInt(Temperature) },
    table: [
      { name: "Day", value: `Day ${idx + 1}` },
      { name: "Date", value: formatDateLabel(Date) },
      { name: "Time", value: `🕔 ${Time}` },
      { name: "Temp", value: `${Temperature}°C` },
      { name: "Situation", value: Situation },
    ],
  };
};

function HomePage() {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);

  const refreshData = () => {
    const newData = getStoredEntries().map(transformEntryToData);
    console.log(newData);
    setData(newData);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="primary" onClick={clearStoredEntries}>
            Clear Data
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            +
          </Button>
        </Col>
      </Row>
      <SynchronisedGraphTable
        data={data}
        yRange={[35.5, 37.5]}
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
