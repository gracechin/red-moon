import React, { useState } from "react";
import { Button } from "react-bootstrap";
import {
  clearStoredEntries,
  getStoredEntries,
  getSettings,
} from "../utils/dataStorage";
import {
  PERIOD_ENTRY_MODE,
  PeriodEntryModal,
  SimpleModal,
} from "../components/Modal.js";
import { PeriodChart } from "../components/Chart";
import NavBar from "../components/NavBar";
import { CHART_VIEW_OPTIONS, CHART_VIEW_KEY } from "../utils/constants";

function HomePage() {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [entries, setEntries] = useState(getStoredEntries());
  const settings = getSettings();

  const refreshData = () => {
    setEntries(getStoredEntries());
  };

  return (
    <div className="wrapper">
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
        compressed={
          settings[CHART_VIEW_KEY] == CHART_VIEW_OPTIONS.COMPRESSED.name
        }
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
    </div>
  );
}

export default HomePage;
