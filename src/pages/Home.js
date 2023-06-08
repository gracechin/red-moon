import React, { useRef, useState } from "react";
import { getStoredEntries } from "../utils/dataStorage.js";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
import { Chart, getElementAtEvent } from "react-chartjs-2";

import { storeEntry, clearStoredEntries } from "../utils/dataStorage";
import { getCurrentDate, getCurrentTime } from "../utils/dateTime";
import { SimpleModal } from "../components/Modal.js";
import { Container } from "react-bootstrap";

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

const formatDateLabel = (dateStr) => {
  const [_yyyy, mm, dd] = dateStr.split("-");
  return [dd, mm].join("/");
};

function DailyPeriodForm({ closeModal }) {
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    storeEntry({
      ...formJson,
      "Display Date": formatDateLabel(formJson.Date),
    });
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
              type="number"
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

function PeriodChart({ entries, onClickDataPoint }) {
  const data = {
    datasets: [
      {
        type: "line",
        label: "Basal Temperature",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        data: entries,
      },
    ],
  };
  const options = {
    parsing: {
      xAxisKey: "Display Date",
      yAxisKey: "Temperature",
    },
  };

  const getElementLabels = (element) => {
    if (!element.length) return;
    console.log(element);
    const { datasetIndex, index } = element[0];
    console.log(data.datasets[0].data[index]);
    return [
      data.datasets[0].data[index].Date,
      data.datasets[0].data[index].Temperature,
    ];
  };

  const chartRef = useRef(null);

  const onClick = (event) => {
    const { current: chart } = chartRef;
    if (!chart) {
      return;
    }
    const elementLabels = getElementLabels(getElementAtEvent(chart, event));
    if (elementLabels) {
      const [dateLabel, _basalTempLabel] = elementLabels;
      console.log(dateLabel);
      onClickDataPoint();
    }
  };

  return (
    <Chart ref={chartRef} onClick={onClick} options={options} data={data} />
  );
}

function HomePage() {
  const [modalShow, setModalShow] = useState(false);
  const [entries, setEntries] = useState(getStoredEntries());

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
      <Row>
        <PeriodChart
          entries={entries}
          onClickDataPoint={() => setModalShow(true)}
        />
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
