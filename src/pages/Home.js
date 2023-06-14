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
  ConfirmModal,
} from "../components/Modal.js";
import { PeriodChart } from "../components/Chart";
import NavBar from "../components/NavBar";
import {
  CHART_VIEW_OPTIONS,
  CHART_VIEW_KEY,
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
} from "../utils/constants";
import { newDateStrByDiff } from "../utils/dateTime";

function HomePage() {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [storedEntries, setStoredEntries] = useState(getStoredEntries());
  const settings = getSettings();
  const chartStartDate = settings[CHART_START_DATE_KEY];
  const chartEndDate = newDateStrByDiff(
    chartStartDate,
    settings[CHART_NUM_OF_CYCLE_DAYS_KEY]
  );
  const entries = storedEntries.filter((e) => {
    const d = new Date(e.Date);
    return new Date(chartEndDate) > d && new Date(chartStartDate) <= d;
  });
  const refreshData = () => {
    setStoredEntries(getStoredEntries());
  };
  const onCloseEntryModal = () => setShowEntryModal(false);
  const onSubmitEntryModal = () => {
    refreshData();
    onCloseEntryModal();
  };
  const onCloseClearConfirmModal = () => setShowClearConfirmModal(false);
  const onClearAllData = () => {
    clearStoredEntries();
    refreshData();
    onCloseClearConfirmModal();
  };

  return (
    <div className="wrapper">
      <NavBar
        onReset={() => setShowClearConfirmModal(true)}
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
        onHide={onCloseEntryModal}
        onSubmit={onSubmitEntryModal}
        defaultData={
          selectedColumn > -1 && entries.length > 0
            ? entries[selectedColumn]
            : {}
        }
        dateConfig={{
          minDate: chartStartDate,
          maxDate: chartEndDate,
        }}
        mode={
          selectedColumn > -1 ? PERIOD_ENTRY_MODE.EDIT : PERIOD_ENTRY_MODE.NEW
        }
      />
      <ConfirmModal
        show={showClearConfirmModal}
        heading="Clear all data?"
        size="sm"
        onClose={onCloseClearConfirmModal}
        onSubmit={onClearAllData}
        bodyText="Cleared data cannot be recovered."
        submitButtonText="Clear all"
        onHide={onCloseClearConfirmModal}
      />
    </div>
  );
}

export default HomePage;
