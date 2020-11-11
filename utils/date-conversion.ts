export const yyyymmddToDate = (date: string): Date | null => {
  const [year, month, day]: string[] = date.split("-");
  const result =
    !isNaN(parseInt(year)) && !isNaN(parseInt(month)) && !isNaN(parseInt(day))
      ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      : null;
  return result;
};

export const yyyymmddFromDate = (date: Date): string => {
  const result: string = [
    date.getFullYear(),
    ("0" + (date.getMonth() + 1)).slice(-2),
    ("0" + date.getDate()).slice(-2),
  ].join("-");
  return result;
};
