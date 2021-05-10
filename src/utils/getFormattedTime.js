export function getFormattedTime(date) {
  let hour = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let amOrPm = "AM";
  if (hour > 12) {
    amOrPm = "PM";
    hour = (hour % 12).toString().padStart(2, "0");
  }
  return `${hour}:${minutes} ${amOrPm}`;
}