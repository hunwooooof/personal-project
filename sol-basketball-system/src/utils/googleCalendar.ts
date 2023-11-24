import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId: '125388357875-hkvodoft5ka71f6far18ha6njqcrgr10.apps.googleusercontent.com',
  apiKey: 'AIzaSyATJpMN5ZM4_VobnmIFN5vwJWbHRPLrqpA',
  scope: 'https://www.googleapis.com/auth/calendar.events',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
};

export const apiCalendar = new ApiCalendar(config);
