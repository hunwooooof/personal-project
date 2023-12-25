export const formatShowDate = (date: string) => date.slice(5).replace('-', '/');

export const getCurrentQuarter = (currentDate: Date) => {
  const currentMonth = currentDate.getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);
  return currentQuarter;
};

export const getDateRangeForQuarter = (quarter: number) => {
  if (quarter === 1) {
    return {
      firstDate: '-01-01',
      lastDate: '-03-31',
    };
  }
  if (quarter === 2) {
    return {
      firstDate: '-04-01',
      lastDate: '-06-30',
    };
  }
  if (quarter === 3) {
    return {
      firstDate: '-07-01',
      lastDate: '-09-30',
    };
  }
  if (quarter === 4) {
    return {
      firstDate: '-10-01',
      lastDate: '-12-31',
    };
  }
};

export const calculate_age = (birthday: string) => {
  const dateOfBirth = new Date(birthday);
  const diff = Date.now() - dateOfBirth.getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
};

export const extractVideoId = (youtubeLink: string) => {
  const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = youtubeLink.match(regex);
  return match ? match[1] : null;
};

export function formatTimestampToYYYYMMDD(timestamp: number) {
  const timeObject = new Date(timestamp);
  const yyyy = timeObject.getFullYear();
  const mm = timeObject.getMonth() + 1;
  const formattedMm = mm < 10 ? `0${mm}` : String(mm);
  const dd = timeObject.getDate();
  const formattedDd = dd < 10 ? `0${dd}` : String(dd);
  const date = `${yyyy}${formattedMm}${formattedDd}`;
  return date; // 20231201
}

export function formatTimestampToYYYYslashMMslashDD(timestamp: number) {
  const timeObject = new Date(timestamp);
  const yyyy = timeObject.getFullYear();
  const mm = timeObject.getMonth() + 1;
  const formattedMm = mm < 10 ? `0${mm}` : String(mm);
  const dd = timeObject.getDate();
  const formattedDd = dd < 10 ? `0${dd}` : String(dd);
  const showDate = `${yyyy}/${formattedMm}/${formattedDd}`;
  return showDate; // 2023/12/01
}

export function formatTimestampToTime(timestamp: number) {
  const timeObject = new Date(timestamp);
  const hour = timeObject.getHours();
  const formattedHour = hour < 10 ? `0${hour}` : String(hour);
  const min = timeObject.getMinutes();
  const formattedMin = min < 10 ? `0${min}` : String(min);
  const time = `${formattedHour}:${formattedMin}`;
  return time; // 07:30
}
