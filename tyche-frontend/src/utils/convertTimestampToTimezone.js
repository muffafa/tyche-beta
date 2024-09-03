import { DateTime } from "luxon";

/**
 * Converts a timestamp to the specified timezone and format.
 * @param {number} timestamp - The transaction timestamp in milliseconds.
 * @param {string} timezone - The timezone to convert the timestamp to.
 * @returns {string} - The formatted date and time string.
 */
export function convertTimestampToTimezone(transactionTime, timezone) {
  return DateTime.fromMillis(parseInt(transactionTime, 10))
    .setZone(timezone)
    .toLocaleString(DateTime.DATETIME_MED);
}
