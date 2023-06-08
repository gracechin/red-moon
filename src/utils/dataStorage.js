import { dateComparison } from "../utils/dateTime";

const DATA_ENTRIES_KEY = "Entries";

export const getStored = (key) => JSON.parse(localStorage.getItem(key));

export const store = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getStoredEntries = () => getStored(DATA_ENTRIES_KEY) || [];

export const storeEntries = (entries) => {
  const sortedEntries = entries.sort((e1, e2) =>
    dateComparison(e1.Date, e2.Date)
  );
  localStorage.setItem(DATA_ENTRIES_KEY, JSON.stringify(sortedEntries));
};

export const storeEntry = (entry) => {
  var entries = getStoredEntries() || [];
  entries = entries.filter((e) => e.Date != entry.Date);
  entries.push(entry);
  storeEntries(entries);
};

export const clearStoredEntries = () => delete localStorage[DATA_ENTRIES_KEY];
