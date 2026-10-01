/* Sketch-style globe: where Melkart I is on a given date. Needs d3 + topojson. */
window.MKGlobe = (() => {
  const SIZE = 600;
  const R = 262;
  const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';
  const NS = 'http://www.w3.org/2000/svg';

  let svg, projection, path, land, g = {}, rot = [-20, -30, 0], tween = null, current = null, dragging = false;
  const cal = window.MK_CAL;

  // Cumulative distances so the boat moves at constant speed along a route
  function along(route, t) {
    const legs = [];
    let total = 0;
    for (let i = 1; i < route.length; i++) {
      const d = d3.geoDistance(route[i - 1], route[i]);
      legs.push(d);
      total += d;
    }
    let target = t * total;
    for (let i = 0; i < legs.length; i++) {
      if (target <= legs[i] || i === legs.length - 1) {
        const f = legs[i] ? Math.min(1, target / legs[i]) : 0;
        return d3.geoInterpolate(route[i], route[i + 1])(f);
      }
      target -= legs[i];
    }
    return route[route.length - 1];
  }

  // Part of a route travelled so far, as a LineString
  function travelled(route, t) {
    const pts = [route[0]];
    const steps = 80;
    for (let i = 1; i <= steps; i++) pts.push(along(route, (t * i) / steps));
    return { type: 'LineString', coordinates: pts };
  }

  function el(name, attrs = {}, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function buildDefs() {
    const defs = el('defs', {}, svg.node());
    defs.innerHTML = `
      <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="pencil2" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="G" yChannelSelector="R"/>
      </filter>
      <filter id="paper">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2"/>
        <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.1  0 0 0 0 0.17  0 0 0 0.07 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink)" stroke-width="0.9" stroke-opacity="0.38"/>
      </pattern>
      <radialGradient id="sea" cx="38%" cy="32%" r="75%">
        <stop offset="0" stop-color="#fbf8f2"/>
        <stop offset="0.7" stop-color="#eee8dc"/>
        <stop offset="1" stop-color="#ddd3c1"/>
      </radialGradient>`;
  }

  function boatShape(parent) {
    // Top view of a catamaran, drawn by hand-ish strokes
    const b = el('g', { class: 'g-boat__hull' }, parent);
    el('path', { d: 'M-11 -6 C-4 -8 7 -7 13 -4.5 L13 -3 C7 -2.5 -4 -2.5 -11 -3 Z', class: 'hull' }, b);
    el('path', { d: 'M-11 6 C-4 8 7 7 13 4.5 L13 3 C7 2.5 -4 2.5 -11 3 Z', class: 'hull' }, b);
    el('path', { d: 'M-8 -3 H6 L9 0 L6 3 H-8 Z', class: 'deck' }, b);
    el('path', { d: 'M1 -8 L1 8', class: 'mast' }, b);
    return b;
  }

  function init(container) {
    svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
      .attr('class', 'globe__svg');
    buildDefs();

    projection = d3.geoOrthographic().scale(R).translate([SIZE / 2, SIZE / 2]).clipAngle(90).precision(0.6).rotate(rot);
    path = d3.geoPath(projection);

    const root = svg.append('g');
    // Sketchy outer halo
    root.append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', R + 16).attr('class', 'g-halo');
    g.sea = root.append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', R).attr('fill', 'url(#sea)');
    root.append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', R).attr('filter', 'url(#paper)').attr('fill', '#fff');
    g.grat = root.append('path').attr('class', 'g-grat');
    g.landFill = root.append('path').attr('class', 'g-land-fill');
    g.land2 = root.append('path').attr('class', 'g-land g-land--ghost').attr('filter', 'url(#pencil2)');
    g.land = root.append('path').attr('class', 'g-land').attr('filter', 'url(#pencil)');
    g.loopW = root.append('path').attr('class', 'g-loop');
    g.loopE = root.append('path').attr('class', 'g-loop');
    g.trail = root.append('path').attr('class', 'g-trail');
    g.places = root.append('g');
    g.rim = root.append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', R).attr('class', 'g-rim').attr('filter', 'url(#pencil)');
    root.append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', R + 3).attr('class', 'g-rim g-rim--ghost').attr('filter', 'url(#pencil2)');

    // Places
    g.place = {};
    for (const k of ['portocolom', 'nassau']) {
      const p = cal.PLACES[k];
      const grp = g.places.append('g').attr('class', 'g-place');
      grp.append('circle').attr('r', 3.6);
      grp.append('text').attr('class', 'g-label').attr('dy', k === 'nassau' ? 22 : -10).attr('text-anchor', 'middle').text(p.name.en.split(',')[0]);
      g.place[k] = grp;
    }

    // Boat
    g.boat = root.append('g').attr('class', 'g-boat');
    g.boat.append('circle').attr('class', 'g-boat__pulse').attr('r', 14);
    g.boat.append('path').attr('class', 'g-boat__wake').attr('d', 'M-14 -4 Q-26 -8 -40 -14 M-14 4 Q-26 8 -40 14');
    const hull = el('g', { class: 'g-boat__rot' }, g.boat.node());
    boatShape(hull);
    g.boatRot = d3.select(hull);

    // Drag to spin
    svg.call(d3.drag()
      .on('start', () => { dragging = true; if (tween) tween.stop(); container.classList.add('is-drag'); })
      .on('drag', (e) => {
        const k = 0.28;
        rot = [rot[0] + e.dx * k, Math.max(-75, Math.min(75, rot[1] - e.dy * k)), 0];
        draw();
      })
      .on('end', () => { dragging = false; container.classList.remove('is-drag'); }));

    draw();
    return d3.json(LAND_URL).then((topo) => {
      land = topojson.feature(topo, topo.objects.land);
      draw();
    }).catch(() => { container.classList.add('is-offline'); });
  }

  function visible(pt) {
    return d3.geoDistance(pt, [-rot[0], -rot[1]]) < Math.PI / 2 - 0.02;
  }

  function draw() {
    projection.rotate(rot);
    g.grat.attr('d', path(d3.geoGraticule10()));
    if (land) {
      const d = path(land);
      g.landFill.attr('d', d);
      g.land.attr('d', d);
      g.land2.attr('d', d);
    }
    g.loopW.attr('d', path({ type: 'LineString', coordinates: cal.ROUTE_WEST }));
    g.loopE.attr('d', path({ type: 'LineString', coordinates: cal.ROUTE_EAST }));

    for (const k in g.place) {
      const p = cal.PLACES[k];
      const xy = projection([p.lon, p.lat]);
      g.place[k].attr('transform', `translate(${xy[0]},${xy[1]})`).style('opacity', visible([p.lon, p.lat]) ? 1 : 0);
    }

    if (!current) return;
    let pt, ahead;
    if (current.crossing) {
      pt = along(current.route, current.progress);
      ahead = along(current.route, Math.min(1, current.progress + 0.01));
      g.trail.attr('d', path(travelled(current.route, current.progress))).style('opacity', 1);
    } else {
      pt = [current.lon, current.lat];
      ahead = null;
      g.trail.style('opacity', 0);
    }
    const xy = projection(pt);
    g.boat.attr('transform', `translate(${xy[0]},${xy[1]})`).style('opacity', visible(pt) ? 1 : 0)
      .classed('is-sailing', !!current.crossing);
    let angle = -20;
    if (ahead) {
      const a = projection(ahead);
      if (a) angle = (Math.atan2(a[1] - xy[1], a[0] - xy[0]) * 180) / Math.PI;
    }
    g.boatRot.attr('transform', `rotate(${angle})`);
  }

  // Rotation that centres a point, slightly tilted so the north reads as "up"
  function targetFor(pt) {
    return [-pt[0], -pt[1] * 0.7 - 6, 0];
  }

  function shortest(from, to) {
    let d = to[0] - from[0];
    d = ((d + 540) % 360) - 180;
    return [from[0] + d, to[1], 0];
  }

  // loc comes from MK_CAL.locate(date)
  function show(loc, { duration = 1600 } = {}) {
    const prev = current;
    current = loc;
    const pt = loc.crossing ? along(loc.route, loc.progress) : [loc.lon, loc.lat];
    const target = shortest(rot, targetFor(pt));
    if (tween) tween.stop();
    if (!duration || dragging) { rot = target; draw(); return; }

    // Boat glides along the route when moving within the same crossing
    const sameRoute = prev && prev.crossing && loc.crossing && prev.route === loc.route;
    const p0 = sameRoute ? prev.progress : loc.progress;
    const r0 = rot.slice();
    const ir = d3.interpolate(r0, target);
    const ease = d3.easeCubicInOut;
    tween = d3.timer((el) => {
      const t = Math.min(1, el / duration);
      const e = ease(t);
      rot = ir(e);
      if (sameRoute) current = { ...loc, progress: p0 + (loc.progress - p0) * e };
      draw();
      if (t === 1) { tween.stop(); current = loc; draw(); }
    });
  }

  // Smooth follow, for scrubbing and "play the year"
  let follow = null, followRaf = 0;
  function track(loc) {
    if (tween) tween.stop();
    current = loc;
    const pt = loc.crossing ? along(loc.route, loc.progress) : [loc.lon, loc.lat];
    follow = shortest(rot, targetFor(pt));
    if (!followRaf) followRaf = requestAnimationFrame(step);
  }
  function step() {
    followRaf = 0;
    if (!follow || dragging) return;
    const dx = follow[0] - rot[0], dy = follow[1] - rot[1];
    rot = [rot[0] + dx * 0.09, rot[1] + dy * 0.09, 0];
    draw();
    if (Math.abs(dx) + Math.abs(dy) > 0.05) followRaf = requestAnimationFrame(step);
  }

  function relabel(lang) {
    for (const k in g.place) g.place[k].select('text').text(cal.PLACES[k].name[lang].split(',')[0]);
  }

  return { init, show, track, relabel };
})();
