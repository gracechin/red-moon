import {
  dateComparison,
  newDateStrByDiff,
  getCurrentDateStr,
} from "../utils/dateTime";
import { range } from "../utils/utils";
import {
  DEFAULT_SETTINGS,
  DATA_ENTRIES_KEY,
  SETTINGS_KEY,
  CHART_START_DATE_KEY,
  CHART_NUM_OF_CYCLE_DAYS_KEY,
} from "../utils/constants";

// Utils

export const getStored = (key) => JSON.parse(localStorage.getItem(key));

export const store = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Settings

const getDefaultSettings = () => {
  const defaultSettings = DEFAULT_SETTINGS;
  defaultSettings[CHART_START_DATE_KEY] = getCurrentDateStr();
  return defaultSettings;
};

const initialiseSettings = () => {
  const defSettings = getDefaultSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defSettings));
};

export const getSettings = () => {
  if (!settings) initialiseSettings();
  const settings = getStored(SETTINGS_KEY);
  settings[CHART_NUM_OF_CYCLE_DAYS_KEY] = parseInt(
    settings[CHART_NUM_OF_CYCLE_DAYS_KEY]
  );
  return settings;
};

export const saveSettings = (settings) => {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ ...getSettings(), ...settings })
  );
};

// Entries

const genDefaultEntries = () => {
  const settings = getSettings();
  const numEntries = settings[CHART_NUM_OF_CYCLE_DAYS_KEY];
  const startDate = settings[CHART_START_DATE_KEY];
  return range(0, numEntries).map((i) => ({
    Date: newDateStrByDiff(startDate, i),
  }));
};

export const getStoredEntries = () => {
  return genDefaultEntries().map((defEntry) => {
    const entries = getStored(DATA_ENTRIES_KEY) || [];
    const matchedEntries = entries.filter((e) => e.Date == defEntry.Date);
    if (matchedEntries.length == 0) return defEntry;
    return matchedEntries[0];
  });
};

export const storeEntries = (entries) => {
  const sortedEntries = entries.sort((e1, e2) =>
    dateComparison(e1.Date, e2.Date)
  );
  localStorage.setItem(DATA_ENTRIES_KEY, JSON.stringify(sortedEntries));
};

export const storeEntry = (entry) => {
  var entries = getStoredEntries();
  entries = entries.filter((e) => e.Date != entry.Date);
  entries.push(entry);
  storeEntries(entries);
};

export const clearStoredEntries = () => delete localStorage[DATA_ENTRIES_KEY];
