/**
 * openMeteoAdapter.js
 * Fetches weather from Open-Meteo (free, no API key) and normalizes
 * the response into the same shape as OpenWeatherMap's /weather + /forecast.
 *
 * Open-Meteo docs: https://open-meteo.com/en/docs
 */

// WMO weather code → description + OWM-style icon
const WMO_CODES = {
  0:  { desc: 'clear sky',            icon: '01d', main: 'Clear' },
  1:  { desc: 'mainly clear',         icon: '01d', main: 'Clear' },
  2:  { desc: 'partly cloudy',        icon: '02d', main: 'Clouds' },
  3:  { desc: 'overcast',             icon: '04d', main: 'Clouds' },
  45: { desc: 'fog',                  icon: '50d', main: 'Fog' },
  48: { desc: 'depositing rime fog',  icon: '50d', main: 'Fog' },
  51: { desc: 'light drizzle',        icon: '09d', main: 'Drizzle' },
  53: { desc: 'moderate drizzle',     icon: '09d', main: 'Drizzle' },
  55: { desc: 'dense drizzle',        icon: '09d', main: 'Drizzle' },
  61: { desc: 'slight rain',          icon: '10d', main: 'Rain' },
  63: { desc: 'moderate rain',        icon: '10d', main: 'Rain' },
  65: { desc: 'heavy rain',           icon: '10d', main: 'Rain' },
  71: { desc: 'slight snow',          icon: '13d', main: 'Snow' },
  73: { desc: 'moderate snow',        icon: '13d', main: 'Snow' },
  75: { desc: 'heavy snow',           icon: '13d', main: 'Snow' },
  80: { desc: 'slight rain showers',  icon: '09d', main: 'Rain' },
  81: { desc: 'moderate rain showers',icon: '09d', main: 'Rain' },
  82: { desc: 'violent rain showers', icon: '09d', main: 'Rain' },
  95: { desc: 'thunderstorm',         icon: '11d', main: 'Thunderstorm' },
  96: { desc: 'thunderstorm w/ hail', icon: '11d', main: 'Thunderstorm' },
  99: { desc: 'thunderstorm w/ hail', icon: '11d', main: 'Thunderstorm' },
};

const getWmo = (code) => WMO_CODES[code] ?? { desc: 'unknown', icon: '01d', main: 'Clear' };

/**
 * Fetch current + 7-day forecast from Open-Meteo and return
 * normalized OWM-shaped objects: { currentData, forecastList }
 */
export const fetchOpenMeteo = async (lat, lon, locationName = 'Your Location') => {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('current', [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'weather_code',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'precipitation',
    'cloud_cover',
    'visibility',
  ].join(','));
  url.searchParams.set('daily', [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
  ].join(','));
  url.searchParams.set('forecast_days', '6');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const raw = await res.json();

  const c   = raw.current;
  const wmo = getWmo(c.weather_code);

  // ── Normalize current weather → OWM shape ────────────────────────────────
  const currentData = {
    name: locationName,
    _source: 'open-meteo',       // internal flag
    coord: { lat, lon },
    weather: [{ id: c.weather_code, main: wmo.main, description: wmo.desc, icon: wmo.icon }],
    main: {
      temp:       c.temperature_2m,
      feels_like: c.apparent_temperature,
      temp_min:   raw.daily.temperature_2m_min[0],
      temp_max:   raw.daily.temperature_2m_max[0],
      pressure:   c.surface_pressure,
      humidity:   c.relative_humidity_2m,
    },
    wind: {
      speed: (c.wind_speed_10m / 3.6),  // km/h → m/s (OWM uses m/s)
      deg:   c.wind_direction_10m,
    },
    clouds: { all: c.cloud_cover },
    visibility: c.visibility,
    rain:  c.precipitation > 0 ? { '1h': c.precipitation } : undefined,
  };

  // ── Normalize 6-day daily forecast → OWM /forecast list shape ─────────────
  // OWM sends 3-hour entries; we fake one entry per day at noon
  const forecastList = raw.daily.weather_code.map((code, i) => {
    const dayWmo = getWmo(code);
    const date   = new Date(raw.daily.time?.[i] ?? Date.now() + i * 86400000);
    date.setHours(12, 0, 0, 0);

    return {
      dt:     Math.floor(date.getTime() / 1000),
      dt_txt: date.toISOString().replace('T', ' ').slice(0, 19),
      main: {
        temp:     (raw.daily.temperature_2m_max[i] + raw.daily.temperature_2m_min[i]) / 2,
        temp_max: raw.daily.temperature_2m_max[i],
        temp_min: raw.daily.temperature_2m_min[i],
        humidity: c.relative_humidity_2m,
        pressure: c.surface_pressure,
      },
      weather: [{ id: code, main: dayWmo.main, description: dayWmo.desc, icon: dayWmo.icon }],
      pop:     (raw.daily.precipitation_probability_max[i] ?? 0) / 100,
      wind:    { speed: c.wind_speed_10m / 3.6, deg: c.wind_direction_10m },
      clouds:  { all: c.cloud_cover },
    };
  });

  return { currentData, forecastList };
};
