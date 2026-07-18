/* ============================================================================
 *  DADES DEL VIATGE — Singapur · Komodo · Bali · Gili · Uluwatu
 *  Estructura central de dades. Tota la web es construeix a partir d'aquí.
 *  Dates en format ISO (YYYY-MM-DD). Coordenades en [lat, lng].
 *
 *  CONFIRMAT vs RECOMANACIÓ
 *  -----------------------
 *  Només es marca com a CONFIRMAT allò que tenim reservat amb ticket/document
 *  (vols, allotjaments i 4 activitats amb entrada comprada). Tota la resta són
 *  PROPOSTES/RECOMANACIONS (status: 'rec') i es mostren com a idees, no com a
 *  reserves. Els documents confidencials viuen a docs/t/ (noms no endevinables)
 *  i només es veuen amb contrasenya.
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  PERSONES
 *  from / to  →  primer i últim dia (inclosos) que hi són.
 *  Per defecte tothom fa el viatge sencer (22 jul → 11 ago) tret de:
 *    · David   vola sol amb Emirates (BCN·Dubai·Denpasar). Arriba a Bali el
 *              27 jul (16:35) i marxa de Denpasar el vespre del 9 ago.
 *    · Guillem marxa abans dels Gili el 5 ago.
 * ------------------------------------------------------------------------- */
const PEOPLE = [
  { id: 'jia',     name: 'Jia',     color: '#FF6B6B', from: '2026-07-22', to: '2026-08-11' },
  { id: 'david',   name: 'David',   color: '#4D96FF', from: '2026-07-27', to: '2026-08-09',
    // El David surt de Denpasar el vespre del 9 ago (no va a Singapur amb el grup).
    overrides: { '2026-08-09': 'dps_apt' } },
  { id: 'grau',    name: 'Grau',    color: '#38C172', from: '2026-07-22', to: '2026-08-11' },
  { id: 'jan',     name: 'Jan',     color: '#F0B429', from: '2026-07-22', to: '2026-08-11' },
  { id: 'guillem', name: 'Guillem', color: '#C780FA', from: '2026-07-22', to: '2026-08-04' },
  { id: 'joel',    name: 'Joel',    color: '#FF9F45', from: '2026-07-22', to: '2026-08-11' },
  { id: 'emma',    name: 'Emma',    color: '#F473B9', from: '2026-07-22', to: '2026-08-11' },
  { id: 'carlota', name: 'Carlota', color: '#2CD3E1', from: '2026-07-22', to: '2026-08-11' },
  { id: 'ramon',   name: 'Ramon',   color: '#B08155', from: '2026-07-22', to: '2026-08-11' },
];

/* ---------------------------------------------------------------------------
 *  CATEGORIES  →  color + icona + etiqueta (llegenda i filtres)
 * ------------------------------------------------------------------------- */
const CATEGORIES = {
  lodging:   { label: 'Allotjament',   color: '#7C83FD', icon: '🏠' },
  flight:    { label: 'Vol',           color: '#5AB2FF', icon: '✈️' },
  beach:     { label: 'Platja',        color: '#00C2CB', icon: '🏖️' },
  nature:    { label: 'Natura',        color: '#4CAF50', icon: '💦' },
  culture:   { label: 'Cultura',       color: '#B983FF', icon: '🛕' },
  food:      { label: 'Gastronomia',   color: '#FF7043', icon: '🍜' },
  adventure: { label: 'Aventura',      color: '#FF5252', icon: '🏄' },
  nightlife: { label: 'Nit',           color: '#EC4899', icon: '🌙' },
  market:    { label: 'Mercat',        color: '#F5B300', icon: '🛍️' },
  sea:       { label: 'Mar & Snorkel', color: '#2196F3', icon: '🤿' },
};

/* ---------------------------------------------------------------------------
 *  TIPUS D'ENTRADA DE L'HORARI  →  fil conductor del dia (barra lateral)
 * ------------------------------------------------------------------------- */
const SCHEDULE_KINDS = {
  wake:      { icon: '☀️', color: '#F5B300', label: 'Despertar' },
  breakfast: { icon: '🍳', color: '#FF9F45', label: 'Esmorzar' },
  lunch:     { icon: '🍽️', color: '#FF7043', label: 'Dinar' },
  dinner:    { icon: '🌙', color: '#EC4899', label: 'Sopar' },
  act:       { icon: '📍', color: '#0A84FF', label: 'Activitat' },
  move:      { icon: '🚗', color: '#8E8E93', label: 'Trasllat' },
  flight:    { icon: '✈️', color: '#5AB2FF', label: 'Vol' },
  free:      { icon: '🌴', color: '#34C759', label: 'Temps lliure' },
  sleep:     { icon: '😴', color: '#7C83FD', label: 'Dormir' },
};

/* ---------------------------------------------------------------------------
 *  IMATGES  →  fotos (Wikimedia).
 * ------------------------------------------------------------------------- */
const IMG = {
  tanahlot:    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/TanahLot_2014.JPG/330px-TanahLot_2014.JPG',
  uluwatu:     'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Pura_Luhur_Uluwatu_2017-08-17_%2834%29.jpg/330px-Pura_Luhur_Uluwatu_2017-08-17_%2834%29.jpg',
  batur:       'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/View_Of_Mt.Batur_on_April_8th_2026.jpg/330px-View_Of_Mt.Batur_on_April_8th_2026.jpg',
  gardensbay:  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Supertree_Grove%2C_Gardens_by_the_Bay%2C_Singapore_-_20120712-02.jpg/330px-Supertree_Grove%2C_Gardens_by_the_Bay%2C_Singapore_-_20120712-02.jpg',
  marinabay:   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/330px-Marina_Bay_Sands_%28I%29.jpg',
  beratan:     'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Pura_Ulun_Danu_Bratan%2C_2022.jpg/330px-Pura_Ulun_Danu_Bratan%2C_2022.jpg',
  monkey:      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Monkey_Forest.jpg/330px-Monkey_Forest.jpg',
  ubud:        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Ubud_%2849818456887%29.jpg/330px-Ubud_%2849818456887%29.jpg',
  nusa:        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Broken_Bay%2C_Nusa_Penida.jpg/330px-Broken_Bay%2C_Nusa_Penida.jpg',
  labuanbajo:  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Labuan_Bajo%2C_a_port_in_West_Flores%2C_Nusa_Tenggara%2C_Indonesia%3B_January_2020.jpg/330px-Labuan_Bajo%2C_a_port_in_West_Flores%2C_Nusa_Tenggara%2C_Indonesia%3B_January_2020.jpg',
  komodo:      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Komodo_dragon_at_Komodo_National_Park.jpg/330px-Komodo_dragon_at_Komodo_National_Park.jpg',
  padang:      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Padang_Padang_Beach_Bali.jpg/330px-Padang_Padang_Beach_Bali.jpg',
  canggu:      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Beach_Club_Canggu.jpg/330px-Beach_Club_Canggu.jpg',
  seminyak:    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Seminyak%2C_Bali.jpg/330px-Seminyak%2C_Bali.jpg',
  chinatown:   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_perspective_of_Singapore%27s_Chinatown.jpg/330px-Aerial_perspective_of_Singapore%27s_Chinatown.jpg',
  kampongglam: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kampong_Glam_aerial_shot_-_20250628_-_RSKY.jpg/330px-Kampong_Glam_aerial_shot_-_20250628_-_RSKY.jpg',
};

/* ---------------------------------------------------------------------------
 *  LOCALITZACIONS  →  diccionari per id
 *  cat: clau de CATEGORIES · link/linkLabel opcionals · price/img opcionals
 *  booked: true            →  tenim reserva/ticket d'aquest lloc
 *  pdfs: [{ label, file }] →  rebuts (a docs/t/, protegits amb contrasenya)
 *  ref:  codi de confirmació (només informatiu)
 * ------------------------------------------------------------------------- */
const LOCATIONS = {
  /* ---- Aeroports / punts de vol ---- */
  bcn: { name: 'Aeroport de Barcelona (BCN)', cat: 'flight', ll: [41.2974, 2.0833], desc: 'Terminal 1. El grup surt amb Turkish Airlines via Istanbul; el David amb Emirates via Dubai.' },
  ist: { name: 'Istanbul Airport (IST)',       cat: 'flight', ll: [41.2753, 28.7519], desc: 'Escala del grup amb Turkish Airlines (anada i tornada).' },
  sin_apt: { name: 'Singapore Changi (SIN)',   cat: 'flight', ll: [1.3644, 103.9915], desc: "Aeroport d'entrada i sortida del viatge." },
  kul_apt: { name: 'Kuala Lumpur (KUL)',       cat: 'flight', ll: [2.7456, 101.7072], desc: "Escala del grup el 24 jul (Singapur → Labuan Bajo, via Malaysia Airlines + AirAsia)." },
  lbj_apt: { name: 'Komodo Airport (LBJ)',     cat: 'flight', ll: [-8.4867, 119.8877], desc: 'Aeroport de Labuan Bajo, porta al Parc Nacional de Komodo.' },
  dps_apt: { name: 'Denpasar — Ngurah Rai (DPS)', cat: 'flight', ll: [-8.7482, 115.1675], desc: 'Aeroport de Bali.' },
  dxb_apt: { name: 'Dubai International (DXB)', cat: 'flight', ll: [25.2532, 55.3657], desc: "Escala del David amb Emirates (anada i tornada)." },

  /* ---- Allotjaments (tots amb reserva) ---- */
  sin1: { name: 'Spacepod@com', cat: 'lodging', ll: [1.3112, 103.8729], region: 'Singapur', booked: true,
          desc: "1 nit (23–24 jul). Hostel de càpsules a 6 Jalan Ayer. Parada de pas en arribar a Singapur.", price: '≈ 132 € (grup)',
          ref: 'Booking · 6648.912.254',
          link: 'https://www.google.com/maps/search/?api=1&query=Spacepod%40com+6+Jalan+Ayer+Singapore', linkLabel: 'Veure al mapa',
          pdfs: [{ label: 'Reserva Spacepod@com (23–24 jul)', file: 'docs/t/singapur-2324-8f3017e9.pdf' }] },
  lbj_hotel: { name: 'Hotel a Labuan Bajo', cat: 'lodging', ll: [-8.4956, 119.8770], region: 'Komodo', img: IMG.labuanbajo, booked: true,
          desc: 'Dues nits reservades: 24–25 jul (abans del barco) i 26–27 jul (en tornar). Esmorzar inclòs.',
          pdfs: [{ label: 'Reserva Labuan Bajo (24–25 jul)', file: 'docs/t/labuanbajo-2425-8c3347f6.pdf' },
                 { label: 'Reserva Labuan Bajo (26–27 jul)', file: 'docs/t/labuanbajo-2627-6775f0a9.pdf' }] },
  ubud_villa: { name: 'Casa a Ubud (Airbnb · Muni Imelda)', cat: 'lodging', ll: [-8.5069, 115.2625], region: 'Ubud', img: IMG.ubud, booked: true,
          desc: '5 nits (27 jul – 1 ago). Casa sencera, 4 llits, 8 viatgers. Airbnb.', price: '657 € (grup)',
          ref: 'Airbnb · HM3PZZDKEP',
          pdfs: [{ label: 'Reserva Ubud (27 jul – 1 ago)', file: 'docs/t/ubud-271-47844e7f.pdf' }] },
  canggu_villa: { name: 'Casa a Canggu (Airbnb · Maria Erliza)', cat: 'lodging', ll: [-8.6478, 115.1385], region: 'Canggu', img: IMG.canggu, booked: true,
          desc: '4 nits (1–5 ago). Casa sencera, 7 llits, 9 viatgers, a Kecamatan Kuta Utara.', price: '534 € (grup)',
          ref: 'Airbnb · HMZA5KBEF9',
          pdfs: [{ label: 'Reserva Canggu (1–5 ago)', file: 'docs/t/canggu-15-7aca5475.pdf' }] },
  gili_villa: { name: 'Casa a Gili Trawangan (Airbnb · Arnaud)', cat: 'lodging', ll: [-8.3505, 116.0410], region: 'Gili T', booked: true,
          desc: '2 nits (5–7 ago). Casa sencera, 4 llits, 8 viatgers (Pemenang).', price: '331 € (grup)',
          ref: 'Airbnb · HM9K5XDYA2',
          pdfs: [{ label: 'Reserva Gili T (5–7 ago)', file: 'docs/t/gili-57-3801e88b.pdf' }] },
  ulu_villa: { name: 'Villa Ricca Eco Lodge', cat: 'lodging', ll: [-8.8158, 115.1480], region: 'Uluwatu', img: IMG.uluwatu, booked: true,
          desc: '2 nits (7–9 ago). Gang Kahuripan 21, Bukit, Ungasan. 4 habitacions dobles per a 8 persones.', price: '≈ 130 US$ (grup)',
          ref: 'Booking · Villa Ricca Eco Lodge',
          link: 'https://www.google.com/maps/search/?api=1&query=Villa+Ricca+Eco+Lodge+Ungasan', linkLabel: 'Veure al mapa',
          pdfs: [{ label: 'Reserva Uluwatu (7–9 ago)', file: 'docs/t/uluwatu-79-3e01b4bf.pdf' }] },
  sin2: { name: 'Beat. Sports Hostel', cat: 'lodging', ll: [1.3106, 103.8595], region: 'Singapur', booked: true,
          desc: '2 nits (9–11 ago). 290A Jalan Besar. Últimes nits del viatge abans de tornar.', price: '254 €',
          ref: 'Booking · 1598739346091366',
          link: 'https://www.google.com/maps/search/?api=1&query=Beat+Sports+Hostel+290A+Jalan+Besar+Singapore', linkLabel: 'Veure al mapa',
          pdfs: [{ label: 'Reserva Singapur (9–11 ago)', file: 'docs/t/singapur-911-8e67d5c6.pdf' }] },

  /* ---- Komodo ---- */
  komodo_boat:  { name: 'Barco — Parc Nacional de Komodo', cat: 'sea', ll: [-8.5680, 119.6110], region: 'Komodo', img: IMG.komodo, booked: true,
          desc: 'Tour compartit de 2 dies i 1 nit (25–26 jul). Komodo, Padar i Pink Beach, entrada i snorkel inclosos. GetYourGuide.',
          ref: 'GetYourGuide · GYGLMRZWRWQA',
          pdfs: [{ label: 'Tour barco Komodo (25–26 jul)', file: 'docs/t/komodo-boat-0d773f2f.pdf' }] },
  padar:  { name: 'Illa de Padar', cat: 'nature', ll: [-8.6520, 119.5820], region: 'Komodo', desc: 'El mirador més icònic de Komodo: tres badies i platges de colors. (Inclòs al tour del barco.)' },
  pink_beach: { name: 'Pink Beach', cat: 'beach', ll: [-8.5300, 119.5170], region: 'Komodo', desc: 'Platja de sorra rosada, snorkel entre corals. (Inclòs al tour del barco.)' },

  /* ---- Ubud ---- */
  ubud_market:  { name: 'Ubud Traditional Market', cat: 'market', ll: [-8.5075, 115.2626], region: 'Ubud', img: IMG.ubud, desc: "Mercat del matí al cor d'Ubud. Artesania, teles i souvenirs." },
  monkey_forest:{ name: 'Sacred Monkey Forest', cat: 'nature', ll: [-8.5188, 115.2588], region: 'Ubud', img: IMG.monkey, booked: true,
          desc: 'Santuari amb macacos entre temples i figueres. Entrada comprada per al 28 jul, 09:00.',
          ref: 'Megatix · Order 1535 5432 50',
          pdfs: [{ label: 'Entrada Monkey Forest (28 jul)', file: 'docs/t/monkey-forest-dae34ad5.pdf' }] },
  offerings:    { name: "Taller d'ofrenes (canang sari)", cat: 'culture', ll: [-8.5100, 115.2620], region: 'Ubud', desc: 'Taller opcional per aprendre a fer les ofrenes balineses. Proposta.' },
  gianyar_market:{ name: 'Mercat nocturn de Gianyar', cat: 'food', ll: [-8.5426, 115.3269], region: 'Ubud', desc: 'Menjar de carrer balinès autèntic al vespre. Proposta.' },
  canyoning:    { name: 'Canyoning', cat: 'adventure', ll: [-8.4230, 115.3200], region: 'Ubud', desc: 'Descens de canyons entre cascades. Proposta (sense reserva).' },
  silver:       { name: 'Taller de plata — Kuta', cat: 'culture', ll: [-8.7180, 115.1730], region: 'Kuta', booked: true,
          desc: 'Taller de joieria de plata (5 g inclosos) el 3 ago a les 09:00, per a 9 persones. Kuta.',
          ref: 'Klook · CHM958033',
          pdfs: [{ label: 'Taller de plata (3 ago)', file: 'docs/t/silver-workshop-690f40ab.pdf' }] },
  balidance:    { name: 'Dansa tradicional balinesa', cat: 'culture', ll: [-8.5069, 115.2630], region: 'Ubud', desc: 'Espectacle de dansa a la nit. Proposta opcional.' },
  sekumpul:     { name: 'Cascada Sekumpul', cat: 'nature', ll: [-8.1594, 115.1236], region: 'Nord de Bali', desc: 'La cascada més espectacular de Bali. Proposta d\'excursió de dia al nord.' },
  banyumala:    { name: 'Banyumala Twin Waterfall', cat: 'nature', ll: [-8.2497, 115.1207], region: 'Nord de Bali', desc: 'Cascada bessona amb piscina natural. Proposta.' },
  batur:        { name: 'Volcà Batur — sunrise', cat: 'adventure', ll: [-8.2422, 115.3752], region: 'Nord de Bali', img: IMG.batur, booked: true,
          desc: "Caminada guiada amb esmorzar per veure la sortida del sol. Reservat per al 31 jul, trobada a les 03:30. 9 persones.",
          ref: 'GetYourGuide · GYG7VKWBNXVB',
          pdfs: [{ label: 'Caminada Batur (31 jul)', file: 'docs/t/batur-hike-2c6449d1.pdf' }] },
  cooking:      { name: 'Classe de cuina balinesa', cat: 'food', ll: [-8.5090, 115.2600], region: 'Ubud', desc: 'Classe per sopar cuinant plats típics balinesos. Proposta.' },
  quad:         { name: 'Quads / ATV', cat: 'adventure', ll: [-8.4820, 115.2400], region: 'Ubud', desc: 'Ruta en quads entre arrossars i jungla. Proposta.' },
  jatiluwih:    { name: 'Arrossars de Jatiluwih', cat: 'nature', ll: [-8.3705, 115.1315], region: 'Bali central', desc: 'Terrasses d\'arròs Patrimoni de la UNESCO. Proposta de camí cap a Canggu.' },
  beratan:      { name: 'Temple Ulun Danu Beratan', cat: 'culture', ll: [-8.2751, 115.1668], region: 'Bali central', img: IMG.beratan, desc: 'Temple sobre el llac Bratan. Proposta opcional.' },

  /* ---- Canggu ---- */
  oldmans:      { name: "Old Man's Beach Bar", cat: 'nightlife', ll: [-8.6560, 115.1300], region: 'Canggu', img: IMG.canggu, desc: 'Bar icònic a la platja. Proposta.' },
  nusa_kling:   { name: 'Kelingking Beach — Nusa Penida', cat: 'beach', ll: [-8.7519, 115.4726], region: 'Nusa Penida', img: IMG.nusa, desc: 'La famosa platja del T-Rex. Proposta d\'excursió de dia.' },
  nusa_broken:  { name: 'Broken Beach — Nusa Penida', cat: 'beach', ll: [-8.7256, 115.4478], region: 'Nusa Penida', img: IMG.nusa, desc: 'Arc natural de roca i cala circular. Proposta.' },
  nusa_diamond: { name: 'Diamond Beach — Nusa Penida', cat: 'beach', ll: [-8.7940, 115.6320], region: 'Nusa Penida', desc: 'Penya-segats blancs i aigua turquesa. Proposta.' },
  tanahlot:     { name: 'Temple de Tanah Lot', cat: 'culture', ll: [-8.6212, 115.0868], region: 'Canggu', img: IMG.tanahlot, desc: 'Temple sobre una roca al mar. Proposta (millor al capvespre).' },
  surf_canggu:  { name: 'Surf a Batu Bolong', cat: 'beach', ll: [-8.6570, 115.1290], region: 'Canggu', img: IMG.seminyak, desc: 'Onades per a tots els nivells. Proposta.' },
  yoga:         { name: 'Ioga + massatge', cat: 'adventure', ll: [-8.6500, 115.1360], region: 'Canggu', desc: 'Matí de ioga i massatge relaxant. Proposta.' },
  finns:        { name: "Finn's Beach Club", cat: 'nightlife', ll: [-8.6690, 115.1370], region: 'Canggu', img: IMG.canggu, desc: 'Beach club amb piscines i capvespre sobre el mar. Proposta.' },

  /* ---- Gili ---- */
  horizontal:   { name: 'Horizontal / Reggae Night', cat: 'nightlife', ll: [-8.3490, 116.0380], region: 'Gili T', desc: 'Beach club de dia i reggae night club a la nit. Proposta.' },
  snorkel_turtle:{ name: 'Snorkel amb tortugues', cat: 'sea', ll: [-8.3486, 116.0566], region: 'Gili Meno', desc: 'Les tortugues surten des de la platja nord de Gili Meno. Proposta.' },
  snorkel_shark: { name: 'Snorkel amb taurons punta negra', cat: 'sea', ll: [-8.3600, 116.0400], region: 'Gili T', desc: 'Taurons de punta negra, inofensius, en aigües poc profundes. Proposta.' },
  night_fishing: { name: 'Pesca nocturna amb pescadors locals', cat: 'sea', ll: [-8.3520, 116.0300], region: 'Gili T', desc: 'Sortida en barca amb llums. Proposta.' },

  /* ---- Uluwatu ---- */
  uluwatu_temple:{ name: "Temple d'Uluwatu + Kecak Fire Dance", cat: 'culture', ll: [-8.8291, 115.0849], region: 'Uluwatu', img: IMG.uluwatu, desc: 'Temple al penya-segat i dansa del foc Kecak al capvespre. Proposta.' },
  padangpadang:  { name: 'Padang Padang Beach', cat: 'beach', ll: [-8.8105, 115.1030], region: 'Uluwatu', img: IMG.padang, desc: 'Platja amagada entre roques. Proposta.' },
  thomas:        { name: 'Cliff diving — Thomas Beach', cat: 'adventure', ll: [-8.8180, 115.0930], region: 'Uluwatu', desc: 'Salts des dels penya-segats a aigua turquesa. Proposta.' },

  /* ---- Singapur (final) ---- */
  chinatown:    { name: 'Chinatown + Hawker Chan', cat: 'food', ll: [1.2820, 103.8440], region: 'Singapur', img: IMG.chinatown, desc: 'Barri xinès i dinar amb estrella Michelin. Proposta.' },
  botanic:      { name: 'Botanic Gardens', cat: 'nature', ll: [1.3138, 103.8159], region: 'Singapur', desc: 'Jardins UNESCO, entrada gratuïta. Proposta.' },
  gardensbay:   { name: 'Gardens by the Bay', cat: 'nature', ll: [1.2816, 103.8636], region: 'Singapur', img: IMG.gardensbay, desc: 'Cloud Forest + Flower Dome i Garden Rhapsody als Supertrees. Proposta.' },
  marinabay:    { name: 'Marina Bay + Spectra', cat: 'nightlife', ll: [1.2834, 103.8607], region: 'Singapur', img: IMG.marinabay, desc: 'Capvespre a Marina Bay. Show Spectra i focs del National Day (9 ago). Proposta.' },
  laupasat:     { name: 'Lau Pa Sat satay market', cat: 'food', ll: [1.2807, 103.8504], region: 'Singapur', desc: 'Mercat de menjar amb el carrer de satay al vespre. Proposta.' },
  littleindia:  { name: 'Little India', cat: 'culture', ll: [1.3067, 103.8517], region: 'Singapur', desc: 'Barri indi ple de color, temples i menjar. Proposta.' },
  kampongglam:  { name: 'Kampong Glam', cat: 'culture', ll: [1.3025, 103.8592], region: 'Singapur', img: IMG.kampongglam, desc: 'Barri àrab, la mesquita del Sultan i Haji Lane. Proposta.' },
  raffles:      { name: 'Raffles Hotel — Singapore Sling', cat: 'food', ll: [1.2949, 103.8544], region: 'Singapur', desc: 'El còctel Singapore Sling on es va inventar. Proposta.' },
};

/* ---------------------------------------------------------------------------
 *  VOLS  →  traçades sobre el mapa. Tots confirmats amb bitllet.
 *  who: 'group' (tots) o 'david' (ruta individual, es pinta amb el seu color).
 *  El vol s'il·lumina el dia que coincideix amb 'date'.
 * ------------------------------------------------------------------------- */
const FLIGHTS = [
  /* Grup — Turkish Airlines (BCN·Istanbul·Singapur) + escala KUL cap a Komodo */
  { who: 'group', from: 'bcn',     to: 'ist',     date: '2026-07-22', label: 'BCN → Istanbul (TK1852)' },
  { who: 'group', from: 'ist',     to: 'sin_apt', date: '2026-07-22', label: 'Istanbul → Singapur (TK208)' },
  { who: 'group', from: 'sin_apt', to: 'kul_apt', date: '2026-07-24', label: 'Singapur → Kuala Lumpur (Malaysia Airlines)' },
  { who: 'group', from: 'kul_apt', to: 'lbj_apt', date: '2026-07-24', label: 'Kuala Lumpur → Labuan Bajo (AirAsia)' },
  { who: 'group', from: 'lbj_apt', to: 'dps_apt', date: '2026-07-27', label: 'Labuan Bajo → Denpasar (AirAsia)' },
  { who: 'group', from: 'dps_apt', to: 'sin_apt', date: '2026-08-09', label: 'Denpasar → Singapur (TransNusa)' },
  { who: 'group', from: 'sin_apt', to: 'ist',     date: '2026-08-11', label: 'Singapur → Istanbul (TK209)' },
  { who: 'group', from: 'ist',     to: 'bcn',     date: '2026-08-11', label: 'Istanbul → Barcelona (TK1851)' },

  /* David — Emirates (BCN·Dubai·Denpasar), directe des de Dubai */
  { who: 'david', from: 'bcn',     to: 'dxb_apt', date: '2026-07-26', label: 'David · BCN → Dubai (EK186)' },
  { who: 'david', from: 'dxb_apt', to: 'dps_apt', date: '2026-07-27', label: 'David · Dubai → Denpasar (EK368)' },
  { who: 'david', from: 'dps_apt', to: 'dxb_apt', date: '2026-08-09', label: 'David · Denpasar → Dubai (EK369)' },
  { who: 'david', from: 'dxb_apt', to: 'bcn',     date: '2026-08-10', label: 'David · Dubai → Barcelona (EK255)' },
];

/* ---------------------------------------------------------------------------
 *  DIES  →  timeline
 *  home  : on dormen / on se situen les persones aquell dia
 *  stops : parades/activitats (ids de LOCATIONS) per ajustar la càmera
 * ------------------------------------------------------------------------- */
const DAYS = [
  { date: '2026-07-22', region: 'En vol', title: 'Barcelona → Singapur', home: 'ist',
    stops: ['bcn', 'ist'],
    summary: 'Sortida de Barcelona (T1) amb Turkish Airlines i escala a Istanbul.' },

  { date: '2026-07-23', region: 'Singapur', title: 'Arribada a Singapur', home: 'sin1',
    stops: ['sin_apt', 'sin1'],
    summary: 'Arribada a Changi al matí. Check-in a Spacepod@com i primera nit a Singapur.' },

  { date: '2026-07-24', region: 'Komodo', title: 'Vol a Labuan Bajo (via KUL)', home: 'lbj_hotel',
    stops: ['sin_apt', 'kul_apt', 'lbj_apt', 'lbj_hotel'],
    summary: 'Vol matiner Singapur → Kuala Lumpur → Labuan Bajo. Check-in a Labuan Bajo.' },

  { date: '2026-07-25', region: 'Komodo', title: 'Barco pel Parc de Komodo', home: 'komodo_boat',
    stops: ['komodo_boat', 'padar', 'pink_beach'],
    summary: "Sortida en barco pel Parc Nacional de Komodo. Padar, Pink Beach i nit a bord." },

  { date: '2026-07-26', region: 'Komodo', title: 'Komodo — tornada del barco', home: 'lbj_hotel',
    stops: ['komodo_boat', 'pink_beach', 'lbj_hotel'],
    summary: 'Segon dia de barco i tornada cap a Labuan Bajo. El David surt de Barcelona amb Emirates.' },

  { date: '2026-07-27', region: 'Ubud', title: 'Vol a Bali · s\'uneix el David', home: 'ubud_villa',
    stops: ['lbj_apt', 'dps_apt', 'ubud_villa'],
    summary: 'Vol a Denpasar (13:05 → 14:20). El David arriba amb Emirates (16:35). Nit a Ubud.' },

  { date: '2026-07-28', region: 'Ubud', title: 'Monkey Forest', home: 'ubud_villa',
    stops: ['monkey_forest', 'ubud_market', 'gianyar_market'],
    summary: 'Entrada comprada per al Monkey Forest (09:00). Mercat d\'Ubud i propostes per la tarda.' },

  { date: '2026-07-29', region: 'Ubud', title: 'Dia lliure a Ubud', home: 'ubud_villa',
    stops: ['canyoning', 'balidance'],
    summary: 'Dia sense reserves. Propostes: canyoning, tallers, dansa balinesa.' },

  { date: '2026-07-30', region: 'Nord de Bali', title: 'Cascades del nord (proposta)', home: 'ubud_villa',
    stops: ['sekumpul', 'banyumala'],
    summary: 'Propostes: excursió al nord (Sekumpul + Banyumala). Sense reserva.' },

  { date: '2026-07-31', region: 'Nord de Bali', title: 'Volcà Batur sunrise', home: 'ubud_villa',
    stops: ['batur', 'cooking'],
    summary: 'Caminada reservada al volcà Batur (trobada 03:30). Descans i propostes per la tarda.' },

  { date: '2026-08-01', region: 'Ubud → Canggu', title: 'Trasllat a Canggu', home: 'canggu_villa',
    stops: ['quad', 'jatiluwih', 'canggu_villa', 'oldmans'],
    summary: 'Trasllat i check-in a Canggu. Propostes de camí: quads, arrossars de Jatiluwih.' },

  { date: '2026-08-02', region: 'Nusa Penida', title: 'Nusa Penida (proposta)', home: 'canggu_villa',
    stops: ['nusa_kling', 'nusa_broken', 'nusa_diamond'],
    summary: 'Proposta d\'excursió de dia a Nusa Penida. Sense reserva.' },

  { date: '2026-08-03', region: 'Canggu', title: 'Taller de plata (Kuta)', home: 'canggu_villa',
    stops: ['silver', 'tanahlot', 'surf_canggu'],
    summary: 'Taller de plata reservat a Kuta (09:00). Propostes: Tanah Lot, surf a Batu Bolong.' },

  { date: '2026-08-04', region: 'Canggu', title: 'Dia lliure a Canggu', home: 'canggu_villa',
    stops: ['yoga', 'finns'],
    summary: 'Dia sense reserves. Propostes: ioga, Finn\'s Beach Club. Últim dia del Guillem.' },

  { date: '2026-08-05', region: 'Gili T', title: 'Trasllat als Gili', home: 'gili_villa',
    stops: ['gili_villa', 'horizontal'],
    summary: 'Trasllat a Gili Trawangan i check-in. Propostes: platja + Horizontal / reggae night.' },

  { date: '2026-08-06', region: 'Gili', title: 'Snorkel als Gili (proposta)', home: 'gili_villa',
    stops: ['snorkel_turtle', 'snorkel_shark', 'night_fishing'],
    summary: 'Propostes: snorkel amb tortugues i taurons, pesca nocturna. Sense reserva.' },

  { date: '2026-08-07', region: 'Uluwatu', title: 'Trasllat a Uluwatu', home: 'ulu_villa',
    stops: ['gili_villa', 'ulu_villa', 'padangpadang', 'uluwatu_temple'],
    summary: 'Trasllat a Uluwatu i check-in a Villa Ricca Eco Lodge. Propostes: platja i Kecak.' },

  { date: '2026-08-08', region: 'Uluwatu', title: 'Dia lliure a Uluwatu', home: 'ulu_villa',
    stops: ['padangpadang', 'thomas'],
    summary: 'Dia sense reserves. Propostes: surf, cliff diving, beach club. Última nit a Bali.' },

  { date: '2026-08-09', region: 'Singapur', title: 'Vol a Singapur · National Day', home: 'sin2',
    stops: ['dps_apt', 'sin_apt', 'chinatown', 'gardensbay', 'marinabay'],
    summary: 'Vol a Singapur (07:30 → 09:55). Check-in a Beat. Sports Hostel. Propostes de ciutat. El David marxa al vespre.' },

  { date: '2026-08-10', region: 'Singapur', title: 'Singapur (proposta)', home: 'sin2',
    stops: ['littleindia', 'kampongglam', 'raffles'],
    summary: 'Dia lliure a Singapur. Propostes: Little India, Kampong Glam, Raffles.' },

  { date: '2026-08-11', region: 'En vol', title: 'Tornada a Barcelona', home: 'ist',
    stops: ['sin_apt', 'ist', 'bcn'],
    summary: 'Vol de tornada (10:25) via Istanbul. Arribada a Barcelona al vespre.' },
];

/* ---------------------------------------------------------------------------
 *  HORARIS  →  fil conductor de cada dia (barra lateral dreta)
 *  { t: 'HH:MM', kind, title, loc?, note?, pdf?, ref?, status? }
 *  status: 'rec'  →  proposta/recomanació (sense reserva). Es mostra atenuat.
 *  Sense 'status' i amb pdf/ref  →  confirmat amb ticket.
 * ------------------------------------------------------------------------- */
const SCHEDULES = {
  '2026-07-22': [
    { t: '05:40', kind: 'move',   title: 'Arribada aeroport de Barcelona', loc: 'bcn', note: 'Terminal 1', status: 'rec' },
    { t: '07:40', kind: 'flight', title: 'Vol Barcelona → Istanbul (TK1852)', loc: 'bcn', pdf: 'docs/t/vols-grup-turkish-5b1d2e7a.pdf', ref: 'Turkish Airlines' },
    { t: '12:10', kind: 'flight', title: 'Escala a Istanbul', loc: 'ist' },
    { t: '17:00', kind: 'flight', title: 'Vol Istanbul → Singapur (TK208)', loc: 'ist', pdf: 'docs/t/vols-grup-turkish-5b1d2e7a.pdf', ref: 'Turkish Airlines' },
    { t: '20:00', kind: 'dinner', title: 'Sopar a bord', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir al vol', status: 'rec' },
  ],
  '2026-07-23': [
    { t: '08:45', kind: 'flight', title: 'Arribada a Singapur (Changi)', loc: 'sin_apt' },
    { t: '14:00', kind: 'move',   title: 'Check-in Spacepod@com', loc: 'sin1', pdf: 'docs/t/singapur-2324-8f3017e9.pdf', ref: 'Booking 6648.912.254' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar a Singapur', status: 'rec' },
    { t: '15:00', kind: 'free',   title: 'Passeig i descans', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'sin1', status: 'rec' },
  ],
  '2026-07-24': [
    { t: '04:00', kind: 'wake',   title: 'Despertar — direcció aeroport', status: 'rec' },
    { t: '06:20', kind: 'flight', title: 'Vol Singapur → Kuala Lumpur (Malaysia Airlines)', loc: 'sin_apt' },
    { t: '10:45', kind: 'flight', title: 'Vol Kuala Lumpur → Labuan Bajo (AirAsia)', loc: 'kul_apt' },
    { t: '14:25', kind: 'flight', title: 'Arribada a Labuan Bajo', loc: 'lbj_apt' },
    { t: '15:30', kind: 'move',   title: 'Check-in hotel', loc: 'lbj_hotel', pdf: 'docs/t/labuanbajo-2425-8c3347f6.pdf' },
    { t: '19:30', kind: 'dinner', title: 'Sopar a Labuan Bajo', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'lbj_hotel', status: 'rec' },
  ],
  '2026-07-25': [
    { t: '07:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '08:00', kind: 'flight', title: 'Embarcament — barco Komodo (2D/1N)', loc: 'komodo_boat', pdf: 'docs/t/komodo-boat-0d773f2f.pdf', ref: 'GetYourGuide' },
    { t: '11:00', kind: 'act',    title: 'Illa de Padar (inclòs)', loc: 'padar' },
    { t: '15:00', kind: 'act',    title: 'Pink Beach — snorkel (inclòs)', loc: 'pink_beach' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar a bord (inclòs)' },
    { t: '20:00', kind: 'dinner', title: 'Sopar a bord (inclòs)' },
    { t: '22:30', kind: 'sleep',  title: 'Nit a bord', loc: 'komodo_boat' },
  ],
  '2026-07-26': [
    { t: '06:00', kind: 'wake',   title: 'Sortida del sol al barco', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Snorkel i illes (inclòs)', loc: 'pink_beach' },
    { t: '16:00', kind: 'move',   title: 'Tornada a Labuan Bajo', loc: 'lbj_hotel', pdf: 'docs/t/labuanbajo-2627-6775f0a9.pdf' },
    { t: '16:00', kind: 'flight', title: 'David · BCN → Dubai (EK186, 16:00)', loc: 'bcn', pdf: 'docs/t/vols-david-emirates-c94f6a13.pdf', ref: 'Emirates FGIU2J' },
    { t: '20:00', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'lbj_hotel', status: 'rec' },
  ],
  '2026-07-27': [
    { t: '08:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '11:00', kind: 'move',   title: "Cap a l'aeroport", loc: 'lbj_apt', status: 'rec' },
    { t: '13:05', kind: 'flight', title: 'Vol Labuan Bajo → Denpasar', loc: 'lbj_apt' },
    { t: '14:20', kind: 'flight', title: 'Arribada a Bali (Denpasar)', loc: 'dps_apt' },
    { t: '16:35', kind: 'flight', title: 'El David arriba a Bali (EK368, Dubai → Denpasar)', loc: 'dps_apt', pdf: 'docs/t/vols-david-emirates-c94f6a13.pdf', ref: 'Emirates FGIU2J' },
    { t: '18:00', kind: 'move',   title: 'Trasllat a Ubud — check-in', loc: 'ubud_villa', pdf: 'docs/t/ubud-271-47844e7f.pdf', ref: 'Airbnb HM3PZZDKEP' },
    { t: '21:00', kind: 'dinner', title: 'Sopar tots junts a Ubud', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa', status: 'rec' },
  ],
  '2026-07-28': [
    { t: '07:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '08:00', kind: 'breakfast', title: 'Esmorzar (inclòs a la casa)', loc: 'ubud_villa', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Sacred Monkey Forest', loc: 'monkey_forest', pdf: 'docs/t/monkey-forest-dae34ad5.pdf', ref: 'Megatix 1535 5432 50' },
    { t: '11:30', kind: 'act',    title: "Ubud Traditional Market (proposta)", loc: 'ubud_market', status: 'rec' },
    { t: '13:30', kind: 'lunch',  title: 'Dinar a Ubud', status: 'rec' },
    { t: '19:30', kind: 'dinner', title: 'Mercat nocturn de Gianyar (proposta)', loc: 'gianyar_market', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa', status: 'rec' },
  ],
  '2026-07-29': [
    { t: '08:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Canyoning (proposta)', loc: 'canyoning', status: 'rec' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar', status: 'rec' },
    { t: '16:00', kind: 'free',   title: 'Temps lliure / tallers (proposta)', status: 'rec' },
    { t: '21:00', kind: 'act',    title: 'Dansa balinesa (proposta)', loc: 'balidance', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa', status: 'rec' },
  ],
  '2026-07-30': [
    { t: '06:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:30', kind: 'act',    title: 'Cascada Sekumpul (proposta)', loc: 'sekumpul', status: 'rec' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar de camí', status: 'rec' },
    { t: '14:30', kind: 'act',    title: 'Banyumala Twin Waterfall (proposta)', loc: 'banyumala', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa', status: 'rec' },
  ],
  '2026-07-31': [
    { t: '03:00', kind: 'wake',   title: 'Despertar (Batur sunrise)', status: 'rec' },
    { t: '03:30', kind: 'act',    title: 'Caminada al volcà Batur (trobada 03:30)', loc: 'batur', pdf: 'docs/t/batur-hike-2c6449d1.pdf', ref: 'GetYourGuide GYG7VKWBNXVB' },
    { t: '10:00', kind: 'move',   title: 'Tornada — descans al migdia', status: 'rec' },
    { t: '18:00', kind: 'act',    title: 'Classe de cuina balinesa (proposta)', loc: 'cooking', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa', status: 'rec' },
  ],
  '2026-08-01': [
    { t: '07:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Ruta en quads (proposta)', loc: 'quad', status: 'rec' },
    { t: '12:30', kind: 'lunch',  title: 'Dinar', status: 'rec' },
    { t: '14:00', kind: 'act',    title: 'Arrossars de Jatiluwih (proposta)', loc: 'jatiluwih', status: 'rec' },
    { t: '15:00', kind: 'move',   title: 'Trasllat a Canggu — check-in', loc: 'canggu_villa', pdf: 'docs/t/canggu-15-7aca5475.pdf', ref: 'Airbnb HMZA5KBEF9' },
    { t: '21:00', kind: 'dinner', title: "Old Man's Beach Bar (proposta)", loc: 'oldmans', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa', status: 'rec' },
  ],
  '2026-08-02': [
    { t: '05:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '07:00', kind: 'move',   title: 'Ferry a Nusa Penida (proposta)', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Kelingking Beach (proposta)', loc: 'nusa_kling', status: 'rec' },
    { t: '11:00', kind: 'act',    title: 'Broken Beach (proposta)', loc: 'nusa_broken', status: 'rec' },
    { t: '15:00', kind: 'act',    title: 'Diamond Beach (proposta)', loc: 'nusa_diamond', status: 'rec' },
    { t: '20:30', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa', status: 'rec' },
  ],
  '2026-08-03': [
    { t: '07:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Taller de plata a Kuta (09:00)', loc: 'silver', pdf: 'docs/t/silver-workshop-690f40ab.pdf', ref: 'Klook CHM958033' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar', status: 'rec' },
    { t: '16:00', kind: 'act',    title: 'Tanah Lot / surf (proposta)', loc: 'tanahlot', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa', status: 'rec' },
  ],
  '2026-08-04': [
    { t: '08:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:30', kind: 'act',    title: 'Ioga + massatge (proposta)', loc: 'yoga', status: 'rec' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar', status: 'rec' },
    { t: '15:00', kind: 'act',    title: "Finn's Beach Club (proposta)", loc: 'finns', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Últim sopar amb el Guillem', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa', status: 'rec' },
  ],
  '2026-08-05': [
    { t: '06:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '07:30', kind: 'flight', title: 'El Guillem marxa cap a casa', status: 'rec' },
    { t: '09:00', kind: 'move',   title: 'Fast boat a Gili Trawangan (proposta)', loc: 'gili_villa', status: 'rec' },
    { t: '14:00', kind: 'move',   title: 'Check-in Gili T', loc: 'gili_villa', pdf: 'docs/t/gili-57-3801e88b.pdf', ref: 'Airbnb HM9K5XDYA2' },
    { t: '15:00', kind: 'free',   title: 'Platja a Gili T', status: 'rec' },
    { t: '22:00', kind: 'act',    title: 'Horizontal / reggae night (proposta)', loc: 'horizontal', status: 'rec' },
    { t: '01:00', kind: 'sleep',  title: 'Dormir', loc: 'gili_villa', status: 'rec' },
  ],
  '2026-08-06': [
    { t: '08:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '10:00', kind: 'act',    title: 'Snorkel amb tortugues (proposta)', loc: 'snorkel_turtle', status: 'rec' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar', status: 'rec' },
    { t: '15:00', kind: 'act',    title: 'Snorkel taurons punta negra (proposta)', loc: 'snorkel_shark', status: 'rec' },
    { t: '20:30', kind: 'act',    title: 'Pesca nocturna (proposta)', loc: 'night_fishing', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'gili_villa', status: 'rec' },
  ],
  '2026-08-07': [
    { t: '06:30', kind: 'wake',   title: "Despertar (ferry d'hora)", status: 'rec' },
    { t: '08:00', kind: 'move',   title: 'Ferry cap a Bali (proposta)', loc: 'gili_villa', status: 'rec' },
    { t: '14:00', kind: 'move',   title: 'Check-in Villa Ricca Eco Lodge', loc: 'ulu_villa', pdf: 'docs/t/uluwatu-79-3e01b4bf.pdf', ref: 'Booking Villa Ricca' },
    { t: '15:00', kind: 'act',    title: 'Platja Padang Padang (proposta)', loc: 'padangpadang', status: 'rec' },
    { t: '18:00', kind: 'act',    title: 'Kecak Fire Dance al temple (proposta)', loc: 'uluwatu_temple', status: 'rec' },
    { t: '20:30', kind: 'dinner', title: 'Sopar', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ulu_villa', status: 'rec' },
  ],
  '2026-08-08': [
    { t: '07:30', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '09:00', kind: 'act',    title: 'Surf (proposta)', loc: 'padangpadang', status: 'rec' },
    { t: '12:00', kind: 'act',    title: 'Cliff diving a Thomas Beach (proposta)', loc: 'thomas', status: 'rec' },
    { t: '16:00', kind: 'free',   title: 'Beach club / platja', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Sopar — última nit a Bali', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ulu_villa', status: 'rec' },
  ],
  '2026-08-09': [
    { t: '04:30', kind: 'wake',   title: 'Despertar (vol matiner)', status: 'rec' },
    { t: '05:00', kind: 'move',   title: "Cap a l'aeroport de Denpasar", loc: 'dps_apt', status: 'rec' },
    { t: '07:30', kind: 'flight', title: 'Vol Denpasar → Singapur (TransNusa)', loc: 'dps_apt' },
    { t: '09:55', kind: 'flight', title: 'Arribada a Singapur', loc: 'sin_apt' },
    { t: '12:00', kind: 'move',   title: 'Check-in Beat. Sports Hostel', loc: 'sin2', pdf: 'docs/t/singapur-911-8e67d5c6.pdf', ref: 'Booking 1598739346091366' },
    { t: '16:30', kind: 'act',    title: 'Gardens by the Bay (proposta)', loc: 'gardensbay', status: 'rec' },
    { t: '19:00', kind: 'act',    title: 'Marina Bay + focs National Day (proposta)', loc: 'marinabay', status: 'rec' },
    { t: '19:45', kind: 'flight', title: 'El David marxa (EK369, Denpasar → Dubai)', loc: 'dps_apt', pdf: 'docs/t/vols-david-emirates-c94f6a13.pdf', ref: 'Emirates FGIU2J' },
    { t: '21:30', kind: 'dinner', title: 'Sopar (proposta)', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'sin2', status: 'rec' },
  ],
  '2026-08-10': [
    { t: '08:35', kind: 'flight', title: 'El David arriba a Barcelona (EK255)', loc: 'bcn', pdf: 'docs/t/vols-david-emirates-c94f6a13.pdf', ref: 'Emirates FGIU2J' },
    { t: '09:00', kind: 'wake',   title: 'Despertar', status: 'rec' },
    { t: '10:30', kind: 'act',    title: 'Little India (proposta)', loc: 'littleindia', status: 'rec' },
    { t: '14:00', kind: 'act',    title: 'Kampong Glam (proposta)', loc: 'kampongglam', status: 'rec' },
    { t: '16:00', kind: 'act',    title: 'Singapore Sling al Raffles (proposta)', loc: 'raffles', status: 'rec' },
    { t: '20:00', kind: 'dinner', title: 'Últim sopar del viatge', status: 'rec' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'sin2', status: 'rec' },
  ],
  '2026-08-11': [
    { t: '06:30', kind: 'wake',   title: 'Despertar :))', status: 'rec' },
    { t: '08:00', kind: 'move',   title: 'Cap a Changi', loc: 'sin_apt', status: 'rec' },
    { t: '10:25', kind: 'flight', title: 'Vol Singapur → Istanbul (TK209)', loc: 'sin_apt', pdf: 'docs/t/vols-grup-turkish-5b1d2e7a.pdf', ref: 'Turkish Airlines' },
    { t: '16:40', kind: 'flight', title: 'Escala a Istanbul', loc: 'ist' },
    { t: '20:25', kind: 'flight', title: 'Vol Istanbul → Barcelona (TK1851)', loc: 'ist', pdf: 'docs/t/vols-grup-turkish-5b1d2e7a.pdf', ref: 'Turkish Airlines' },
    { t: '23:15', kind: 'flight', title: 'Arribada a Barcelona ✈️', loc: 'bcn' },
  ],
};

/* Ordena cada horari per hora i enllaça'l amb el seu dia */
DAYS.forEach(d => {
  const s = (SCHEDULES[d.date] || []).slice().sort((a, b) => a.t.localeCompare(b.t));
  d.schedule = s;
});
