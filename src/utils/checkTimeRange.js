export default function (start, end, current) {
  let startTime = {
    hour: Number(start.substring(0, 2)),
    minutes: Number(start.substring(3, 5)),
  };

  let endTime = {
    hour: Number(end.substring(0, 2)),
    minutes: Number(end.substring(3, 5)),
  };

  let currentTime = {
    hour: Number(current.substring(0, 2)),
    minutes: Number(current.substring(3, 5)),
  };

  // TODO: Verify minutes ranges syntax errors in newer versions.
  if (startTime.hour > endTime.hour) {
    throw new Error('End time cannot be earlier than start time in ranges.');
  }

  if (
    startTime.hour === currentTime.hour &&
    currentTime.hour === endTime.hour
  ) {
    if (
      startTime.minutes <= currentTime.minutes &&
      currentTime.minutes <= endTime.minutes
    ) {
      return true;
    } else {
      return false;
    }
  }

  if (startTime.hour < currentTime.hour && currentTime.hour < endTime.hour) {
    return true;
  }

  if (startTime.hour === currentTime.hour) {
    if (currentTime.minutes >= startTime.minutes) {
      return true;
    }
  }

  if (currentTime.hour === endTime.hour) {
    if (currentTime.minutes <= endTime.minutes) {
      return true;
    }
  }

  return false;
}
