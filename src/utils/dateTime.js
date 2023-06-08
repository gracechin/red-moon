export const getCurrentDate = () => {
  const date = new Date().toLocaleString().split(" ");
  const [day, month, year] = date[0].split("/").map((s) => s.replace(",", ""));
  return [year, month, day].join("-");
};

export const getCurrentTime = () => {
  const date = new Date().toLocaleString().split(" ");
  const [hh, mm, _ss] = date[1].split(":");
  return [hh, mm].join(":");
};

export const dateComparison = (a, b) => {
  const date1 = new Date(a);
  const date2 = new Date(b);
  return date1 - date2;
};
