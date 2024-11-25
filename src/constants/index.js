export const API_KEY = "449aa65b2dd4d9bacf7a54bb60433592";
export const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const API_KEY_KO = "1GqQRJlRR2GqkESZURdhSw"
export const BASE_URL_KO = "https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min"


//forecasts
export const API_KEY_BJH = "15b326c9c3c7497f23a213fb964f6716";
export const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast"; 

export const NAVER_MAPS_CLIENT_ID = "t04sooamwm";

const PRESSURE_UNITS = 0.750062

export const capitalizeFirstLetter = (str) => {
  if (str === null || str === undefined) return "";

  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const getPressureMm = (hpa) => {
return Math.round(hpa * PRESSURE_UNITS);
}

export const getTime = (seconds) => {
  return new Date(seconds * 1000).toLocaleTimeString('ru-RU', {timeZone: 'Atlantic/Reykjavik'})
}