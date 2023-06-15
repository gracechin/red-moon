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
    icon: "🩸",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.SPOTTING],
  },
  PERIOD: {
    name: "Period",
    icon: "🩸🩸",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.PERIOD],
  },
  NONE: {
    name: "None",
    value: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.EMPTY],
  },
};

export const ENTRY_INPUT_FIELDS = [
  {
    fieldType: "CheckOptions",
    label: "Daily Situation",
    name: "Situation",
    options: Object.values(DAILY_SITUATION_OPTIONS),
    type: "radio",
    defaultValue: "None",
  },
  {
    fieldType: "Options",
    label: "Intercourse",
    name: "Intercourse",
    icon: "💕",
    options: [
      { name: "Condom", icon: "🍌" },
      { name: "Raw", icon: "🍆" },
    ],
    type: "checkbox",
  },
  {
    fieldType: "Switch",
    label: "Exercise",
    name: "Excercise",
    icon: "👟",
    type: "switch",
  },
];

export const CHART_START_DATE_KEY = "Chart start date";
export const DEF_TEMP_TAKEN_TIME_KEY = "Default time taken key";
export const CHART_NUM_OF_CYCLE_DAYS_KEY = "Chart # of cycle days";
export const DATA_ENTRIES_KEY = "Entries";
export const SETTINGS_KEY = "Settings";
export const DEFAULT_SETTINGS = {
  [CHART_NUM_OF_CYCLE_DAYS_KEY]: 40,
  [DEF_TEMP_TAKEN_TIME_KEY]: "08:00",
};
