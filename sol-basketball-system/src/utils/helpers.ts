export function formatTimestampToYYYYMMDD(timestamp: number) {
  const timeObject = new Date(timestamp);
  const yyyy = timeObject.getFullYear();
  const mm = timeObject.getMonth() + 1;
  const formattedMm = mm < 10 ? `0${mm}` : String(mm);
  const dd = timeObject.getDate();
  const formattedDd = dd < 10 ? `0${dd}` : String(dd);
  const date = `${yyyy}${formattedMm}${formattedDd}`;
  return date;
}

export function formatTimestampToYYYYslashMMslashDD(timestamp: number) {
  const timeObject = new Date(timestamp);
  const yyyy = timeObject.getFullYear();
  const mm = timeObject.getMonth() + 1;
  const formattedMm = mm < 10 ? `0${mm}` : String(mm);
  const dd = timeObject.getDate();
  const formattedDd = dd < 10 ? `0${dd}` : String(dd);
  const showDate = `${yyyy}/${formattedMm}/${formattedDd}`;
  return showDate;
}

export function formatTimestampToTime(timestamp: number) {
  const timeObject = new Date(timestamp);
  const hour = timeObject.getHours();
  const formattedHour = hour < 10 ? `0${hour}` : String(hour);
  const min = timeObject.getMinutes();
  const formattedMin = min < 10 ? `0${min}` : String(min);
  const time = `${formattedHour}:${formattedMin}`;
  return time;
}
