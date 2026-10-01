/* Translations. English lives in the HTML; this file holds Spanish plus
   the strings JavaScript builds at runtime (both languages). */
window.MK_I18N = (() => {
  const ES = {
    'skip': 'Saltar al contenido',
    'nav.yacht': 'El barco', 'nav.plans': 'Chárters', 'nav.where': '¿Dónde está?', 'nav.rates': 'Tarifas', 'nav.faq': 'Preguntas',
    'cta.book': 'Reservar', 'cta.request': 'Solicitar estas fechas',
    'hero.kicker': 'Mallorca · Bahamas',
    'hero.title': 'Dos mares, un barco, todo para vosotros',
    'hero.sub': 'Melkart I es un catamarán Bali 4.6 de 2022 para diez invitados y patrón profesional. Veranos en Mallorca, inviernos en las Bahamas.',
    'finder.date': 'Fecha', 'finder.plan': 'Chárter', 'finder.guests': 'Invitados', 'finder.where': 'Estará en', 'finder.go': 'Ver fechas',
    'plan.week': 'Chárter semanal', 'plan.day': 'Chárter de día',
    'about.kicker': 'Quiénes somos',
    'about.h1': 'Un barco nuevo y un precio cerrado,', 'about.h2': 'sin sorpresas en el muelle.',
    'about.p': 'Melkart Náutica nació en 2022 alrededor de un solo barco. Operamos Melkart I como chárter privado con patrón: el capitán, el combustible, la limpieza y las tasas del puerto base van incluidos en el precio de día, así que tú eliges las calas, no los extras.',
    'about.f1': 'Construido', 'about.f2': 'Invitados', 'about.f3': 'Certificado', 'about.f3v': 'CE A · Oceánica',
    'about.link': 'Conoce Melkart I', 'about.cap': 'Esa es ella: Melkart I',
    'why.kicker': 'Por qué Melkart I', 'why.h': 'Todo a bordo, un precio cerrado',
    'why.1h': 'Patrón incluido', 'why.1p': 'Un capitán profesional en cada chárter. En los chárters de día también van incluidos el combustible, la limpieza y las tasas del puerto base.',
    'why.2h': 'Vida en Open Space', 'why.2p': 'La puerta de cristal de popa se eleva y une salón, cocina y bañera en una sola cubierta, con zona lounge a proa y flybridge arriba.',
    'why.3h': 'Garaje de juguetes completo', 'why.3p': 'Auxiliar de 3,8 m con 20 CV, dos tablas de paddle surf, equipos de snorkel y una piscina marina antimedusas para bañarse seguros en el fondeo.',
    'plan1.tag': 'Un día · 8 horas', 'plan1.h': 'Chárter de día',
    'plan1.p': 'Paradas para nadar, comida fondeados y los juguetes en el agua, de vuelta al atardecer. Todo incluido, nada que calcular.',
    'plan1.loc': 'Portocolom (may–sep) · Nassau (nov–abr)', 'plan1.cap': 'Hasta 10 invitados + patrón', 'plan1.unit': '/ día, todo incluido',
    'plan2.tag': '7 noches · junio a septiembre', 'plan2.h': 'Semana en Mallorca',
    'plan2.p': 'Desde el puerto natural de Portocolom, a minutos de las calas del sureste: Cala Mondragó, Es Trenc, Cabrera.',
    'plan2.loc': 'Portocolom, Mallorca', 'plan2.cap': '10 invitados · 5 camarotes',
    'plan3.tag': '7 noches · noviembre a abril', 'plan3.h': 'Semana en Bahamas',
    'plan3.p': 'Con base en Nassau para la temporada alta norteamericana, con los cayos y bancos de arena de las Exumas a una navegación.',
    'plan3.loc': 'Nassau · Exumas, Bahamas',
    'row.location': 'Ubicación', 'row.capacity': 'Capacidad', 'row.price': 'Precio', 'unit.week': '/ semana',
    'arc.kicker': 'Dentro de Melkart I', 'arc.h': 'Fotos reales del barco real, del timón a la última almohada', 'arc.hint': 'arrástrame',
    'g.fly': 'Flybridge', 'g.cabin': 'Camarote doble', 'g.fore': 'Lounge de proa', 'g.salon': 'Salón', 'g.helm': 'Puesto de mando',
    'g.galley': 'Cocina', 'g.cockpit': 'Bañera', 'g.twin': 'Camarote twin', 'g.side': 'Pasillo lateral', 'g.bath': 'Baño en suite',
    'mom.1': 'Momentos', 'mom.2': 'en el mar',
    'where.kicker': '¿Dónde está Melkart I?', 'where.h': 'Elige una fecha y te mostramos en qué mar está.',
    'where.p': 'Sigue al buen tiempo: el Mediterráneo en verano y el Caribe en invierno. Dos veces al año cruza el Atlántico y no se puede alquilar.',
    'where.date': 'Tu fecha', 'where.play': 'Ver el año', 'where.drag': 'arrastra para girar el mundo',
    'season.high': 'Temporada alta', 'season.mid': 'Temporada media', 'season.low': 'Temporada baja', 'season.cross': 'Travesía atlántica, no disponible',
    'rates.kicker': 'Temporadas y tarifas', 'rates.h': 'Las tarifas semanales siguen la temporada de cada hemisferio',
    'rates.med': 'Mediterráneo', 'rates.medbase': 'Base: Portocolom, Mallorca',
    'rates.mh': '20 jun – 31 ago', 'rates.mm': '1 – 19 jun · septiembre', 'rates.ml': 'Mayo · según la llegada de la travesía',
    'rates.bah': 'Bahamas', 'rates.bahbase': 'Base: Nassau · Exumas',
    'rates.bh': '20 dic – 30 abr · Navidad, Fin de Año, Spring Break', 'rates.bm': '1 nov – 19 dic · Acción de Gracias',
    'rates.dayall': 'Todo el año, en cualquiera de las bases', 'rates.dayinc': 'Patrón, combustible, limpieza y tasas del puerto base incluidos. Hasta 10 invitados.',
    'rates.note': 'Tarifas semanales por barco, patrón profesional incluido. Octubre y mayo están bloqueados por las travesías atlánticas.',
    'comfort.kicker': 'Lujo. Confort. Aventura.', 'comfort.h': 'El confort de una villa, la libertad del mar', 'comfort.cta': 'Reserva tu semana',
    'c.1': 'Cuatro camarotes dobles', 'c.2': 'Nevera y congelador de 615 L', 'c.3': 'Lounge rígido de proa', 'c.4': 'Garmin con radar', 'c.5': 'Mesa para diez', 'c.6': 'Bimini sobre el flybridge',
    'spec.h': 'Bali 4.6, construido por Catana Group en Francia',
    'spec.p': 'Diseñado por Xavier Faÿ sobre el concepto Open Space de Olivier Poncin. Categoría CE A para navegación oceánica, que es como cruza el Atlántico cada año.',
    'spec.loa': 'de eslora · 47 pies', 'spec.beam': 'manga', 'spec.draft': 'calado',
    'tab.power': 'Motor y autonomía', 'tab.comfort': 'Confort', 'tab.galley': 'Cocina', 'tab.toys': 'Juguetes acuáticos', 'tab.safety': 'Seguridad',
    's.engines': 'Motores', 's.cruise': 'Velocidad de crucero', 's.fuel': 'Combustible', 's.water': 'Agua dulce', 's.gen': 'Generador', 's.wm': 'Potabilizadora',
    's.ac': 'Aire acondicionado', 's.acv': 'Todos los camarotes y el salón', 's.wifiv': 'Alta velocidad, a bordo', 's.audio': 'Sonido', 's.audiov': 'Fusion HiFi, altavoces en cubierta',
    's.shade': 'Sombra', 's.shadev': 'Bimini en flybridge, toldo de proa', 's.cabins': 'Camarotes', 's.cabinsv': '4 dobles, 1 twin, 1 tripulación', 's.heads': 'Baños', 's.headsv': '4 en suite para invitados + WC tripulación',
    's.fridge': 'Nevera y congelador', 's.dish': 'Lavavajillas', 's.oven': 'Horno y microondas', 's.ice': 'Máquina de hielo', 's.coffee': 'Café', 's.layout': 'Distribución', 's.layoutv': 'En L, abierta a la bañera',
    's.tender': 'Auxiliar', 's.sup': 'Paddle surf', 's.snork': 'Snorkel', 's.snorkv': 'Equipos completos', 's.pool': 'Piscina marina', 's.poolv': 'Flotante, antimedusas', 's.plat': 'Plataforma de baño', 's.platv': 'Hidráulica',
    's.cat': 'Certificación', 's.catv': 'CE Categoría A, oceánica', 's.raft': 'Balsa salvavidas', 's.raftv': 'Clase comercial', 's.jackets': 'Chalecos', 's.jacketsv': 'Automáticos', 's.nav': 'Navegación', 's.navv': 'Garmin con radar · VHF',
    'lay.h': 'Cinco camarotes para invitados y uno propio para la tripulación',
    'lay.p': 'El patrón duerme en un camarote de proa independiente con escotilla propia, así los cascos son vuestros. Pasa el ratón por un espacio para encontrarlo en el plano.',
    'lay.a': 'Doble de popa, babor', 'lay.b': 'Camarote twin', 'lay.c': 'Doble de proa, babor', 'lay.d': 'Doble de popa, estribor', 'lay.e': 'Doble de proa, estribor',
    'lay.f': 'Camarote de tripulación', 'lay.g': 'Salón y cocina', 'lay.h2': 'Lounge de proa',
    'lay.ensuite': 'En suite', 'lay.twin': 'Dos camas individuales', 'lay.crew': 'Proa de estribor, acceso propio', 'lay.open': 'Open Space', 'lay.rigid': 'Sofás en lugar de redes',
    'res.kicker': 'Precio cerrado, patrón incluido', 'res.h': 'Reserva tus días a bordo de Melkart I', 'res.p': 'Chárter de día desde 2.500 € todo incluido · semanas desde 8.800 €',
    'life.h': 'La vida a bordo, hora a hora',
    'l.1h': 'Café en el fogón', 'l.1p': 'Nespresso o moka, amanecer desde la bañera',
    'l.2h': 'Primer fondeo', 'l.2p': 'Plataforma hidráulica abajo, tablas de paddle al agua',
    'l.3h': 'Comida sin prisa', 'l.3p': 'Mesa para diez, puerta de cristal arriba, brisa marina',
    'l.4h': 'Navegar a la siguiente cala', 'l.4p': '7–8 nudos, el patrón al timón del flybridge',
    'l.5h': 'Atardecer en el flybridge', 'l.5p': 'Fusion HiFi encendido, hielo de la máquina',
    'l.6h': 'Camarotes frescos y silenciosos', 'l.6p': 'Aire acondicionado con el generador de 11 kW',
    'faq.h': 'Antes de que preguntes',
    'faq.1q': '¿El patrón está incluido?', 'faq.1a': 'Sí. Melkart I solo se alquila con patrón profesional, y el patrón está incluido en el precio.',
    'faq.2q': '¿Qué incluye el chárter de día?', 'faq.2a': 'Los 2.500 € del día cubren patrón, combustible, limpieza y tasas del puerto base. Hasta 10 invitados más el patrón.',
    'faq.3q': '¿Por qué no puedo reservar en octubre o mayo?', 'faq.3a': 'Son los meses en los que cruza el Atlántico: hacia Nassau en octubre y de vuelta a Mallorca en mayo. El calendario se mantiene bloqueado por si hay retrasos en el mar.',
    'faq.4q': '¿Cuántas personas pueden dormir a bordo?', 'faq.4a': 'Diez invitados en cinco camarotes: cuatro dobles y un twin. El patrón tiene un camarote de tripulación independiente.',
    'faq.5q': '¿Qué juguetes hay a bordo?', 'faq.5a': 'Una auxiliar Zar Mini de 3,8 m con fueraborda de 20 CV, dos tablas de paddle surf, equipos de snorkel y una piscina marina flotante antimedusas.',
    'book.h': 'Cuéntanos tus fechas', 'book.p': 'Te confirmamos disponibilidad y el precio exacto de tu semana o día. Envíalo por WhatsApp para la respuesta más rápida, o por email.',
    'f.name': 'Nombre completo', 'f.errname': 'Dinos tu nombre', 'f.email': 'Email', 'f.erremail': 'Escribe un email válido para poder responderte',
    'f.date': 'Fecha de inicio', 'f.errdate': 'Elige una fecha', 'f.plan': 'Chárter', 'f.guests': 'Invitados', 'f.quote': 'Estimación',
    'f.msg': '¿Algo que debamos saber? (opcional)', 'f.wa': 'Enviar por WhatsApp', 'f.mail': 'Enviar por email',
    'foot.claim': 'Veranos en Portocolom, inviernos en Nassau y el Atlántico en medio.', 'foot.cta': 'Hablemos',
    'foot.explore': 'Explorar', 'foot.bases': 'Bases', 'foot.contact': 'Contacto', 'foot.summer': 'jun – sep', 'foot.winter': 'nov – abr',
    'foot.boat': 'Melkart I · Bali 4.6 · bandera española',
  };

  // Runtime strings
  const RT = {
    en: {
      crossing: { west: 'Crossing the Atlantic to Nassau', east: 'Crossing the Atlantic to Mallorca' },
      notAvail: 'Not available for charter',
      season: { high: 'High season', mid: 'Mid season', low: 'Low season', cross: 'Atlantic crossing' },
      week: 'week', day: 'day', from: 'from',
      weekPrice: (p) => `<strong>${p}</strong> / week · day charter <strong>2,500 €</strong>`,
      onRequest: 'Low season, on request depending on the crossing',
      dayOf: (n, total) => `Day ${n} of ${total} at sea`,
      quoteWeek: (p) => `${p} / week`, quoteDay: '2,500 € / day',
      quoteNA: 'Not available',
      warnCross: 'On that date Melkart I is crossing the Atlantic. Choose another date or ask us for the closest available week.',
      msg: (d) => `Hello Melkart Náutica! I'd like to request a ${d.plan} on Melkart I.\n\nName: ${d.name}\nEmail: ${d.email}\nStart date: ${d.date}\nBase: ${d.base}\nGuests: ${d.guests}\nEstimate: ${d.quote}${d.msg ? `\n\n${d.msg}` : ''}`,
      subject: 'Charter request · Melkart I',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      locale: 'en-GB', num: 'en-US',
      pause: 'Pause video', play: 'Play video',
      playYear: 'Play the year', stopYear: 'Stop',
    },
    es: {
      crossing: { west: 'Cruzando el Atlántico hacia Nassau', east: 'Cruzando el Atlántico hacia Mallorca' },
      notAvail: 'No disponible para alquiler',
      season: { high: 'Temporada alta', mid: 'Temporada media', low: 'Temporada baja', cross: 'Travesía atlántica' },
      week: 'semana', day: 'día', from: 'desde',
      weekPrice: (p) => `<strong>${p}</strong> / semana · chárter de día <strong>2.500 €</strong>`,
      onRequest: 'Temporada baja, bajo consulta según la travesía',
      dayOf: (n, total) => `Día ${n} de ${total} en el mar`,
      quoteWeek: (p) => `${p} / semana`, quoteDay: '2.500 € / día',
      quoteNA: 'No disponible',
      warnCross: 'En esa fecha Melkart I está cruzando el Atlántico. Elige otra fecha o pregúntanos por la semana disponible más cercana.',
      msg: (d) => `¡Hola Melkart Náutica! Me gustaría solicitar un ${d.plan} en Melkart I.\n\nNombre: ${d.name}\nEmail: ${d.email}\nFecha de inicio: ${d.date}\nBase: ${d.base}\nInvitados: ${d.guests}\nEstimación: ${d.quote}${d.msg ? `\n\n${d.msg}` : ''}`,
      subject: 'Solicitud de chárter · Melkart I',
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      locale: 'es-ES', num: 'de-DE',
      pause: 'Pausar vídeo', play: 'Reproducir vídeo',
      playYear: 'Ver el año', stopYear: 'Parar',
    },
  };

  let lang = 'en';
  const originals = new Map();
  const listeners = [];

  function apply(next) {
    lang = next === 'es' ? 'es' : 'en';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      const k = el.dataset.i18n;
      el.innerHTML = lang === 'es' && ES[k] ? ES[k] : originals.get(el);
    });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('mk-lang', lang); } catch (e) { /* storage blocked */ }
    listeners.forEach((fn) => fn(lang));
  }

  function initial() {
    try { return localStorage.getItem('mk-lang') || 'en'; } catch (e) { return 'en'; }
  }

  return {
    apply, initial,
    get lang() { return lang; },
    t: () => RT[lang],
    onChange: (fn) => listeners.push(fn),
  };
})();
