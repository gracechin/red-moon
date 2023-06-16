import React, { useState } from "react";
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
  InterpretModal,
} from "../components/Modal.js";
import { PeriodChart } from "../components/PeriodChart";
import NavBar from "../components/NavBar";
import {
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
  DEF_TEMP_TAKEN_TIME_KEY,
  REQUIRED_ENTRY_INPUT_FIELDS,
  OPTIONAL_ENTRY_INPUT_FIELDS,
} from "../utils/constants";
import { newDateStrByDiff } from "../utils/dateTime";

function HomePage() {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showInterpretModal, setShowInterpretModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [allEntries, setAllEntries] = useState(getAllEntries());
  const settings = getSettings();
  const inputFieldsConfig = [
    ...REQUIRED_ENTRY_INPUT_FIELDS,
    ...OPTIONAL_ENTRY_INPUT_FIELDS.filter((f) => settings[f.name] == "on"),
  ];
  const defDataBase = { Time: settings[DEF_TEMP_TAKEN_TIME_KEY] };
  const chartStartDate = settings[CHART_START_DATE_KEY];
  const chartEndDate = newDateStrByDiff(
    chartStartDate,
    settings[CHART_NUM_OF_CYCLE_DAYS_KEY]
  );
  const dateConfig = {
    minDate: chartStartDate,
    maxDate: chartEndDate,
  };
  const entries = allEntries.filter((e) => {
    const d = new Date(e.Date);
    return new Date(chartEndDate) > d && new Date(chartStartDate) <= d;
  });
  const refreshData = () => {
    setAllEntries(getAllEntries());
  };
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
        onEdit={() => setShowInterpretModal(true)}
      />
      <PeriodChart
        entries={entries}
        onClickColumn={(colIdx) => {
          setSelectedColumn(colIdx);
          setShowEntryModal(true);
        }}
        inputFieldsConfig={inputFieldsConfig}
      />
      <PeriodEntryModal
        show={showEntryModal}
        inputFieldsConfig={inputFieldsConfig}
        onHide={() => setShowEntryModal(false)}
        onSubmit={refreshData}
        defaultData={
          selectedColumn > -1 && entries.length > 0
            ? { ...defDataBase, ...entries[selectedColumn] }
            : defDataBase
        }
        dateConfig={dateConfig}
        mode={
          selectedColumn > -1 ? PERIOD_ENTRY_MODE.EDIT : PERIOD_ENTRY_MODE.NEW
        }
      />
      <ConfirmModal
        show={showClearConfirmModal}
        heading="🗑️ Clear all data?"
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
      <InterpretModal
        show={showInterpretModal}
        onClose={() => setShowInterpretModal(false)}
        onSubmit={refreshData}
        dateConfig={dateConfig}
        defaultData={settings}
      />
    </div>
  );
}

export default HomePage;
