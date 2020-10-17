import { fromUnixTime, getUnixTime } from "date-fns";

export const toRedtailDatestring = (date: string): string => {
  const dateValue = new Date(date);

  if (date) {
    const epoch = getUnixTime(dateValue) * 1000;

    return `/Date(${epoch})/`;
  } else {
    return "/Date(-2208960000000-0800)/";
  }
};

export const fromRedtailDatestring = (date: string): Date => {
  // This specific string is used by Redtail to signify an unspecified date
  if (!date || date === `/Date(-2208960000000-0800)/`) {
    return null;
  }

  const timestamp = date.split("(")[1].split(")")[0].slice(0, -5);
  const timestampInSeconds = parseInt(timestamp) / 1000;

  // If epoch isn't valid, return null
  if (!timestampInSeconds) {
    return null;
  }

  // Otherwise, return converted date
  return fromUnixTime(timestampInSeconds);
};
