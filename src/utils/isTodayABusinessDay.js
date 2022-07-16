/**
 * Returns true if today is a business day, otherwise false.
 * Business days are from Monday (index: 1) to Friday (index: 5).
 * @returns {boolean} Is today a business day
 */
export default function () {
  const currentDate = new Date();
  const weekDayIndex = currentDate.getDay();
  if (weekDayIndex > 0 && weekDayIndex < 6) {
    return true;
  }
  return false;
}
