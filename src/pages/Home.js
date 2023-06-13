import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
import { Chart, getElementAtEvent } from "react-chartjs-2";
import { clearStoredEntries, getStoredEntries } from "../utils/dataStorage";
import {
  PERIOD_ENTRY_MODE,
  PeriodEntryModal,
  SimpleModal,
} from "../components/Modal.js";
import { PeriodChart } from "../components/Chart";
import NavBar from "../components/NavBar";

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
