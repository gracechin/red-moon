import {
  dateComparison,
  datesDiffInDays,
  transformDateToDateStr,
  newDateByDiff,
} from "../utils/dateTime";
import { range } from "../utils/utils";
const DATA_ENTRIES_KEY = "Entries";

export const getStored = (key) => JSON.parse(localStorage.getItem(key));

export const store = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getStoredEntries = () => getStored(DATA_ENTRIES_KEY) || [];

const getMissingEntries = (entries, newEntry) => {
  if (entries.length == 0) return [];
  const newEntryDate = new Date(newEntry.Date);
  const dates = entries.map((e) => new Date(e.Date));
  const maxDate = new Date(Math.max.apply(null, dates));
  const minDate = new Date(Math.min.apply(null, dates));
  const diffWithMaxDate = datesDiffInDays(maxDate, newEntryDate);
  const diffWithMinDate = datesDiffInDays(minDate, newEntryDate);
  if (diffWithMaxDate == 1 || diffWithMinDate == 1) return [];
  const missingDates =
    diffWithMaxDate > diffWithMinDate
      ? range(1, diffWithMinDate).map((i) => newDateByDiff(minDate, -i))
      : range(1, diffWithMaxDate).map((i) => newDateByDiff(maxDate, i));
  return missingDates.map((d) => ({
    Date: transformDateToDateStr(d),
  }));
};

export const storeEntries = (entries) => {
  const sortedEntries = entries.sort((e1, e2) =>
    dateComparison(e1.Date, e2.Date)
  );
  localStorage.setItem(DATA_ENTRIES_KEY, JSON.stringify(sortedEntries));
};

export const storeEntry = (entry) => {
  var entries = getStoredEntries() || [];
  if (entries.map((e) => e.Date).includes(entry.Date)) {
    entries = entries.filter((e) => e.Date != entry.Date);
  } else {
    entries = [...entries, ...getMissingEntries(entries, entry)];
  }
  entries.push(entry);
  storeEntries(entries);
};

export const clearStoredEntries = () => delete localStorage[DATA_ENTRIES_KEY];
