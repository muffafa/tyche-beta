import { DateTime } from "luxon";

/**
 * Converts a timestamp to the specified timezone and format.
 * @param {string} transactionTime - The transaction timestamp in ISO format.
 * @param {string} timezone - The timezone to convert the timestamp to.
 * @returns {string} - The formatted date and time string.
 */
export function convertTimestampToTimezone(transactionTime, timezone) {
  return DateTime.fromISO(transactionTime) // ISO formatı kullandığı için fromISO kullanılıyor
    .setZone(timezone)
    .toLocaleString(DateTime.DATETIME_MED);
}
