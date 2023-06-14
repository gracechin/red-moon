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
  FILLED: { ...DRY_DATA_BASE, iconClassname: "icon icon-filled" },
  PERIOD: { ...DRY_DATA_BASE, iconClassname: "icon icon-period" },
  SPOTTING: { ...DRY_DATA_BASE, iconClassname: "icon icon-spotting" },
};

export const DAILY_SITUATION_OPTIONS = {
  DRY: {
    name: "Dry",
    icon: "🌵",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.EMPTY],
  },
  STICKY: {
    name: "Sticky",
    icon: "🩹",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.FILLED],
  },
  CREAMY: {
    name: "Creamy",
    icon: "☁️",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.FILLED, DRY_DATA.FILLED],
  },
  EGG_WHITE: {
    name: "Egg white",
    icon: "🍳",
    fluidData: [EGG_WHITE_DATA.FILLED, CREAMY_DATA.FILLED, DRY_DATA.FILLED],
  },
  SPOTTING: {
    name: "Spotting",
    icon: "🩸",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.SPOTTING],
  },
  PERIOD: {
    name: "Period",
    icon: "🩸🩸",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.PERIOD],
  },
  NONE: {
    name: "None",
    icon: "-",
    fluidData: [EGG_WHITE_DATA.EMPTY, CREAMY_DATA.EMPTY, DRY_DATA.EMPTY],
  },
};

export const CHART_VIEW_KEY = "Chart view";
export const CHART_START_DATE_KEY = "Chart start date";
export const CHART_NUM_OF_CYCLE_DAYS_KEY = "Chart # of cycle days";
export const DATA_ENTRIES_KEY = "Entries";
export const SETTINGS_KEY = "Settings";

export const CHART_VIEW_OPTIONS = {
  NORMAL: { name: "Normal" },
  COMPRESSED: { name: "Compressed" },
};

export const DEFAULT_SETTINGS = {
  "Chart view": CHART_VIEW_OPTIONS.NORMAL.name,
  "Chart # of cycle days": 40,
};
