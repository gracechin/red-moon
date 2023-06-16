const EGG_WHITE_DATA_BASE = {
  name: "Egg white",
  icon: "🍳",
  iconClassname: "icon",
  value: "-",
};
const CREAMY_DATA_BASE = {
  name: "Creamy",
  icon: "☁️",
  iconClassname: "icon",
  value: "-",
};
const DRY_DATA_BASE = {
  name: "🩸/Dry/Sticky",
  icon: "🩸",
  iconClassname: "icon",
  value: "-",
};
const EGG_WHITE_DATA = {
  EMPTY: EGG_WHITE_DATA_BASE,
  FILLED: { ...EGG_WHITE_DATA_BASE, iconClassname: "icon icon-filled" },
};
const CREAMY_DATA = {
  EMPTY: CREAMY_DATA_BASE,
  FILLED: { ...CREAMY_DATA_BASE, iconClassname: "icon icon-filled" },
};
const DRY_DATA = {
  EMPTY: DRY_DATA_BASE,
  DRY: { ...DRY_DATA_BASE, iconClassname: "icon icon-dry" },
  FILLED: { ...DRY_DATA_BASE, iconClassname: "icon icon-filled" },
  PERIOD: { ...DRY_DATA_BASE, iconClassname: "icon icon-period" },
  SPOTTING: { ...DRY_DATA_BASE, iconClassname: "icon icon-spotting" },
};

export const DAILY_SITUATION_OPTIONS = {
  DRY: {
    name: "Dry",
    icon: "🌵",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.DRY],
  },
  STICKY: {
    name: "Sticky",
    icon: "🩹",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.FILLED],
  },
  CREAMY: {
    name: "Creamy",
    icon: "☁️",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.FILLED, DRY_DATA.FILLED],
  },
  EGG_WHITE: {
    name: "Egg white",
    icon: "🍳",
    value: [EGG_WHITE_DATA.FILLED, CREAMY_DATA.FILLED, DRY_DATA.FILLED],
  },
  SPOTTING: {
    name: "Spotting",
    icon: "⭕",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.SPOTTING],
  },
  PERIOD: {
    name: "Period",
    icon: "🩸",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.PERIOD],
  },
  NONE: {
    name: "None",
    icon: "-",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.EMPTY],
  },
};

export const LUTEAL_PHASE_DATA_BASE = {
  name: "Luteal Phase",
  icon: "LP",
};

export const START_TEMP_RISE_FIELD = {
  fieldType: "Switch",
  label: "Temperature rise (luteal phase) starts today",
  name: "startTempRise",
  type: "switch",
};

export const REQUIRED_ENTRY_INPUT_FIELDS = [
  {
    fieldType: "CheckOptions",
    label: "Daily Situation",
    name: "Situation",
    icon: "🌸",
    options: Object.values(DAILY_SITUATION_OPTIONS),
    type: "radio",
    defaultValue: "None",
  },
  {
    fieldType: "Text",
    label: "Note",
    name: "Note",
    icon: "📝",
    type: "text",
    placeholder: "Enter a note...",
  },
];

export const OPTIONAL_ENTRY_INPUT_FIELDS = [
  {
    fieldType: "Options",
    label: "Intercourse",
    name: "Intercourse",
    icon: "💕",
    options: [
      { name: "Protected", icon: "☔" },
      { name: "Unprotected", icon: "🌧️" },
    ],
    type: "checkbox",
  },
  {
    fieldType: "Options",
    label: "Exercise Intensity",
    name: "Excercise",
    icon: "👟",
    type: "radio",
    options: [
      { name: "Low", icon: "⬇️" },
      { name: "Medium", icon: "➡️" },
      { name: "High", icon: "⬆️" },
    ],
  },
  {
    fieldType: "Options",
    label: "How are you feeling?",
    name: "Feeling",
    icon: "😶",
    type: "radio",
    options: [
      { name: "Terrible", icon: "😣" },
      { name: "Bad", icon: "😕" },
      { name: "Meh", icon: "😐" },
      { name: "Good", icon: "😊" },
      { name: "Great", icon: "😄" },
    ],
  },
  {
    fieldType: "Options",
    label: "Sleep Quality & Quantity",
    name: "Sleep",
    icon: "😴",
    type: "radio",
    options: [
      { name: "Poor", icon: "👎" },
      { name: "Okay", icon: "👌" },
      { name: "Good", icon: "👍" },
    ],
  },
  {
    fieldType: "Switch",
    label: "Flight",
    name: "Flight",
    icon: "✈️",
    type: "switch",
    defaultChecked: false,
  },
];

export const ALL_ENTRY_INPUT_FIELDS = [
  ...REQUIRED_ENTRY_INPUT_FIELDS,
  ...OPTIONAL_ENTRY_INPUT_FIELDS,
];

export const SETTINGS_KEYS = {
  COVERLINE_TEMP: "Coverline temp",
  LUTEAL_START_DATE: "Luteal start date",
  CHART_START_DATE: "Chart start date",
  DEF_TEMP_TAKEN_TIME: "Default time taken key",
  CHART_NUM_OF_CYCLE_DAYS: "Chart # of cycle days",
  SHOW_CHART_DESCR: "Show Chart Description",
  CHART_DESCR: "Chart Description",
};

export const DATA_ENTRIES_KEY = "Entries";
export const SETTINGS_KEY = "Settings";
export const DEFAULT_SETTINGS = {
  [SETTINGS_KEYS.CHART_NUM_OF_CYCLE_DAYS]: 40,
  [SETTINGS_KEYS.DEF_TEMP_TAKEN_TIME]: "08:00",
};

export const MY_WEB_ADDRESS = "https://gracechin.github.io";
