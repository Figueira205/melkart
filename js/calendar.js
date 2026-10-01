/* Melkart I yearly calendar: the one place to edit dates, seasons and prices.
   Months are 1-12. Ranges are inclusive and repeat every year. */
window.MK_CAL = (() => {
  const PLACES = {
    portocolom: { lon: 3.263, lat: 39.417, name: { en: 'Portocolom, Mallorca', es: 'Portocolom, Mallorca' }, sea: { en: 'Mediterranean', es: 'Mediterráneo' } },
    nassau: { lon: -77.339, lat: 25.06, name: { en: 'Nassau, Bahamas', es: 'Nassau, Bahamas' }, sea: { en: 'Bahamas · Exumas', es: 'Bahamas · Exumas' } },
  };

  // Ocean routes, as [lon, lat] waypoints.
  const ROUTE_WEST = [ // October: Mallorca to Nassau via Gibraltar and the Canaries (trade-wind route)
    [3.263, 39.417], [1.2, 38.3], [-2.4, 36.4], [-5.6, 35.95], [-9.5, 33.5], [-15.4, 28.1],
    [-24, 22.5], [-36, 19.5], [-50, 19.8], [-62, 21.8], [-71, 23.6], [-77.339, 25.06],
  ];
  const ROUTE_EAST = [ // May: Nassau to Mallorca via Bermuda and the Azores
    [-77.339, 25.06], [-72, 28.5], [-64.8, 32.3], [-52, 35.5], [-38, 38], [-28.6, 38.5],
    [-18, 37.2], [-9.8, 36.4], [-5.6, 35.95], [-2, 36.6], [1.4, 38.6], [3.263, 39.417],
  ];

  // Each entry: from [m, d] to [m, d], base, season, weekly price.
  const SEASONS = [
    { id: 'bah-high', from: [1, 1], to: [4, 30], base: 'nassau', season: 'high', price: 12400 },
    { id: 'cross-east', from: [5, 1], to: [5, 20], base: null, season: 'cross', route: 'east' },
    { id: 'med-low', from: [5, 21], to: [5, 31], base: 'portocolom', season: 'low', price: 8800, onRequest: true },
    { id: 'med-mid', from: [6, 1], to: [6, 19], base: 'portocolom', season: 'mid', price: 11200 },
    { id: 'med-high', from: [6, 20], to: [8, 31], base: 'portocolom', season: 'high', price: 12400 },
    { id: 'med-mid', from: [9, 1], to: [9, 30], base: 'portocolom', season: 'mid', price: 11200 },
    { id: 'cross-west', from: [10, 1], to: [10, 31], base: null, season: 'cross', route: 'west' },
    { id: 'bah-mid', from: [11, 1], to: [12, 19], base: 'nassau', season: 'mid', price: 11200 },
    { id: 'bah-high', from: [12, 20], to: [12, 31], base: 'nassau', season: 'high', price: 12400 },
  ];

  const DAY_PRICE = 2500;

  const key = (m, d) => m * 100 + d;
  const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  function seasonFor(date) {
    const k = key(date.getMonth() + 1, date.getDate());
    return SEASONS.find((s) => k >= key(...s.from) && k <= key(...s.to));
  }

  // 0..1 progress through a season's date range
  function progress(s, date) {
    const y = date.getFullYear();
    const a = new Date(y, s.from[0] - 1, s.from[1]);
    const b = new Date(y, s.to[0] - 1, s.to[1], 23, 59);
    return Math.min(1, Math.max(0, (startOfDay(date) - a) / (b - a)));
  }

  // Where the boat is on a date: { lon, lat, season, crossing, progress, route }
  function locate(date) {
    const s = seasonFor(date);
    if (s.base) return { ...PLACES[s.base], key: s.base, s };
    const route = s.route === 'west' ? ROUTE_WEST : ROUTE_EAST;
    return { s, route, progress: progress(s, date), crossing: true };
  }

  return { PLACES, ROUTE_WEST, ROUTE_EAST, SEASONS, DAY_PRICE, seasonFor, locate, progress };
})();
