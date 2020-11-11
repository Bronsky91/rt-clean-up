// Takes yyyy-MM-dd formatted datestring and converts to Date object or null if invalid
export const datestringToDate = (date: string): Date | null => {
  const [year, month, day]: string[] = date.split("-");
  const result =
    !isNaN(parseInt(year)) && !isNaN(parseInt(month)) && !isNaN(parseInt(day))
      ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      : null;
  return result;
};

// Takes Date object and converts to yyyy-MM-dd formatted datestring
export const dateToDatestring = (date: Date): string => {
  const result: string = [
    date.getFullYear(),
    ("0" + (date.getMonth() + 1)).slice(-2),
    ("0" + date.getDate()).slice(-2),
  ].join("-");
  return result;
};
