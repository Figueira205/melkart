/* Melkart Náutica · interactions */
(() => {
  const CONFIG = {
    whatsapp: '34606366895',            // international format, digits only
    whatsappLabel: '+34 606 36 68 95',
    email: 'info@melkartnautica.com',
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const I18N = window.MK_I18N;
  const CAL = window.MK_CAL;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!window.gsap;
  document.documentElement.classList.add('js');

  /* ---------- helpers ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const eur = (n) => `${n.toLocaleString(I18N.t().num)} €`;
  const fmtDate = (d) => d.toLocaleDateString(I18N.t().locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const today = new Date();
  let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function placeLabel(loc) {
    const t = I18N.t();
    if (loc.crossing) return t.crossing[loc.s.route];
    return loc.name[I18N.lang];
  }

  /* ---------- contact links ---------- */
  function setContacts() {
    const wa = `https://wa.me/${CONFIG.whatsapp}`;
    const mail = `mailto:${CONFIG.email}`;
    $('#c-wa').href = wa; $('#f-wa').href = wa;
    $('#c-mail').href = mail; $('#f-mail').href = mail;
    $('#c-wa-label').textContent = `WhatsApp · ${CONFIG.whatsappLabel}`;
    $('#c-mail-label').textContent = CONFIG.email;
    $('#f-mail').textContent = CONFIG.email;
    $('#f-wa').textContent = `WhatsApp · ${CONFIG.whatsappLabel}`;
    $('#year-now').textContent = today.getFullYear();
  }

  /* ---------- word splitting for headline reveals ---------- */
  function split(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
    return $$('.w > span', el);
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToEl(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const el = $(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (a.dataset.plan) $('#b-plan').value = a.dataset.plan, updateQuote();
    scrollToEl(el);
  });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const menuOpen = $('.nav__burger').getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  const burger = $('.nav__burger');
  const mobile = $('#mobile-menu');
  function closeMenu() { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true; }
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    mobile.hidden = !open;
  });

  // Active section in nav
  const navLinks = $$('.nav__links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['yacht', 'plans', 'where', 'rates', 'faq'].forEach((id) => $(`#${id}`) && io.observe($(`#${id}`)));

  /* ---------- language ---------- */
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => I18N.apply(b.dataset.lang)));
  I18N.onChange((lang) => {
    split($('.hero__title'));
    $$('.hero__title .w > span').forEach((s) => (s.style.transform = 'none'));
    if (window.MKGlobe) MKGlobe.relabel(lang);
    renderStatus(CAL.locate(selected));
    renderFinder();
    buildMonths();
    updateQuote();
    $('#globe-play span').textContent = playing ? I18N.t().stopYear : I18N.t().playYear;
  });

  /* ---------- globe & calendar ---------- */
  const globeDate = $('#globe-date');
  const statusEl = $('#globe-status');
  const yearRange = $('#year-range');

  function renderStatus(loc) {
    const t = I18N.t();
    $('#st-date').textContent = fmtDate(selected);
    $('#st-place').textContent = placeLabel(loc);
    statusEl.classList.toggle('is-cross', !!loc.crossing);
    if (loc.crossing) {
      const s = loc.s;
      const total = (new Date(selected.getFullYear(), s.to[0] - 1, s.to[1]) - new Date(selected.getFullYear(), s.from[0] - 1, s.from[1])) / 864e5 + 1;
      const n = Math.round((selected - new Date(selected.getFullYear(), s.from[0] - 1, s.from[1])) / 864e5) + 1;
      $('#st-season').textContent = `${t.notAvail} · ${t.dayOf(n, Math.round(total))}`;
      $('#st-price').innerHTML = '';
      $('#st-cta').hidden = true;
    } else {
      $('#st-season').textContent = loc.s.onRequest ? t.onRequest : `${t.season[loc.s.season]} · ${loc.sea[I18N.lang]}`;
      $('#st-price').innerHTML = t.weekPrice(eur(loc.s.price));
      $('#st-cta').hidden = false;
    }
  }

  function dayOfYear(d) {
    return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 1)) / 864e5);
  }

  function setDate(d, { from = '', smooth = false } = {}) {
    selected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const loc = CAL.locate(selected);
    if (from !== 'input') globeDate.value = toISO(selected);
    if (from !== 'range') yearRange.value = Math.min(364, dayOfYear(selected));
    renderStatus(loc);
    if (window.MKGlobe && globeReady) smooth ? MKGlobe.track(loc) : MKGlobe.show(loc);
    return loc;
  }

  let globeReady = false;
  function initGlobe() {
    if (!window.d3 || !window.topojson) { $('#globe').classList.add('is-offline'); return; }
    MKGlobe.init($('#globe'));
    globeReady = true;
    MKGlobe.relabel(I18N.lang);
    MKGlobe.show(CAL.locate(selected), { duration: 0 });
  }

  globeDate.addEventListener('change', () => { if (globeDate.value) { stopPlay(); setDate(fromISO(globeDate.value), { from: 'input' }); } });
  yearRange.addEventListener('input', () => {
    stopPlay();
    const d = new Date(selected.getFullYear(), 0, 1 + Number(yearRange.value));
    setDate(d, { from: 'range', smooth: true });
  });

  // Year ribbon
  function buildYear() {
    const bar = $('#year-bar');
    const days = (m, d) => dayOfYear(new Date(2026, m - 1, d));
    bar.innerHTML = CAL.SEASONS.map((s) => {
      const w = days(...s.to) - days(...s.from) + 1;
      return `<div class="year__seg is-${s.season}" data-id="${s.id}" style="flex:${w}"></div>`;
    }).join('');
  }
  function buildMonths() {
    $('#year-months').innerHTML = I18N.t().months.map((m) => `<span>${m}</span>`).join('');
  }
  $$('.rate-card li[data-season]').forEach((li) => {
    const on = () => { $('#year').classList.add('is-hl'); $$(`.year__seg[data-id="${li.dataset.season}"]`).forEach((s) => s.classList.add('is-on')); };
    const off = () => { $('#year').classList.remove('is-hl'); $$('.year__seg.is-on').forEach((s) => s.classList.remove('is-on')); };
    li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
    li.addEventListener('click', () => {
      const s = CAL.SEASONS.find((x) => x.id === li.dataset.season);
      const y = selected.getFullYear();
      setDate(new Date(y, s.from[0] - 1, s.from[1] + 3));
      scrollToEl('#where');
    });
  });

  // Play the year
  let playing = false, playTimer = 0;
  const playBtn = $('#globe-play');
  function stopPlay() {
    if (!playing) return;
    playing = false; clearInterval(playTimer);
    playBtn.classList.remove('is-playing');
    $('span', playBtn).textContent = I18N.t().playYear;
  }
  playBtn.addEventListener('click', () => {
    if (playing) return stopPlay();
    playing = true;
    playBtn.classList.add('is-playing');
    $('span', playBtn).textContent = I18N.t().stopYear;
    let d = new Date(selected);
    let steps = 0;
    playTimer = setInterval(() => {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2);
      setDate(d, { smooth: true });
      if (++steps >= 183) stopPlay();
    }, 55);
  });

  /* ---------- hero finder ---------- */
  const finder = $('#finder');
  const finderDate = $('#finder-date');
  finderDate.min = toISO(today);
  function renderFinder() {
    const out = $('#finder-where');
    if (!finderDate.value) { out.textContent = '—'; return; }
    const loc = CAL.locate(fromISO(finderDate.value));
    out.textContent = loc.crossing ? `${I18N.t().season.cross} · ${I18N.t().notAvail.toLowerCase()}` : loc.name[I18N.lang];
    out.classList.toggle('is-cross', !!loc.crossing);
  }
  finderDate.addEventListener('change', renderFinder);
  finder.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = finderDate.value ? fromISO(finderDate.value) : selected;
    $('#b-date').value = toISO(d);
    $('#b-plan').value = finder.plan.value;
    $('#b-guests').value = finder.guests.value;
    updateQuote();
    setDate(d);
    scrollToEl('#where');
  });

  /* ---------- booking form ---------- */
  const form = $('#book-form');
  const bDate = $('#b-date');
  bDate.min = toISO(today);
  function quote() {
    const t = I18N.t();
    if (!bDate.value) return { text: '—', loc: null };
    const loc = CAL.locate(fromISO(bDate.value));
    if (loc.crossing) return { text: t.quoteNA, loc };
    if ($('#b-plan').value === 'day') return { text: t.quoteDay, loc };
    return { text: t.quoteWeek(eur(loc.s.price)), loc };
  }
  function updateQuote() {
    const q = quote();
    $('#b-quote').textContent = q.text;
    const warn = $('#b-warn');
    warn.hidden = !(q.loc && q.loc.crossing);
    warn.textContent = I18N.t().warnCross;
  }
  ['change', 'input'].forEach((ev) => form.addEventListener(ev, updateQuote));

  function validate() {
    let ok = true;
    const check = (id, valid) => { const f = $(id).closest('.field'); f.classList.toggle('is-invalid', !valid); if (!valid && ok) $(id).focus(); ok = ok && valid; };
    check('#b-name', $('#b-name').value.trim().length > 1);
    check('#b-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#b-email').value.trim()));
    check('#b-date', !!bDate.value);
    return ok;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const q = quote();
    if (q.loc && q.loc.crossing) { $('#b-warn').hidden = false; return; }
    const t = I18N.t();
    const planSel = $('#b-plan');
    const data = {
      name: $('#b-name').value.trim(), email: $('#b-email').value.trim(),
      date: fmtDate(fromISO(bDate.value)), plan: planSel.options[planSel.selectedIndex].text.toLowerCase(),
      guests: $('#b-guests').value, base: q.loc ? q.loc.name[I18N.lang] : '', quote: q.text, msg: $('#b-msg').value.trim(),
    };
    const text = t.msg(data);
    const via = e.submitter && e.submitter.dataset.via;
    if (via === 'mail') location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(text)}`;
    else window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  $$('.field input').forEach((i) => i.addEventListener('input', () => i.closest('.field').classList.remove('is-invalid')));

  /* ---------- arc gallery ---------- */
  function initArc() {
    const stage = $('#arc');
    const cards = $$('.arc__card', stage);
    let offset = 0, vel = 0, drag = false, lastX = 0, hover = false;
    const gap = () => cards[0].offsetWidth + 22;
    const total = () => gap() * cards.length;
    stage.addEventListener('pointerdown', (e) => { drag = true; lastX = e.clientX; stage.classList.add('is-drag'); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - lastX; lastX = e.clientX; offset += dx; vel = dx; });
    const end = () => { drag = false; stage.classList.remove('is-drag'); };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    stage.addEventListener('mouseenter', () => (hover = true));
    stage.addEventListener('mouseleave', () => (hover = false));
    let visible = false;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) requestAnimationFrame(tick); }).observe(stage);
    function tick() {
      if (!drag) { vel *= 0.94; offset += vel + (hover || reduce ? 0 : -0.45); }
      const W = stage.offsetWidth, T = total(), G = gap();
      cards.forEach((c, i) => {
        let x = ((i * G + offset) % T + T) % T;
        if (x > T / 2) x -= T;
        const n = x / (W / 2);                     // -1 .. 1 across the stage
        const y = n * n * 70;                      // bowl curve
        const r = n * 9;
        const s = 1 - Math.min(0.12, Math.abs(n) * 0.08);
        c.style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${r}deg) scale(${s})`;
        c.style.zIndex = String(100 - Math.round(Math.abs(n) * 50));
      });
      if (visible) requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- tabs ---------- */
  function initTabs() {
    const tabs = $$('#spec-tabs [role="tab"]');
    const select = (tab) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $(`#${t.getAttribute('aria-controls')}`).hidden = !on; });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const next = tabs[(i + d + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
  }

  /* ---------- layout hotspots ---------- */
  function initPlan() {
    const items = $$('#lay-list li');
    const spots = $$('#plan-map .spot');
    const set = (id) => { items.forEach((x) => x.classList.toggle('is-on', x.dataset.spot === id)); spots.forEach((x) => x.classList.toggle('is-on', x.dataset.spot === id)); };
    [...items, ...spots].forEach((el) => {
      el.addEventListener('mouseenter', () => set(el.dataset.spot));
      el.addEventListener('mouseleave', () => set(null));
      el.addEventListener('click', () => set(el.dataset.spot));
    });
  }

  /* ---------- life rail ---------- */
  function initRail() {
    const rail = $('#life-rail');
    const by = () => rail.querySelector('.card').offsetWidth + 22;
    $('#life-prev').addEventListener('click', () => rail.scrollBy({ left: -by(), behavior: 'smooth' }));
    $('#life-next').addEventListener('click', () => rail.scrollBy({ left: by(), behavior: 'smooth' }));
  }

  /* ---------- spec drawing ---------- */
  async function initSpec() {
    const draw = $('.spec__draw');
    try {
      const svgText = await (await fetch('assets/img/trace.svg')).text();
      const box = $('#spec-trace');
      box.innerHTML = svgText.replace(/<\?xml[^>]*>/, '');
      const svg = $('svg', box);
      svg.setAttribute('viewBox', '0 0 340 470');
      svg.setAttribute('aria-hidden', 'true');
      const shapes = $$('path, line, polyline, polygon', svg);
      shapes.forEach((s) => {
        const cls = s.getAttribute('class') || '';
        if (/st[2-5]/.test(cls)) {
          s.classList.add('ln');
        } else s.classList.add('fl');
      });
    } catch (e) { /* drawing is decorative */ }
    new IntersectionObserver(([en], obs) => {
      if (!en.isIntersecting) return;
      draw.classList.add('is-in');
      $$('[data-count]', draw).forEach((b) => {
        const end = Number(b.dataset.count), dec = Number(b.dataset.dec || 0);
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / 1800);
          b.textContent = (end * (1 - Math.pow(1 - p, 4))).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
        };
        reduce ? (b.textContent = end.toFixed(dec)) : requestAnimationFrame(step);
      });
      obs.disconnect();
    }, { threshold: 0.4 }).observe(draw);
  }

  /* ---------- video toggle ---------- */
  const video = $('.moments__video');
  const vbtn = $('.moments__toggle');
  let userPaused = false;
  vbtn.addEventListener('click', () => {
    userPaused = !video.paused;
    video.paused ? video.play() : video.pause();
    vbtn.classList.toggle('is-paused', video.paused);
    vbtn.setAttribute('aria-label', video.paused ? I18N.t().play : I18N.t().pause);
  });

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    $$('.magnetic, .finder .btn, .comfort__center .btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
  }

  /* ---------- scroll choreography (GSAP) ---------- */
  function initMotion() {
    if (!hasGSAP || !window.ScrollTrigger || reduce) {
      $$('.reveal').forEach((r) => r.classList.remove('reveal'));
      $('.moments__frame').style.cssText = 'width:100%;height:70vh';
      $('.moments').style.height = 'auto';
      video.play().catch(() => {});
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const words = split($('.hero__title'));
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero__media img', { scale: 1.18, duration: 2.4 }, 0)
      .from('.hero__kicker', { y: 16, opacity: 0, duration: 1.1 }, 0.25)
      .from(words, { yPercent: 110, duration: 1.3, stagger: 0.06 }, 0.3)
      .from('.hero__sub', { y: 18, opacity: 0, duration: 1.1 }, 0.7)
      .from('.finder', { y: 40, opacity: 0, duration: 1.3 }, 0.8)
      .from('.nav__bar', { y: -30, opacity: 0, duration: 1.2 }, 0.4);

    gsap.to('.hero__media img', { yPercent: 12, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true } });

    // Section headings and copy rise in
    $$('.section .h2, .section .lead, .section .kicker, .about__facts, .why__col, .rate-card, .faq details, .book__form, .life .card').forEach((el) => {
      gsap.from(el, { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    // About parallax
    $$('[data-parallax]').forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.parallax) * 100, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.about__img--main', { clipPath: 'inset(18% 18% 18% 18% round 22px)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.about__media', start: 'top 80%' } });

    // Plans: each panel's image settles, the previous one recedes
    const plans = $$('.plan');
    plans.forEach((p, i) => {
      gsap.to($('.plan__media img', p), { scale: 1, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'top top', scrub: true } });
      if (i < plans.length - 1) {
        gsap.to(p, { scale: 0.92, '--dim': 0.45, borderRadius: 24, ease: 'none', transformOrigin: '50% 0%',
          scrollTrigger: { trigger: plans[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
      }
    });

    // Ocean Moments: words part, frame grows to full screen
    const frame = $('.moments__frame');
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.moments', start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: (st) => {
        const open = st.progress > 0.08 && st.progress < 0.995;
        $('.moments').classList.toggle('is-open', st.progress > 0.55);
        if (open && video.paused && !userPaused) video.play().catch(() => {});
        if (!open && !video.paused) video.pause();
      } } });
    tl.to(frame, { width: '24vw', duration: 0.25, ease: 'power2.out' })
      .to('.moments__word--l', { x: '-12vw', duration: 0.25, ease: 'power2.out' }, 0)
      .to('.moments__word--r', { x: '12vw', duration: 0.25, ease: 'power2.out' }, 0)
      .to(frame, { width: '100vw', height: '100svh', borderRadius: 0, duration: 0.55, ease: 'power2.inOut' })
      .to('.moments__word--l', { x: '-62vw', opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .to('.moments__word--r', { x: '62vw', opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .to({}, { duration: 0.2 });

    // Comfort collage parallax
    $$('.cimg').forEach((c) => {
      gsap.fromTo(c, { y: () => Number(c.dataset.speed) * 260 }, { y: () => Number(c.dataset.speed) * -260, ease: 'none',
        scrollTrigger: { trigger: '.comfort', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
      gsap.from(c, { opacity: 0, filter: 'blur(12px)', scale: 0.92, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 95%' } });
    });

    // Reserve background drift
    gsap.to('.reserve__bg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.reserve', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.reserve__inner > *', { y: 30, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.reserve', start: 'top 65%' } });

    // Globe rises in once
    gsap.from('.globe', { scale: 0.86, rotate: -8, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.where', start: 'top 70%' } });

    // Footer mark slides up
    gsap.from('.footer__mark img', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- boot ---------- */
  setContacts();
  buildYear();
  I18N.apply(I18N.initial());
  finderDate.value = toISO(selected);
  bDate.value = toISO(selected);
  renderFinder();
  updateQuote();
  initGlobe();
  setDate(selected);
  initArc();
  initTabs();
  initPlan();
  initRail();
  initSpec();
  initMotion();
})();
