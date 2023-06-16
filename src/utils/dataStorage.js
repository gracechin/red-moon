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
  SETTINGS_KEYS,
} from "../utils/constants";

// Utils

export const getStored = (key) => JSON.parse(localStorage.getItem(key));

export const store = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Settings

const getDefaultSettings = () => {
  const defaultSettings = DEFAULT_SETTINGS;
  defaultSettings[SETTINGS_KEYS.CHART_START_DATE] = getCurrentDateStr();
  return defaultSettings;
};

const initialiseSettings = () => {
  const defSettings = getDefaultSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defSettings));
  return defSettings;
};

const FLOAT_SETTING_KEYS = [
  SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS,
  SETTINGS_KEYS.COVERLINE_TEMP,
];

export const getSettings = () => {
  var settings = getStored(SETTINGS_KEY);
  if (!settings) settings = initialiseSettings();
  FLOAT_SETTING_KEYS.forEach(
    (k) => (settings[k] = settings[k] && parseFloat(settings[k]))
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

const genDefaultEntries = (startDate, num) =>
  range(0, num).map((i) => ({
    Date: newDateStrByDiff(startDate, i),
    Situation: "None",
  }));

const genDefaultEntriesFromSettings = () => {
  const settings = getSettings();
  const numEntries = settings[SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS];
  const startDate = settings[SETTINGS_KEYS.CHART_START_DATE];
  return genDefaultEntries(startDate, numEntries);
};

export const getStoredEntries = () => {
  return getStored(DATA_ENTRIES_KEY) || [];
};

export const getAllEntries = () => {
  return genDefaultEntriesFromSettings().map((defEntry) => {
    const entries = getStoredEntries();
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

export const addEntries = (entriesToAdd) => {
  const entriesToAddDates = entriesToAdd.map((e) => e.Date);
  var entries = getAllEntries();
  entries = entries.filter((e) => !entriesToAddDates.includes(e.Date));
  storeEntries([...entries, ...entriesToAdd]);
};

export const storeEntry = (entry) => {
  var entries = getAllEntries();
  entries = entries.filter((e) => e.Date != entry.Date);
  entries.push(entry);
  storeEntries(entries);
};

export const deleteStoredEntries = () => delete localStorage[DATA_ENTRIES_KEY];
