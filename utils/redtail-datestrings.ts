import { zonedTimeToUtc } from "date-fns-tz";
import { fromUnixTime, getUnixTime } from "date-fns";

export const toRedtailDatestring = (date: Date): string => {
  console.log("toRedtailDatestring Entered");
  console.log(date);

  if (date) {
    const epoch = getUnixTime(date) * 1000;
    console.log("RETURNING: ");
    console.log(date);
    console.log(`/Date(${epoch})/`);
    return `/Date(${epoch})/`;
  } else {
    console.log("RETURNING: ");
    console.log("/Date(-2208960000000-0800)/");
    return "/Date(-2208960000000-0800)/";
  }
};

export const fromRedtailDatestring = (date: string): Date => {
  console.log("fromRedtailDatestring Entered");
  console.log(date);

  // This specific string is used by Redtail to signify an unspecified date
  if (!date || date === `/Date(-2208960000000-0800)/`) {
    return null;
  }

  // Strip wrapping /Date()/ if present
  const prefix = `/Date(`;
  const suffix = `)/`;
  const rawEpoch = (date.startsWith(prefix)
    ? date.slice(prefix.length)
    : date
  ).endsWith(suffix)
    ? date.slice(-1 * suffix.length)
    : date;

  // Seperate timezone offset if present
  const epoch = rawEpoch.replace(/([-|+]\d{4})$/, "");
  const tzOffset = rawEpoch.split(epoch).join("");

  // If epoch isn't valid, return null
  if (!parseInt(epoch)) {
    return null;
  }

  console.log("RETURNING:");
  console.log(
    tzOffset
      ? fromUnixTime(Number.parseInt(epoch))
      : zonedTimeToUtc(fromUnixTime(Number.parseInt(epoch)), tzOffset)
  );

  // Otherwise, return converted date, accounting for tz offset if provided
  return tzOffset
    ? fromUnixTime(Number.parseInt(epoch))
    : zonedTimeToUtc(fromUnixTime(Number.parseInt(epoch)), tzOffset);
};
