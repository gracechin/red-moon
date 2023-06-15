import React, { useState } from "react";
import { Button } from "react-bootstrap";
import {
  clearStoredEntries,
  getAllEntries,
  getSettings,
  getStoredEntries,
} from "../utils/dataStorage";
import {
  PERIOD_ENTRY_MODE,
  PeriodEntryModal,
  ConfirmModal,
  ExportModal,
  ImportModal,
} from "../components/Modal.js";
import { PeriodChart } from "../components/PeriodChart";
import NavBar from "../components/NavBar";
import {
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
} from "../utils/constants";
import { newDateStrByDiff } from "../utils/dateTime";

function HomePage() {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [allEntries, setAllEntries] = useState(getAllEntries());
  const settings = getSettings();
  const chartStartDate = settings[CHART_START_DATE_KEY];
  const chartEndDate = newDateStrByDiff(
    chartStartDate,
    settings[CHART_NUM_OF_CYCLE_DAYS_KEY]
  );
  const entries = allEntries.filter((e) => {
    const d = new Date(e.Date);
    return new Date(chartEndDate) > d && new Date(chartStartDate) <= d;
  });
  const refreshData = () => {
    setAllEntries(getAllEntries());
  };
  const onCloseEntryModal = () => setShowEntryModal(false);
  const onClearAllData = () => {
    clearStoredEntries();
    refreshData();
  };

  return (
    <div className="wrapper">
      <NavBar
        onReset={() => setShowClearConfirmModal(true)}
        onAdd={() => {
          setSelectedColumn(-1);
          setShowEntryModal(true);
        }}
        onExport={() => setShowExportModal(true)}
        onImport={() => setShowImportModal(true)}
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
        onHide={onCloseEntryModal}
        onSubmit={refreshData}
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
        onClose={() => setShowClearConfirmModal(false)}
        onSubmit={onClearAllData}
        bodyText="Cleared data cannot be recovered."
        submitButtonText="Clear all"
      />
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={getStoredEntries()}
      />
      <ImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={refreshData}
      />
    </div>
  );
}

export default HomePage;
