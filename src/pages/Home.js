import React, { useState } from "react";
import {
  deleteStoredEntries,
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
  SETTINGS_KEYS,
  REQUIRED_ENTRY_INPUT_FIELDS,
  OPTIONAL_ENTRY_INPUT_FIELDS,
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
  const inputFieldsConfig = [
    ...REQUIRED_ENTRY_INPUT_FIELDS,
    ...OPTIONAL_ENTRY_INPUT_FIELDS.filter((f) => settings[f.name] == "on"),
  ];
  const defDataBase = { Time: settings[SETTINGS_KEYS.DEF_TEMP_TAKEN_TIME] };
  const chartStartDate = settings[SETTINGS_KEYS.CHART_START_DATE];
  const chartEndDate = newDateStrByDiff(
    chartStartDate,
    settings[SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS]
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
    deleteStoredEntries();
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
        refreshData={refreshData}
      />
      <PeriodChart
        entries={entries}
        onClickColumn={(colIdx) => {
          setSelectedColumn(colIdx);
          setShowEntryModal(true);
        }}
        coverline={settings[SETTINGS_KEYS.COVERLINE_TEMP]}
        inputFieldsConfig={inputFieldsConfig}
        showDescription={settings[SETTINGS_KEYS.SHOW_CHART_DESCR]}
        description={settings[SETTINGS_KEYS.CHART_DESCR]}
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
        heading="🗑️ Clear All Data?"
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
