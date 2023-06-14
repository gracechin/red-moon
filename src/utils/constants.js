export const DAILY_SITUATION_OPTIONS = {
  DRY: {
    name: "Dry",
    icon: "🌵",
  },
  STICKY: {
    name: "Sticky",
    icon: "🩹",
  },
  CREAMY: {
    name: "Creamy",
    icon: "☁️",
  },
  EGG_WHITE: {
    name: "Egg white",
    icon: "🍳",
  },
  SPOTTING: {
    name: "Spotting",
    icon: "🩸",
  },
  PERIOD: {
    name: "Period",
    icon: "🩸🩸",
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
