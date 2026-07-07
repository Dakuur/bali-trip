/* ============================================================================
 *  MAPA — Leaflet + Esri World Imagery (satèl·lit, sense API key)
 *  Gestiona: tiles, marcadors POI, traçades de vols, clúster de persones,
 *  i moviment de càmera.
 * ========================================================================== */

const TripMap = (() => {
  let map;
  let poiLayer, flightLayer, peopleLayer;
  let satLayer, mapLayer;      // capes base: satèl·lit / mapa net
  let basemap = 'sat';         // 'sat' | 'map'
  const poiMarkers = {};      // id → { marker, cat }
  const flightPaths = [];      // { line, glow, color }
  let homeMarkerId = null;     // marcador "casa" del dia actual

  /* ---- Inicialització ---- */
  function init() {
    map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 18,
      zoomSnap: 0.25,
    }).setView([-2, 116], 4);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Capa base SATÈL·LIT (imatgeria Esri + etiquetes de referència)
    satLayer = L.layerGroup([
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Imatgeria © Esri, Maxar, Earthstar Geographics · Bali 2026', maxZoom: 18 }
      ),
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.75 }
      ),
    ]);

    // Capa base MAPA (colors naturals estil Apple Maps: verd terra, blau mar)
    mapLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap · Bali 2026', maxZoom: 19 }
    );

    satLayer.addTo(map);

    flightLayer = L.layerGroup().addTo(map);
    poiLayer = L.layerGroup().addTo(map);
    peopleLayer = L.layerGroup().addTo(map);

    buildPois();
    buildFlights();
    return map;
  }

  /* ---- Commutar capa base satèl·lit / mapa ---- */
  function setBasemap(kind) {
    if (kind === basemap) return basemap;
    basemap = kind;
    if (kind === 'map') { map.removeLayer(satLayer); mapLayer.addTo(map); }
    else { map.removeLayer(mapLayer); satLayer.addTo(map); }
    return basemap;
  }
  function toggleBasemap() { return setBasemap(basemap === 'sat' ? 'map' : 'sat'); }

  /* ---- Marcadors POI ---- */
  function buildPois() {
    Object.entries(LOCATIONS).forEach(([id, loc]) => {
      const cat = CATEGORIES[loc.cat];
      const html = `
        <div class="poi-wrap">
          <div class="poi" style="background:${cat.color}">
            <span>${cat.icon}</span>
          </div>
        </div>`;
      const icon = L.divIcon({
        className: 'poi-icon',
        html,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });
      const marker = L.marker(loc.ll, { icon, riseOnHover: true });
      marker.bindPopup(popupHtml(id, loc), { closeButton: true, autoPanPadding: [40, 80] });
      // clic a la casa del dia → mostra/amaga els cercles de persones
      marker.on('click', () => { if (id === homeMarkerId) togglePeople(); });
      marker.addTo(poiLayer);
      poiMarkers[id] = { marker, cat: loc.cat, el: null };
    });
  }

  function popupHtml(id, loc) {
    const cat = CATEGORIES[loc.cat];
    const pdfs = (loc.pdfs || []).map(p =>
      `<a class="pcard-pdf" href="${p.file}" target="_blank" rel="noopener">📄 ${p.label}</a>`
    ).join('');
    return `
      <div class="pcard">
        ${loc.img ? `<img class="pcard-img" src="${loc.img}" alt="" onerror="this.remove()">` : ''}
        <div class="pcard-pad">
          <span class="pcard-cat" style="background:${hexA(cat.color, 0.18)};color:${cat.color}">
            ${cat.icon} ${cat.label}
          </span>
          ${loc.region ? `<div class="pcard-region">${loc.region}</div>` : ''}
          <h3>${loc.name}</h3>
          <p>${loc.desc || ''}</p>
          ${loc.price ? `<div class="pcard-price">${loc.price}</div>` : ''}
          ${loc.link ? `<a class="pcard-link" href="${loc.link}" target="_blank" rel="noopener">${loc.linkLabel || 'Més info'} ↗</a>` : ''}
          ${pdfs ? `<div class="pcard-pdfs">${pdfs}</div>` : ''}
        </div>
      </div>`;
  }

  /* ---- Traçades de vols (arcs corbats) ---- */
  function buildFlights() {
    FLIGHTS.forEach((f) => {
      const a = LOCATIONS[f.from].ll;
      const b = LOCATIONS[f.to].ll;
      const pts = arc(a, b, 0.2, 48);
      // color: grup en blau clar, rutes individuals amb el color de la persona
      const person = f.who && f.who !== 'group' ? PEOPLE.find(p => p.id === f.who) : null;
      const color = person ? person.color : '#CDE7FF';
      const glow = L.polyline(pts, { color, weight: 6, opacity: 0.1, lineCap: 'round' });
      const line = L.polyline(pts, {
        color, weight: 2, opacity: 0.5,
        dashArray: '2 8', lineCap: 'round',
      });
      line.bindPopup(`<div class="pcard"><span class="pcard-cat" style="background:${hexA(color,0.18)};color:${color}">✈️ Vol${person ? ' · ' + person.name : ''}</span><h3>${f.label}</h3><p>${fmtDate(f.date)}</p></div>`);
      flightPaths.push({ line, glow, color, active: false });
    });
  }

  // Genera un arc corbat (bezier quadràtic amb desviació perpendicular)
  function arc(a, b, curve, steps) {
    const [lat1, lng1] = a, [lat2, lng2] = b;
    const mx = (lat1 + lat2) / 2, my = (lng1 + lng2) / 2;
    const dx = lat2 - lat1, dy = lng2 - lng1;
    // punt de control desplaçat perpendicularment
    const cx = mx - dy * curve;
    const cy = my + dx * curve;
    const out = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * cx + t * t * lat2;
      const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * cy + t * t * lng2;
      out.push([lat, lng]);
    }
    return out;
  }

  /* ---- Mostrar vols: s'il·luminen els del dia (per data) ---- */
  function showFlights(dateIso) {
    flightPaths.forEach((fp, i) => {
      const on = FLIGHTS[i].date === dateIso;
      flightLayer.removeLayer(fp.line);
      flightLayer.removeLayer(fp.glow);
      if (on) {
        fp.glow.setStyle({ opacity: 0.4 });
        fp.line.setStyle({ opacity: 0.95, weight: 2.5, dashArray: null });
      } else {
        fp.glow.setStyle({ opacity: 0.08 });
        fp.line.setStyle({ opacity: 0.32, weight: 2, dashArray: '2 8' });
      }
      fp.glow.addTo(flightLayer);
      fp.line.addTo(flightLayer);
    });
  }

  /* ---- Filtres de categoria ---- */
  function setCategoryVisible(cat, visible) {
    Object.values(poiMarkers).forEach((p) => {
      if (p.cat !== cat) return;
      if (visible) p.marker.addTo(poiLayer);
      else poiLayer.removeLayer(p.marker);
    });
    // vols segueixen la categoria 'flight'
    if (cat === 'flight') {
      flightPaths.forEach((fp) => {
        if (visible) { fp.glow.addTo(flightLayer); fp.line.addTo(flightLayer); }
        else { flightLayer.removeLayer(fp.line); flightLayer.removeLayer(fp.glow); }
      });
    }
  }

  /* ---- Ressaltar les parades del dia ---- */
  function highlightStops(stopIds) {
    const set = new Set(stopIds);
    Object.entries(poiMarkers).forEach(([id, p]) => {
      const el = p.marker.getElement();
      if (!el) return;
      const wrap = el.querySelector('.poi-wrap');
      if (!wrap) return;
      if (set.size === 0 || set.has(id)) wrap.classList.remove('poi-dim');
      else wrap.classList.add('poi-dim');
    });
  }

  /* ---- Clústers de persones (un per localització) ----
   *  Per defecte estan AMAGATS. Es mostren en clicar la casa del dia.
   *  clusters: [{ locId, people: [...] }, ...]
   * ------------------------------------------------------ */
  let peopleMarkers = [];
  let pendingClusters = [];
  let peopleVisible = false;

  function setPeople(clusters) {
    pendingClusters = clusters;
    hidePeople();               // en canviar de dia, sempre amagats de nou
  }

  function clearPeopleMarkers() {
    peopleMarkers.forEach(m => peopleLayer.removeLayer(m));
    peopleMarkers = [];
  }

  function renderPeopleMarkers() {
    clearPeopleMarkers();
    pendingClusters.forEach(({ locId, people }) => {
      const loc = LOCATIONS[locId];
      if (!loc || people.length === 0) return;
      const avatars = people.map(p =>
        `<div class="avatar" style="background:${p.color}" title="${p.name}">${p.name[0]}</div>`
      ).join('');
      const rows = Math.ceil(people.length / 3);
      const h = rows * 29 + 8;
      const icon = L.divIcon({
        className: 'people-icon',
        html: `<div class="people-cluster">${avatars}</div>`,
        iconSize: [92, h],
        iconAnchor: [46, h + 20],   // flota just per sobre de la casa
      });
      const marker = L.marker(loc.ll, { icon, interactive: false, zIndexOffset: 1200 });
      marker.addTo(peopleLayer);
      peopleMarkers.push(marker);
    });
  }

  function showPeople() { if (!peopleVisible) { peopleVisible = true; renderPeopleMarkers(); } }
  function hidePeople() { if (peopleVisible || peopleMarkers.length) { peopleVisible = false; clearPeopleMarkers(); } }
  function togglePeople() { peopleVisible ? hidePeople() : showPeople(); }

  /* ---- Marcador "casa" del dia (més gran + clic mostra les persones) ---- */
  function styleHome(id, on) {
    const p = poiMarkers[id];
    if (!p) return;
    const el = p.marker.getElement();
    if (!el) return;
    const poi = el.querySelector('.poi');
    if (poi) poi.classList.toggle('poi-home', on);
  }

  function setHomeMarker(id) {
    // el marcador que deixa de ser casa: treu estil i recupera el seu popup
    if (homeMarkerId && homeMarkerId !== id) {
      styleHome(homeMarkerId, false);
      const prev = poiMarkers[homeMarkerId];
      if (prev) prev.marker.bindPopup(popupHtml(homeMarkerId, LOCATIONS[homeMarkerId]), { closeButton: true, autoPanPadding: [40, 80] });
    }
    hidePeople();
    homeMarkerId = id;
    // la casa del dia no obre popup: el clic mostra/amaga els cercles de persones
    const cur = poiMarkers[id];
    if (cur) cur.marker.unbindPopup();
    styleHome(id, true);
    // reaplica quan el marcador ja s'ha renderitzat a la vista
    setTimeout(() => styleHome(id, true), 300);
    setTimeout(() => styleHome(id, true), 1000);
  }

  /* ---- Càmera ---- */
  function frameDay(stopIds, homeId) {
    const pts = stopIds.map(id => LOCATIONS[id] && LOCATIONS[id].ll).filter(Boolean);
    if (homeId && LOCATIONS[homeId]) pts.push(LOCATIONS[homeId].ll);
    if (pts.length === 0) return;
    const single = pts.length === 1;
    const bounds = L.latLngBounds(single ? [pts[0], pts[0]] : pts);
    const pad = computePadding();
    map.flyToBounds(bounds, {
      paddingTopLeft: pad.tl,
      paddingBottomRight: pad.br,
      duration: 1.6,
      maxZoom: single ? 13 : 14,
    });
  }

  /* Marges de la càmera perquè el contingut no quedi sota la rodeta de dies
     (dalt) ni sota la barra lateral (dreta) ni els controls (baix-esquerra). */
  function computePadding() {
    const isMobile = window.innerWidth <= 720;
    const topbar = document.querySelector('.topbar');
    const sidebar = document.getElementById('sidebar');
    const topPad = (topbar ? topbar.offsetHeight : 130) + 24;
    let rightPad = 30;
    if (!isMobile && sidebar) rightPad = sidebar.offsetWidth + 32;
    const leftPad = isMobile ? 30 : 50;
    const bottomPad = isMobile ? 40 : 96;   // controls + llegenda (baix-esquerra)
    return { tl: [leftPad, topPad], br: [rightPad, bottomPad] };
  }

  function flyTo(ll, zoom) { map.flyTo(ll, zoom, { duration: 1.4 }); }
  function getMap() { return map; }

  /* ---- Obrir un lloc des de la barra lateral (vola + popup) ---- */
  function openLocation(id) {
    const loc = LOCATIONS[id];
    if (!loc) return;
    const m = poiMarkers[id] && poiMarkers[id].marker;
    map.flyTo(loc.ll, Math.max(map.getZoom(), 13), { duration: 1.2 });
    if (m) { map.once('moveend', () => m.openPopup()); m.openPopup(); }
  }

  return {
    init, showFlights, setCategoryVisible, highlightStops,
    setPeople, setHomeMarker, frameDay, flyTo, getMap,
    setBasemap, toggleBasemap, openLocation,
  };
})();

/* ---- Utilitats compartides ---- */
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
const _MONTHS = ['gen', 'febr', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des'];
const _DOW = ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'];
const _DOW_LONG = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
function parseDate(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(iso) { const dt = parseDate(iso); return `${dt.getDate()} ${_MONTHS[dt.getMonth()]} 2026`; }
