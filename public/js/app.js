/* ============================================================================
 *  APP — rodeta de dies, play/pausa, presència de persones, llegenda/filtres
 * ========================================================================== */

// estat d'autenticació global (documents/tickets visibles?)
window.TripAuth = window.TripAuth || { canSeeDocs: false };

const App = (() => {
  let current = 0;              // índex del dia actiu
  let playing = false;
  let playTimer = null;
  let justDragged = 0;          // marca temporal per no confondre drag amb clic
  const PLAY_MS = 3200;
  const catState = {};          // cat → visible?

  const el = {};

  function boot() {
    TripMap.init();
    cacheEls();
    buildWheel();
    buildLegend();
    bindControls();
    // dia inicial (arribada a Bali si vols, aquí comencem al principi)
    goTo(0, false);
    // Deixa que el mapa s'assenti abans d'enquadrar
    setTimeout(() => TripMap.getMap().invalidateSize(), 200);
  }

  function cacheEls() {
    el.track = document.getElementById('wheelTrack');
    el.playBtn = document.getElementById('playBtn');
    el.drTitle = document.getElementById('drTitle');
    el.drRegion = document.getElementById('drRegion');
    el.peopleCount = document.getElementById('peopleCount');
    el.legendBody = document.getElementById('legendBody');
    el.sbDay = document.getElementById('sbDay');
    el.sbTitle = document.getElementById('sbTitle');
    el.sbRegion = document.getElementById('sbRegion');
    el.sbTimeline = document.getElementById('sbTimeline');
  }

  /* ---- Persones presents un dia donat ---- */
  function peopleOn(dateIso) {
    const d = parseDate(dateIso).getTime();
    return PEOPLE.filter(p =>
      d >= parseDate(p.from).getTime() && d <= parseDate(p.to).getTime()
    );
  }

  /* ============================ RODETA DE DIES ============================ */
  function buildWheel() {
    // separadors laterals perquè el primer/últim puguin centrar-se
    const pad = document.createElement('div');
    pad.style.flex = '0 0 calc(50% - 46px)';
    el.track.appendChild(pad.cloneNode());

    DAYS.forEach((day, i) => {
      const dt = parseDate(day.date);
      const chip = document.createElement('div');
      chip.className = 'day-chip';
      chip.dataset.idx = i;
      chip.innerHTML = `
        <div class="dc-dow">${_DOW[dt.getDay()]}</div>
        <div class="dc-num">${dt.getDate()}</div>
        <div class="dc-mon">${_MONTHS[dt.getMonth()]}</div>`;
      chip.addEventListener('click', () => {
        if (Date.now() - justDragged < 250) return;   // era un arrossegament, no un clic
        stopPlay();
        goTo(i, true);
      });
      el.track.appendChild(chip);
    });
    el.track.appendChild(pad.cloneNode());

    // scroll amb la roda del ratolí → canvia de dia
    let wheelLock = false;
    el.track.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      const dir = (e.deltaY || e.deltaX) > 0 ? 1 : -1;
      stopPlay();
      goTo(clamp(current + dir), true);
      setTimeout(() => { wheelLock = false; }, 260);
    }, { passive: false });

    // arrossegar horitzontalment
    enableDrag();
  }

  function enableDrag() {
    let down = false, startX = 0, startScroll = 0, moved = false, captured = false;
    const track = el.track;
    track.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      down = true; moved = false; captured = false;
      startX = e.clientX; startScroll = track.scrollLeft;
    });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      // només comença a arrossegar en superar el llindar → així el clic simple continua funcionant
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); }
      if (moved) {
        if (!captured) { try { track.setPointerCapture(e.pointerId); } catch (_) {} captured = true; }
        track.scrollLeft = startScroll - dx;
      }
    });
    const end = () => {
      if (!down) return;
      down = false;
      track.classList.remove('dragging');
      if (moved) { justDragged = Date.now(); stopPlay(); snapToNearest(); }
    };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
  }

  function snapToNearest() {
    const chips = [...el.track.querySelectorAll('.day-chip')];
    const center = el.track.scrollLeft + el.track.clientWidth / 2;
    let best = current, bestDist = Infinity;
    chips.forEach(c => {
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) { bestDist = dist; best = +c.dataset.idx; }
    });
    goTo(best, true);
  }

  function centerChip(i, smooth) {
    const chip = el.track.querySelector(`.day-chip[data-idx="${i}"]`);
    if (!chip) return;
    const target = chip.offsetLeft + chip.offsetWidth / 2 - el.track.clientWidth / 2;
    el.track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  }

  /* ============================ CANVI DE DIA ============================ */
  function goTo(i, smooth) {
    current = clamp(i);
    const day = DAYS[current];

    // rodeta
    el.track.querySelectorAll('.day-chip').forEach(c =>
      c.classList.toggle('active', +c.dataset.idx === current));
    centerChip(current, smooth);

    // lectura
    el.drTitle.textContent = day.title;
    el.drRegion.textContent = `${fmtDate(day.date)} · ${day.region}`;

    // persones — agrupades per localització (alguns es desvien, com el David)
    const present = peopleOn(day.date);
    const groups = {};
    present.forEach(p => {
      const loc = (p.overrides && p.overrides[day.date]) || day.home;
      (groups[loc] = groups[loc] || []).push(p);
    });
    const clusters = Object.entries(groups).map(([locId, people]) => ({ locId, people }));
    TripMap.setPeople(clusters);
    TripMap.setHomeMarker(day.home);
    renderCount(present);

    // mapa
    TripMap.showFlights(day.date);
    TripMap.frameDay(day.stops, day.home);
    // ressaltar parades un cop la càmera comença a moure's
    setTimeout(() => TripMap.highlightStops([...(day.stops || []), day.home]), 120);

    // barra lateral — itinerari del dia
    renderSidebar(day);
  }

  /* ============================ BARRA LATERAL ============================ */
  function renderSidebar(day) {
    const dt = parseDate(day.date);
    el.sbDay.textContent = `${_DOW_LONG[dt.getDay()]} · ${fmtDate(day.date)}`;
    el.sbTitle.textContent = day.title;
    el.sbRegion.textContent = day.region;

    const unlocked = !!(window.TripAuth && window.TripAuth.canSeeDocs);
    const shownDocs = new Set();   // evita repetir el mateix ticket dins el dia (ex: 2 trams d'un vol)

    el.sbTimeline.innerHTML = (day.schedule || []).map(item => {
      const k = SCHEDULE_KINDS[item.kind] || SCHEDULE_KINDS.act;
      const loc = item.loc ? LOCATIONS[item.loc] : null;
      // si enllaça un lloc, fem servir icona/color de la seva categoria
      const cat = loc ? CATEGORIES[loc.cat] : null;
      const icon = cat ? cat.icon : k.icon;
      const color = cat ? cat.color : k.color;
      const img = loc && loc.img ? loc.img : null;
      const isRec = item.status === 'rec';
      // confirmat = té ticket propi o el lloc està reservat
      const confirmed = !isRec && (item.pdf || (loc && loc.booked) || item.kind === 'flight');

      const links = [];
      if (loc && loc.link) links.push(`<a class="tl-book" href="${loc.link}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${loc.linkLabel || 'Mapa'} ↗</a>`);
      // document (ticket) d'aquesta entrada — protegit amb contrasenya.
      // Només el ticket propi de l'ítem; la llista completa per lloc és al popup del mapa.
      if (item.pdf && !shownDocs.has(item.pdf)) {
        shownDocs.add(item.pdf);
        if (unlocked) links.push(`<a class="tl-pdf" href="${item.pdf}" target="_blank" rel="noopener" onclick="event.stopPropagation()">📄 Ticket</a>`);
        else links.push(`<span class="tl-locked" onclick="event.stopPropagation()">🔒 Ticket</span>`);
      }

      return `
        <div class="tl-item${isRec ? ' tl-rec' : ''}${confirmed ? ' tl-confirmed' : ''}">
          <div class="tl-time">${item.t}</div>
          <div class="tl-marker" style="--c:${color}"><span>${icon}</span></div>
          <div class="tl-card${loc ? ' clickable' : ''}" ${loc ? `data-loc="${item.loc}"` : ''}>
            ${img ? `<img class="tl-img" src="${img}" alt="" loading="lazy" onerror="this.remove()">` : ''}
            <div class="tl-body">
              <div class="tl-title">${item.title}${confirmed ? ' <span class="tl-badge">✓</span>' : ''}${isRec ? ' <span class="tl-tag">proposta</span>' : ''}</div>
              ${item.ref && confirmed ? `<div class="tl-ref">${item.ref}</div>` : ''}
              ${item.note ? `<div class="tl-note">${item.note}</div>` : ''}
              ${links.length ? `<div class="tl-links">${links.join('')}</div>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');

    // clic a una targeta → volar al lloc al mapa
    el.sbTimeline.querySelectorAll('.tl-card.clickable').forEach(card => {
      card.addEventListener('click', () => {
        TripMap.openLocation(card.dataset.loc);
        document.body.classList.remove('sidebar-open');  // tanca el panell al mòbil
      });
    });
    el.sbTimeline.scrollTop = 0;
  }

  function renderCount(present) {
    const dots = present.map(p =>
      `<span title="${p.name}" style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${p.color};margin-left:-3px;border:1.5px solid #1c1c1e"></span>`
    ).join('');
    el.peopleCount.innerHTML = `
      <span class="pc-dot"></span>
      <span style="display:flex;padding-left:4px">${dots}</span>
      <span class="pc-label">${present.length} persones</span>`;
  }

  /* ============================ PLAY / PAUSA ============================ */
  function togglePlay() { playing ? stopPlay() : startPlay(); }
  function startPlay() {
    playing = true;
    el.playBtn.classList.add('playing');
    el.playBtn.innerHTML = '❚❚';
    if (current >= DAYS.length - 1) goTo(0, true);
    playTimer = setInterval(() => {
      if (current >= DAYS.length - 1) { stopPlay(); return; }
      goTo(current + 1, true);
    }, PLAY_MS);
  }
  function stopPlay() {
    playing = false;
    el.playBtn.classList.remove('playing');
    el.playBtn.innerHTML = '►';
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
  }

  /* ============================ LLEGENDA / FILTRES ============================ */
  function buildLegend() {
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      catState[key] = true;
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.dataset.cat = key;
      item.innerHTML = `
        <span class="legend-swatch" style="background:${hexA(cat.color, 0.22)};color:${cat.color}">${cat.icon}</span>
        <span class="li-label">${cat.label}</span>
        <span class="li-check">●</span>`;
      item.addEventListener('click', () => toggleCat(key, item));
      el.legendBody.appendChild(item);
    });
  }

  function toggleCat(key, item) {
    catState[key] = !catState[key];
    item.classList.toggle('off', !catState[key]);
    item.querySelector('.li-check').textContent = catState[key] ? '●' : '○';
    TripMap.setCategoryVisible(key, catState[key]);
  }

  /* ============================ CONTROLS ============================ */
  function bindControls() {
    el.playBtn.addEventListener('click', togglePlay);

    // teclat: fletxes + espai
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopPlay(); goTo(current + 1, true); }
      else if (e.key === 'ArrowLeft') { stopPlay(); goTo(current - 1, true); }
      else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    });

    // llegenda plegable
    document.getElementById('legendHead').addEventListener('click', () => {
      document.getElementById('legend').classList.toggle('collapsed');
    });

    // botó itinerari (mòbil) — obre/tanca la barra lateral
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });

    // commutador satèl·lit / mapa
    document.getElementById('basemapToggle').addEventListener('click', (e) => {
      const kind = TripMap.toggleBasemap();
      const label = document.getElementById('bmLabel');
      const icon = e.currentTarget.querySelector('.bm-icon');
      if (kind === 'map') { label.textContent = 'Mapa'; icon.textContent = '🗺️'; }
      else { label.textContent = 'Satèl·lit'; icon.textContent = '🛰️'; }
    });

    // intro + porta d'accés (contrasenya per als tickets / entrar com a convidat)
    const intro = document.getElementById('intro');
    const pwInput = document.getElementById('pwInput');
    const pwErr = document.getElementById('pwErr');

    function enterMap() {
      intro.classList.add('hidden');
      setTimeout(() => { TripMap.getMap().invalidateSize(); goTo(current, true); }, 400);
    }

    async function tryPassword() {
      const val = (pwInput.value || '').trim();
      if (!val) { pwInput.focus(); return; }
      const ok = await checkPassword(val);
      if (ok) {
        window.TripAuth.canSeeDocs = true;
        document.body.classList.add('docs-unlocked');
        enterMap();
      } else {
        pwErr.textContent = 'Contrasenya incorrecta';
        pwInput.classList.add('shake');
        setTimeout(() => pwInput.classList.remove('shake'), 500);
      }
    }

    document.getElementById('enterBtn').addEventListener('click', tryPassword);
    pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryPassword(); });
    pwInput.addEventListener('input', () => { pwErr.textContent = ''; });
    document.getElementById('guestBtn').addEventListener('click', () => {
      window.TripAuth.canSeeDocs = false;
      enterMap();
    });
  }

  /* ---- Comprovació de contrasenya (SHA-256, sense guardar-la en clar) ----
   *  Per canviar la contrasenya: genera el hash sha256 de la nova paraula i
   *  substitueix DOC_HASH. Nota: aquesta protecció amaga els enllaços però no
   *  xifra els fitxers; els noms de docs/t/ són no endevinables com a mesura
   *  extra. Per a seguretat real caldria autenticació al servidor. */
  const DOC_HASH = 'caa02b2e0854029056c1fc5e3320c4f68699c294fbebafbef284b80e5e6ea2f0';
  async function checkPassword(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
      return hex === DOC_HASH;
    } catch (_) { return false; }
  }

  const clamp = (i) => Math.max(0, Math.min(DAYS.length - 1, i));

  return { boot };
})();

window.addEventListener('DOMContentLoaded', App.boot);
