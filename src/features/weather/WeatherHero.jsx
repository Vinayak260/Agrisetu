import React from 'react';
import { MapPin, RefreshCw, Navigation, Loader2, Satellite } from 'lucide-react';

const WeatherHero = ({
  data,
  currentLang,
  setLang,
  onRefresh,
  onUseCurrentLocation,
  isFetching = false,
  gpsCoords = null,
  gpsLocation = null,
  gpsLocating = false,
}) => {

  const temp = data?.main?.temp ? Math.round(data.main.temp) : null;
  const desc = data?.weather?.[0]?.description || '';
  const cityName = data?.name || '';

  // Weather condition → gradient map
  const weatherGradient = (() => {
    const main = data?.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('rain') || main.includes('drizzle')) return 'from-slate-700 to-blue-800';
    if (main.includes('thunder'))  return 'from-slate-900 to-purple-900';
    if (main.includes('snow'))     return 'from-blue-200 to-slate-300';
    if (main.includes('cloud'))    return 'from-slate-500 to-blue-700';
    if (main.includes('mist') || main.includes('fog')) return 'from-slate-400 to-gray-600';
    if (temp !== null && temp > 35) return 'from-orange-500 to-rose-600';
    return 'from-[#6366f1] to-[#a855f7]'; // default clear sky
  })();

  return (
    <div className={`bg-gradient-to-br ${weatherGradient} rounded-[2.5rem] m-4 md:m-6 text-white shadow-2xl relative overflow-hidden transition-all duration-700`}>

      {/* Decorative blobs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8 space-y-5">

        {/* ── Row 1: Location + Temperature ── */}
        <div className="flex justify-between items-start gap-4">

          {/* Location block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md border border-white/20 flex-shrink-0">
                <MapPin size={14} />
              </div>
              <h2 className="text-lg font-black tracking-tight truncate">
                {cityName || (isFetching ? 'Locating...' : 'Your Location')}
              </h2>
            </div>

            {/* Detailed GPS address from Nominatim */}
            {gpsLocating ? (
              <div className="flex items-center gap-1.5 pl-8 text-[10px] text-white/60 font-bold">
                <Loader2 size={10} className="animate-spin" />
                Resolving exact address...
              </div>
            ) : gpsLocation ? (
              <div className="pl-8 space-y-0.5">
                {gpsLocation.village && (
                  <p className="text-[11px] font-black text-white/90">
                    {gpsLocation.village}
                  </p>
                )}
                <p className="text-[10px] font-bold text-white/70 truncate">
                  {[gpsLocation.district, gpsLocation.state].filter(Boolean).join(', ')}
                </p>
                {gpsLocation.postcode && (
                  <p className="text-[9px] font-bold text-white/50">
                    PIN: {gpsLocation.postcode}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* Temperature block */}
          <div className="text-right flex-shrink-0">
            {isFetching ? (
              <div className="flex items-center justify-end gap-2">
                <Loader2 size={20} className="animate-spin opacity-70" />
                <span className="text-3xl font-black opacity-60">--°C</span>
              </div>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-black leading-none">
                  {temp !== null ? `${temp}°C` : '--°C'}
                </h1>
                <p className="text-[10px] font-bold opacity-75 uppercase tracking-widest mt-1 capitalize">
                  {desc || 'Awaiting data'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Row 2: GPS coordinates chip ── */}
        {gpsCoords && (
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2 w-fit">
            <Satellite size={12} className="text-emerald-300 flex-shrink-0" />
            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">
              GPS Live
            </span>
            <span className="text-[9px] font-bold text-white/60">
              {gpsCoords.lat.toFixed(5)}°N, {gpsCoords.lon.toFixed(5)}°E
            </span>
            <span className="text-[8px] font-bold text-white/40">
              ±{gpsCoords.accuracy}m
            </span>
          </div>
        )}

        {/* ── Row 3: Action buttons ── */}
        <div className="flex justify-between items-center pt-1">
          <button
            onClick={onUseCurrentLocation}
            disabled={isFetching}
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/35
              px-4 py-2 rounded-full border border-emerald-400/30
              text-[10px] font-black uppercase tracking-widest
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Navigation size={10} className="fill-emerald-400 text-emerald-400" />
            )}
            {isFetching ? 'Locating...' : 'Use Current Location'}
          </button>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            {['mr', 'hi', 'en'].map(lang => (
              <button
                key={lang}
                onClick={() => setLang(lang)}
                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full transition-all
                  ${currentLang === lang
                    ? 'bg-white text-slate-800'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                {lang}
              </button>
            ))}

            <button
              onClick={onRefresh}
              disabled={isFetching}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-opacity disabled:opacity-40"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHero;
