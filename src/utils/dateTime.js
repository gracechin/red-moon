export const transformDateToDateStr = (d) => {
  const date = d.toLocaleString().split(" ");
  const [day, month, year] = date[0].split("/").map((s) => s.replace(",", ""));
  return [year, month, day].join("-");
};

export const getCurrentDateStr = () => {
  return transformDateToDateStr(new Date());
};

export const getCurrentTimeStr = () => {
  const date = new Date().toLocaleString().split(" ");
  const [hh, mm, _ss] = date[1].split(":");
  return [hh, mm].join(":");
};

export const dateComparison = (a, b) => {
  const date1 = new Date(a);
  const date2 = new Date(b);
  return date1 - date2;
};

export const datesDiffInDays = (d1, d2) => {
  const timeDiff = Math.abs(d1.getTime() - d2.getTime());
  return timeDiff / (1000 * 3600 * 24);
};

export const newDateByDiff = (d, diff) => {
  const nd = new Date();
  nd.setDate(d.getDate() + diff);
  return nd;
};

export const newDateStrByDiff = (dateStr, diff) => {
  const d = new Date(dateStr);
  const nd = newDateByDiff(d, diff);
  return transformDateToDateStr(nd);
};

export const transformDateStrToDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
