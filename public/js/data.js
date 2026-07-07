/* ============================================================================
 *  DADES DEL VIATGE — Singapur · Komodo · Bali · Gili · Uluwatu
 *  Estructura central de dades. Tota la web es construeix a partir d'aquí.
 *  Dates en format ISO (YYYY-MM-DD). Coordenades en [lat, lng].
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  PERSONES
 *  present.from / present.to  →  primer i últim dia (inclosos) que hi són.
 *  Per defecte tothom fa el viatge sencer (22 jul → 11 ago) tret de:
 *    · David   s'uneix a Bali el 27 jul i marxa el 10 ago  → present 27/07–09/08
 *    · Guillem marxa abans dels Gili el 5 ago              → present 22/07–04/08
 * ------------------------------------------------------------------------- */
const PEOPLE = [
  { id: 'jia',     name: 'Jia',     color: '#FF6B6B', from: '2026-07-22', to: '2026-08-11' },
  { id: 'david',   name: 'David',   color: '#4D96FF', from: '2026-07-27', to: '2026-08-09',
    // El David surt de Bali el vespre del 9 ago (no va a Singapur amb el grup).
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
 *  IMATGES  →  fotos (Wikimedia). Per als allotjaments pots enganxar aquí la
 *  foto real de Booking/Airbnb: només cal posar la URL de la imatge.
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
 *  pdfs: [{ label, file }] rebuts de reserva (a public/docs/)
 * ------------------------------------------------------------------------- */
const LOCATIONS = {
  /* ---- Aeroports / punts de vol ---- */
  bcn: { name: 'Aeroport de Barcelona (BCN)', cat: 'flight', ll: [41.2974, 2.0833], desc: 'Terminal 1. Sortida amb Turkish Airlines via Istanbul.' },
  ist: { name: 'Istanbul Airport (IST)',       cat: 'flight', ll: [41.2753, 28.7519], desc: 'Escala amb Turkish Airlines.' },
  sin_apt: { name: 'Singapore Changi (SIN)',   cat: 'flight', ll: [1.3644, 103.9915], desc: "Aeroport d'entrada i sortida del viatge." },
  lbj_apt: { name: 'Komodo Airport (LBJ)',     cat: 'flight', ll: [-8.4867, 119.8877], desc: 'Aeroport de Labuan Bajo, porta al Parc Nacional de Komodo.' },
  dps_apt: { name: 'Denpasar — Ngurah Rai (DPS)', cat: 'flight', ll: [-8.7482, 115.1675], desc: 'Aeroport de Bali.' },
  dxb_apt: { name: 'Dubai International (DXB)', cat: 'flight', ll: [25.2532, 55.3657], desc: "Escala del David amb Emirates." },
  kul_apt: { name: 'Kuala Lumpur (KUL)',       cat: 'flight', ll: [2.7456, 101.7072], desc: "Escala del David a l'anada (Batik Air)." },

  /* ---- Allotjaments ---- */
  sin1: { name: 'ibis budget Singapore Crystal', cat: 'lodging', ll: [1.3329, 103.7436], region: 'Singapur',
          desc: "1 nit (23–24 jul). Opció econòmica tirant cap a l'aeroport.", price: '~217 €/nit',
          link: 'https://www.google.com/search?q=ibis+budget+Singapore+Crystal', linkLabel: 'Cercar hotel',
          pdfs: [{ label: 'Reserva Singapur (23–24 jul)', file: 'docs/singapur-23-24.pdf' }] },
  lbj_hotel: { name: 'Hotel Labuan Bajo', cat: 'lodging', ll: [-8.4956, 119.8770], region: 'Komodo', img: IMG.labuanbajo,
          desc: 'Check-in en arribar (24 jul). Esmorzar inclòs. Base abans i després del barco.',
          pdfs: [{ label: 'Reserva Labuan Bajo (24–25 jul)', file: 'docs/labuanbajo-24-25.pdf' },
                 { label: 'Reserva Labuan Bajo (26–27 jul)', file: 'docs/labuanbajo-26-27.pdf' }] },
  ubud_villa: { name: 'Villa Mandi Ubud', cat: 'lodging', ll: [-8.5069, 115.2625], region: 'Ubud', img: IMG.ubud,
          desc: '5 nits (27 jul – 1 ago). Esmorzar inclòs. Alternatives: The Jungle Villa (129 €) o Villa Eden.', price: '~85 €/nit',
          link: 'https://www.booking.com/searchresults.html?ss=Villa+Mandi+Ubud', linkLabel: 'Booking' },
  canggu_villa: { name: 'Villa Canggu South', cat: 'lodging', ll: [-8.6478, 115.1385], region: 'Canggu', img: IMG.canggu,
          desc: '4 nits (1–5 ago). A prop de Nelayan Beach. Alternativa: Villa M Villa 318 (5BR).',
          link: 'https://www.baliluxuryvillas.com/es/villa/villa-canggu-south', linkLabel: 'Veure villa' },
  gili_villa: { name: 'Semeton Villas — Gili Trawangan', cat: 'lodging', ll: [-8.3505, 116.0410], region: 'Gili T',
          desc: '2 nits (5–7 ago). Opció econòmica. Alternativa: KOA One Dreamy 4BR Villa.', price: '~46 €/nit',
          link: 'https://www.casai.com/property/semeton-villas/BC-14540888', linkLabel: 'Casai' },
  ulu_villa: { name: 'Khajuraho 4BR Villa', cat: 'lodging', ll: [-8.8290, 115.0849], region: 'Uluwatu', img: IMG.uluwatu,
          desc: '2 nits (7–9 ago). Villa amb billar. Alternativa: Villa Feronia (clifftop).', price: '~700 $/nit',
          link: 'https://balicomfyvillas.com/properties/khajuraho-4-bedroom-villa/', linkLabel: 'Veure villa',
          pdfs: [{ label: 'Reserva Uluwatu (7–9 ago)', file: 'docs/uluwatu-7-9.pdf' }] },
  sin2: { name: 'Pleasant 2BR — Clarke Quay (x2)', cat: 'lodging', ll: [1.2884, 103.8470], region: 'Singapur',
          desc: '2 nits (9–11 ago). Dos apartaments de 2BR (4 pax cadascun). Piscina i gym, a 200 m de Fort Canning MRT.', price: '~400–550 $/nit c/u',
          link: 'https://singaporeholidayrentals.com/property/2-bedroom-in-clarke-quay-3-mins-stroll-to-mrt/HA-3214400074', linkLabel: 'Veure apartament',
          pdfs: [{ label: 'Reserva Singapur (9–11 ago)', file: 'docs/singapur-9-11.pdf' }] },

  /* ---- Komodo ---- */
  komodo_boat:  { name: 'Barco — Parc Nacional de Komodo', cat: 'sea', ll: [-8.5680, 119.6110], region: 'Komodo', img: IMG.komodo,
          desc: 'Sortida en barco pel parc. Illes de Komodo, Padar i Pink Beach. Nit a bord.' },
  padar:  { name: 'Illa de Padar', cat: 'nature', ll: [-8.6520, 119.5820], region: 'Komodo', desc: 'El mirador més icònic de Komodo: tres badies i platges de colors.' },
  pink_beach: { name: 'Pink Beach', cat: 'beach', ll: [-8.5300, 119.5170], region: 'Komodo', desc: 'Platja de sorra rosada, snorkel entre corals.' },

  /* ---- Ubud ---- */
  ubud_market:  { name: 'Ubud Traditional Market', cat: 'market', ll: [-8.5075, 115.2626], region: 'Ubud', img: IMG.ubud, desc: "Mercat del matí al cor d'Ubud. Artesania, teles i souvenirs." },
  monkey_forest:{ name: 'Sacred Monkey Forest', cat: 'nature', ll: [-8.5188, 115.2588], region: 'Ubud', img: IMG.monkey, desc: 'Santuari amb macacos entre temples i figueres. ~5 € entrada.' },
  offerings:    { name: "Taller d'ofrenes (canang sari)", cat: 'culture', ll: [-8.5100, 115.2620], region: 'Ubud', desc: 'Taller opcional per aprendre a fer les ofrenes balineses. *si dóna temps.' },
  gianyar_market:{ name: 'Mercat nocturn de Gianyar', cat: 'food', ll: [-8.5426, 115.3269], region: 'Ubud', desc: 'Menjar de carrer balinès autèntic al vespre.' },
  canyoning:    { name: 'Canyoning', cat: 'adventure', ll: [-8.4230, 115.3200], region: 'Ubud', desc: 'Descens de canyons entre cascades. Activitat de matí.' },
  silver:       { name: 'Taller de plata (Celuk)', cat: 'culture', ll: [-8.5847, 115.2717], region: 'Ubud', desc: "Fes el teu propi anell de plata al poble d'orfebres de Celuk." },
  balidance:    { name: 'Dansa tradicional balinesa', cat: 'culture', ll: [-8.5069, 115.2630], region: 'Ubud', desc: 'Espectacle de dansa a la nit. *opcional.' },
  sekumpul:     { name: 'Cascada Sekumpul', cat: 'nature', ll: [-8.1594, 115.1236], region: 'Nord de Bali', desc: 'La cascada més espectacular de Bali. Excursió de dia sencer al nord.' },
  banyumala:    { name: 'Banyumala Twin Waterfall', cat: 'nature', ll: [-8.2497, 115.1207], region: 'Nord de Bali', desc: 'Cascada bessona amb piscina natural, ideal per banyar-se.' },
  batur:        { name: 'Volcà Batur — sunrise', cat: 'adventure', ll: [-8.2422, 115.3752], region: 'Nord de Bali', img: IMG.batur, desc: "Trekking nocturn (sortida 3am) per veure la sortida del sol al cim. Torn ~10am." },
  cooking:      { name: 'Classe de cuina balinesa', cat: 'food', ll: [-8.5090, 115.2600], region: 'Ubud', desc: 'Classe per sopar cuinant plats típics balinesos.' },
  quad:         { name: 'Quads / ATV', cat: 'adventure', ll: [-8.4820, 115.2400], region: 'Ubud', desc: 'Ruta en quads entre arrossars i jungla. Activitat de matí.' },
  jatiluwih:    { name: 'Arrossars de Jatiluwih', cat: 'nature', ll: [-8.3705, 115.1315], region: 'Bali central', desc: 'Terrasses d\'arròs Patrimoni de la UNESCO. De camí cap a Canggu.' },
  beratan:      { name: 'Temple Ulun Danu Beratan', cat: 'culture', ll: [-8.2751, 115.1668], region: 'Bali central', img: IMG.beratan, desc: 'Temple sobre el llac Bratan. Opcional si queden forces (45 min de Jatiluwih).' },

  /* ---- Canggu ---- */
  oldmans:      { name: "Old Man's Beach Bar", cat: 'nightlife', ll: [-8.6560, 115.1300], region: 'Canggu', img: IMG.canggu, desc: 'Bar icònic a la platja. Ambient surfista i cervesa Bintang.' },
  nusa_kling:   { name: 'Kelingking Beach — Nusa Penida', cat: 'beach', ll: [-8.7519, 115.4726], region: 'Nusa Penida', img: IMG.nusa, desc: 'La famosa platja del T-Rex. Excursió de dia sencer.' },
  nusa_broken:  { name: 'Broken Beach — Nusa Penida', cat: 'beach', ll: [-8.7256, 115.4478], region: 'Nusa Penida', img: IMG.nusa, desc: 'Arc natural de roca i cala circular.' },
  nusa_diamond: { name: 'Diamond Beach — Nusa Penida', cat: 'beach', ll: [-8.7940, 115.6320], region: 'Nusa Penida', desc: 'Penya-segats blancs i aigua turquesa.' },
  tanahlot:     { name: 'Temple de Tanah Lot', cat: 'culture', ll: [-8.6212, 115.0868], region: 'Canggu', img: IMG.tanahlot, desc: 'Temple sobre una roca al mar. Millor a la sortida del sol.' },
  surf_canggu:  { name: 'Surf a Batu Bolong', cat: 'beach', ll: [-8.6570, 115.1290], region: 'Canggu', img: IMG.seminyak, desc: 'Onades per a tots els nivells. Instructor recomanat el primer dia.' },
  yoga:         { name: 'Ioga + massatge', cat: 'adventure', ll: [-8.6500, 115.1360], region: 'Canggu', desc: 'Matí de ioga i massatge relaxant.' },
  finns:        { name: "Finn's Beach Club", cat: 'nightlife', ll: [-8.6690, 115.1370], region: 'Canggu', img: IMG.canggu, desc: 'Beach club amb piscines i capvespre sobre el mar.' },

  /* ---- Gili ---- */
  horizontal:   { name: 'Horizontal / Reggae Night', cat: 'nightlife', ll: [-8.3490, 116.0380], region: 'Gili T', desc: 'Beach club de dia i reggae night club a la nit.' },
  snorkel_turtle:{ name: 'Snorkel amb tortugues', cat: 'sea', ll: [-8.3486, 116.0566], region: 'Gili Meno', desc: 'Les tortugues surten des de la platja nord de Gili Meno.' },
  snorkel_shark: { name: 'Snorkel amb taurons punta negra', cat: 'sea', ll: [-8.3600, 116.0400], region: 'Gili T', desc: 'Taurons de punta negra, inofensius, en aigües poc profundes.' },
  night_fishing: { name: 'Pesca nocturna amb pescadors locals', cat: 'sea', ll: [-8.3520, 116.0300], region: 'Gili T', desc: 'Sortida en barca amb llums. Sopar el que pesqueu. Sense allargar-se: ferry d\'hora.' },

  /* ---- Uluwatu ---- */
  uluwatu_temple:{ name: "Temple d'Uluwatu + Kecak Fire Dance", cat: 'culture', ll: [-8.8291, 115.0849], region: 'Uluwatu', img: IMG.uluwatu, desc: 'Temple al penya-segat i dansa del foc Kecak al capvespre.' },
  padangpadang:  { name: 'Padang Padang Beach', cat: 'beach', ll: [-8.8105, 115.1030], region: 'Uluwatu', img: IMG.padang, desc: 'Platja amagada entre roques. ~5 € accés.' },
  thomas:        { name: 'Cliff diving — Thomas Beach', cat: 'adventure', ll: [-8.8180, 115.0930], region: 'Uluwatu', desc: 'Salts des dels penya-segats a aigua turquesa.' },

  /* ---- Singapur (final) ---- */
  chinatown:    { name: 'Chinatown + Hawker Chan', cat: 'food', ll: [1.2820, 103.8440], region: 'Singapur', img: IMG.chinatown, desc: 'Barri xinès i dinar amb estrella Michelin (Hawker Chan / Tai Hwa Pork Noodle).' },
  botanic:      { name: 'Botanic Gardens', cat: 'nature', ll: [1.3138, 103.8159], region: 'Singapur', desc: 'Jardins UNESCO, entrada gratuïta. National Orchid Garden ~5 SGD.' },
  gardensbay:   { name: 'Gardens by the Bay', cat: 'nature', ll: [1.2816, 103.8636], region: 'Singapur', img: IMG.gardensbay, desc: 'Cloud Forest + Flower Dome. Garden Rhapsody als Supertrees a les 19:45 i 20:45.' },
  marinabay:    { name: 'Marina Bay + Spectra', cat: 'nightlife', ll: [1.2834, 103.8607], region: 'Singapur', img: IMG.marinabay, desc: 'Capvespre a Marina Bay. Show Spectra i focs del National Day (9 ago).' },
  laupasat:     { name: 'Lau Pa Sat satay market', cat: 'food', ll: [1.2807, 103.8504], region: 'Singapur', desc: 'Mercat de menjar amb el carrer de satay al vespre.' },
  littleindia:  { name: 'Little India', cat: 'culture', ll: [1.3067, 103.8517], region: 'Singapur', desc: 'Barri indi ple de color, temples i menjar.' },
  kampongglam:  { name: 'Kampong Glam', cat: 'culture', ll: [1.3025, 103.8592], region: 'Singapur', img: IMG.kampongglam, desc: 'Barri àrab, la mesquita del Sultan i Haji Lane.' },
  raffles:      { name: 'Raffles Hotel — Singapore Sling', cat: 'food', ll: [1.2949, 103.8544], region: 'Singapur', desc: 'El còctel Singapore Sling on es va inventar. Últim brindis del viatge.' },
};

/* ---------------------------------------------------------------------------
 *  VOLS  →  traçades sobre el mapa
 *  who: 'group' (tots) o l'id d'una persona (ruta individual, es pinta amb
 *  el seu color). El vol s'il·lumina el dia que coincideix amb 'date'.
 * ------------------------------------------------------------------------- */
const FLIGHTS = [
  /* Grup — Turkish Airlines via Istanbul */
  { who: 'group', from: 'bcn',     to: 'ist',     date: '2026-07-22', label: 'BCN → Istanbul' },
  { who: 'group', from: 'ist',     to: 'sin_apt', date: '2026-07-22', label: 'Istanbul → Singapur' },
  { who: 'group', from: 'sin_apt', to: 'lbj_apt', date: '2026-07-24', label: 'Singapur → Labuan Bajo' },
  { who: 'group', from: 'lbj_apt', to: 'dps_apt', date: '2026-07-27', label: 'Labuan Bajo → Denpasar' },
  { who: 'group', from: 'dps_apt', to: 'sin_apt', date: '2026-08-09', label: 'Denpasar → Singapur' },
  { who: 'group', from: 'sin_apt', to: 'ist',     date: '2026-08-11', label: 'Singapur → Istanbul' },
  { who: 'group', from: 'ist',     to: 'bcn',     date: '2026-08-11', label: 'Istanbul → Barcelona' },

  /* David — Emirates via Dubai (+ Batik Air via Kuala Lumpur a l'anada) */
  { who: 'david', from: 'bcn',     to: 'dxb_apt', date: '2026-07-26', label: 'David · BCN → Dubai' },
  { who: 'david', from: 'dxb_apt', to: 'kul_apt', date: '2026-07-27', label: 'David · Dubai → Kuala Lumpur' },
  { who: 'david', from: 'kul_apt', to: 'dps_apt', date: '2026-07-27', label: 'David · Kuala Lumpur → Denpasar' },
  { who: 'david', from: 'dps_apt', to: 'dxb_apt', date: '2026-08-09', label: 'David · Denpasar → Dubai' },
  { who: 'david', from: 'dxb_apt', to: 'bcn',     date: '2026-08-10', label: 'David · Dubai → Barcelona' },
];

/* ---------------------------------------------------------------------------
 *  DIES  →  timeline
 *  home  : on dormen / on se situen les persones aquell dia
 *  stops : parades/activitats (ids de LOCATIONS) per ajustar la càmera
 *  (els vols s'il·luminen automàticament segons la data — veure FLIGHTS)
 * ------------------------------------------------------------------------- */
const DAYS = [
  { date: '2026-07-22', region: 'En vol', title: 'Barcelona → Singapur', home: 'ist',
    stops: ['bcn', 'ist'],
    summary: 'Sortida de Barcelona (T1) amb Turkish Airlines i escala a Istanbul.' },

  { date: '2026-07-23', region: 'Singapur', title: 'Arribada a Singapur', home: 'sin1',
    stops: ['sin_apt', 'sin1'],
    summary: 'Arribada a Changi a les 8:45. Check-in i primera nit a Singapur.' },

  { date: '2026-07-24', region: 'Komodo', title: 'Vol a Labuan Bajo', home: 'lbj_hotel',
    stops: ['lbj_apt', 'lbj_hotel'],
    summary: 'Vol matiner (6:20) a Komodo, arribada 14:45. Check-in a Labuan Bajo.' },

  { date: '2026-07-25', region: 'Komodo', title: 'Barco pel Parc de Komodo', home: 'komodo_boat',
    stops: ['komodo_boat', 'padar', 'pink_beach'],
    summary: "Sortida en barco pel Parc Nacional de Komodo. Padar, Pink Beach i nit a bord." },

  { date: '2026-07-26', region: 'Komodo', title: 'Komodo — tornada del barco', home: 'komodo_boat',
    stops: ['komodo_boat', 'pink_beach', 'lbj_hotel'],
    summary: 'Segon dia de barco i tornada cap a Labuan Bajo al vespre.' },

  { date: '2026-07-27', region: 'Ubud', title: 'Vol a Bali · s\'uneix el David', home: 'ubud_villa',
    stops: ['lbj_apt', 'dps_apt', 'ubud_villa'],
    summary: 'Vol a Denpasar (13:05 → 14:20). El David s\'uneix al grup. Arribada a Ubud al vespre.' },

  { date: '2026-07-28', region: 'Ubud', title: 'Ubud market · Monkey Forest', home: 'ubud_villa',
    stops: ['ubud_market', 'monkey_forest', 'offerings', 'gianyar_market'],
    summary: 'Mercat d\'Ubud (matí) → Monkey Forest (migdia) → taller d\'ofrenes → mercat nocturn de Gianyar.' },

  { date: '2026-07-29', region: 'Ubud', title: 'Canyoning · taller de plata', home: 'ubud_villa',
    stops: ['canyoning', 'silver', 'balidance'],
    summary: 'Canyoning (matí) → taller d\'anells de plata (tarda) → dansa balinesa (nit, opcional).' },

  { date: '2026-07-30', region: 'Nord de Bali', title: 'Cascades del nord', home: 'ubud_villa',
    stops: ['sekumpul', 'banyumala'],
    summary: 'Dia sencer al nord: cascada Sekumpul + Banyumala Twin Waterfall.' },

  { date: '2026-07-31', region: 'Nord de Bali', title: 'Volcà Batur sunrise', home: 'ubud_villa',
    stops: ['batur', 'cooking'],
    summary: 'Sortida del sol al volcà Batur (sortida 3am) → descans → classe de cuina balinesa (vespre).' },

  { date: '2026-08-01', region: 'Ubud → Canggu', title: 'Quads · Jatiluwih · trasllat', home: 'canggu_villa',
    stops: ['quad', 'jatiluwih', 'beratan', 'canggu_villa', 'oldmans'],
    summary: 'Quads (matí) → arrossars de Jatiluwih (tarda) → trasllat a Canggu → Old Man\'s a la nit.' },

  { date: '2026-08-02', region: 'Nusa Penida', title: 'Excursió a Nusa Penida', home: 'canggu_villa',
    stops: ['nusa_kling', 'nusa_broken', 'nusa_diamond'],
    summary: 'Dia sencer a Nusa Penida: Kelingking, Broken Beach i Diamond Beach.' },

  { date: '2026-08-03', region: 'Canggu', title: 'Tanah Lot · surf', home: 'canggu_villa',
    stops: ['tanahlot', 'surf_canggu'],
    summary: 'Tanah Lot a la sortida del sol → surf i platja a Batu Bolong.' },

  { date: '2026-08-04', region: 'Canggu', title: 'Ioga · Finn\'s Beach Club', home: 'canggu_villa',
    stops: ['yoga', 'finns'],
    summary: 'Ioga i massatge (matí) → Finn\'s Beach Club. Últim dia del Guillem.' },

  { date: '2026-08-05', region: 'Gili T', title: 'Trasllat als Gili', home: 'gili_villa',
    stops: ['gili_villa', 'horizontal'],
    summary: 'Trasllat a Gili Trawangan (matí). Platja + Horizontal / reggae night (nit).' },

  { date: '2026-08-06', region: 'Gili', title: 'Snorkel · pesca nocturna', home: 'gili_villa',
    stops: ['snorkel_turtle', 'snorkel_shark', 'night_fishing'],
    summary: 'Snorkel amb tortugues i taurons → pesca nocturna amb pescadors locals.' },

  { date: '2026-08-07', region: 'Uluwatu', title: 'Ferry a Uluwatu · Kecak', home: 'ulu_villa',
    stops: ['gili_villa', 'ulu_villa', 'padangpadang', 'uluwatu_temple'],
    summary: 'Ferry d\'hora (~8am) → Uluwatu ~13h. Platja i Kecak Fire Dance al temple (sunset).' },

  { date: '2026-08-08', region: 'Uluwatu', title: 'Surf · cliff diving', home: 'ulu_villa',
    stops: ['padangpadang', 'thomas'],
    summary: 'Surf (matí) → cliff diving a Thomas Beach → platja / beach club. Última nit a Bali.' },

  { date: '2026-08-09', region: 'Singapur', title: 'Vol a Singapur · National Day', home: 'sin2',
    stops: ['dps_apt', 'sin_apt', 'chinatown', 'botanic', 'gardensbay', 'marinabay'],
    summary: 'Vol a Singapur (7:30 → 9:55). Chinatown → Botanic → Gardens by the Bay → Marina Bay + focs del National Day. Últim dia del David.' },

  { date: '2026-08-10', region: 'Singapur', title: 'Little India · Raffles', home: 'sin2',
    stops: ['littleindia', 'kampongglam', 'raffles'],
    summary: 'Little India → Kampong Glam → Singapore Sling al Raffles Hotel → últim sopar.' },

  { date: '2026-08-11', region: 'En vol', title: 'Tornada a Barcelona', home: 'ist',
    stops: ['sin_apt', 'ist', 'bcn'],
    summary: 'Vol de tornada (10:25) via Istanbul. Arribada a Barcelona a les 23:15.' },
];

/* ---------------------------------------------------------------------------
 *  HORARIS  →  fil conductor de cada dia (barra lateral dreta)
 *  { t: 'HH:MM', kind, title, loc?, note?, pdf? }
 *  'loc' enllaça amb el mapa (clic → hi vola). 'kind' → veure SCHEDULE_KINDS.
 * ------------------------------------------------------------------------- */
const SCHEDULES = {
  '2026-07-22': [
    { t: '05:40', kind: 'move',   title: 'Arribada aeroport de Barcelona', loc: 'bcn', note: 'Terminal 1' },
    { t: '07:40', kind: 'flight', title: 'Vol Barcelona → Istanbul', loc: 'bcn', pdf: 'docs/vols-grup.pdf' },
    { t: '12:10', kind: 'move',   title: 'Escala a Istanbul', loc: 'ist' },
    { t: '17:00', kind: 'flight', title: 'Vol Istanbul → Singapur', loc: 'ist' },
    { t: '20:00', kind: 'dinner', title: 'Sopar a bord' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir al vol' },
  ],
  '2026-07-23': [
    { t: '08:45', kind: 'flight', title: 'Arribada a Singapur (Changi)', loc: 'sin_apt' },
    { t: '10:00', kind: 'move',   title: 'Check-in hotel', loc: 'sin1' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar a Singapur' },
    { t: '15:00', kind: 'free',   title: 'Passeig i descans' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'sin1' },
  ],
  '2026-07-24': [
    { t: '04:00', kind: 'wake',   title: 'Despertar — direcció aeroport' },
    { t: '06:20', kind: 'flight', title: 'Vol Singapur → Labuan Bajo', loc: 'sin_apt' },
    { t: '14:45', kind: 'flight', title: 'Arribada a Labuan Bajo', loc: 'lbj_apt' },
    { t: '15:30', kind: 'move',   title: 'Check-in hotel', loc: 'lbj_hotel' },
    { t: '19:30', kind: 'dinner', title: 'Sopar a Labuan Bajo' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'lbj_hotel' },
  ],
  '2026-07-25': [
    { t: '07:00', kind: 'wake',   title: 'Despertar' },
    { t: '07:30', kind: 'breakfast', title: 'Esmorzar (inclòs)' },
    { t: '08:30', kind: 'act',    title: 'Embarcament — barco Komodo', loc: 'komodo_boat' },
    { t: '11:00', kind: 'act',    title: 'Illa de Padar', loc: 'padar' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar a bord' },
    { t: '15:00', kind: 'act',    title: 'Pink Beach — snorkel', loc: 'pink_beach' },
    { t: '20:00', kind: 'dinner', title: 'Sopar a bord' },
    { t: '22:30', kind: 'sleep',  title: 'Nit a bord', loc: 'komodo_boat' },
  ],
  '2026-07-26': [
    { t: '06:00', kind: 'wake',   title: 'Sortida del sol al barco' },
    { t: '07:30', kind: 'breakfast', title: 'Esmorzar (inclòs)' },
    { t: '09:00', kind: 'act',    title: 'Snorkel i illes', loc: 'pink_beach' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar a bord' },
    { t: '17:00', kind: 'move',   title: 'Tornada a Labuan Bajo', loc: 'lbj_hotel' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'lbj_hotel' },
  ],
  '2026-07-27': [
    { t: '08:00', kind: 'wake',   title: 'Despertar' },
    { t: '08:30', kind: 'breakfast', title: 'Esmorzar' },
    { t: '11:00', kind: 'move',   title: "Cap a l'aeroport", loc: 'lbj_apt' },
    { t: '13:05', kind: 'flight', title: 'Vol Labuan Bajo → Denpasar', loc: 'lbj_apt' },
    { t: '14:20', kind: 'flight', title: 'Arribada a Bali (Denpasar)', loc: 'dps_apt' },
    { t: '16:00', kind: 'move',   title: 'Trasllat a Ubud', loc: 'ubud_villa' },
    { t: '21:00', kind: 'flight', title: 'El David arriba a Bali (KL → Denpasar)', loc: 'dps_apt', pdf: 'docs/vols-david.pdf' },
    { t: '21:30', kind: 'dinner', title: 'Sopar tots junts a Ubud' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa' },
  ],
  '2026-07-28': [
    { t: '07:30', kind: 'wake',   title: 'Despertar' },
    { t: '08:00', kind: 'breakfast', title: 'Esmorzar (inclòs a la villa)', loc: 'ubud_villa' },
    { t: '09:00', kind: 'act',    title: "Ubud Traditional Market", loc: 'ubud_market' },
    { t: '11:30', kind: 'act',    title: 'Sacred Monkey Forest', loc: 'monkey_forest' },
    { t: '13:30', kind: 'lunch',  title: 'Dinar a Ubud' },
    { t: '16:00', kind: 'act',    title: "Taller d'ofrenes (opcional)", loc: 'offerings' },
    { t: '19:30', kind: 'dinner', title: 'Mercat nocturn de Gianyar', loc: 'gianyar_market' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa' },
  ],
  '2026-07-29': [
    { t: '06:30', kind: 'wake',   title: 'Despertar' },
    { t: '07:00', kind: 'breakfast', title: 'Esmorzar', loc: 'ubud_villa' },
    { t: '08:00', kind: 'act',    title: 'Canyoning', loc: 'canyoning' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar' },
    { t: '15:00', kind: 'act',    title: "Taller d'anells de plata (Celuk)", loc: 'silver' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '21:00', kind: 'act',    title: 'Dansa tradicional balinesa (opcional)', loc: 'balidance' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa' },
  ],
  '2026-07-30': [
    { t: '06:00', kind: 'wake',   title: 'Despertar' },
    { t: '06:30', kind: 'breakfast', title: 'Esmorzar', loc: 'ubud_villa' },
    { t: '07:00', kind: 'move',   title: 'Cap al nord de Bali' },
    { t: '09:30', kind: 'act',    title: 'Cascada Sekumpul', loc: 'sekumpul' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar de camí' },
    { t: '14:30', kind: 'act',    title: 'Banyumala Twin Waterfall', loc: 'banyumala' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa' },
  ],
  '2026-07-31': [
    { t: '02:30', kind: 'wake',   title: 'Despertar (Batur sunrise)' },
    { t: '03:00', kind: 'move',   title: 'Sortida cap al volcà' },
    { t: '05:30', kind: 'act',    title: 'Sortida del sol al volcà Batur', loc: 'batur' },
    { t: '10:00', kind: 'move',   title: 'Tornada — descans al migdia' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar' },
    { t: '18:00', kind: 'act',    title: 'Classe de cuina balinesa', loc: 'cooking' },
    { t: '20:00', kind: 'dinner', title: 'Sopar (el que cuinem)' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'ubud_villa' },
  ],
  '2026-08-01': [
    { t: '07:30', kind: 'wake',   title: 'Despertar' },
    { t: '08:00', kind: 'breakfast', title: 'Esmorzar', loc: 'ubud_villa' },
    { t: '09:00', kind: 'act',    title: 'Ruta en quads', loc: 'quad' },
    { t: '12:30', kind: 'lunch',  title: 'Dinar' },
    { t: '14:00', kind: 'act',    title: 'Arrossars de Jatiluwih', loc: 'jatiluwih' },
    { t: '16:00', kind: 'act',    title: 'Temple Ulun Danu Beratan (opcional)', loc: 'beratan' },
    { t: '18:30', kind: 'move',   title: 'Trasllat a Canggu — check-in', loc: 'canggu_villa' },
    { t: '21:00', kind: 'dinner', title: "Old Man's Beach Bar", loc: 'oldmans' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa' },
  ],
  '2026-08-02': [
    { t: '05:30', kind: 'wake',   title: 'Despertar' },
    { t: '06:00', kind: 'breakfast', title: 'Esmorzar ràpid' },
    { t: '07:00', kind: 'move',   title: 'Ferry a Nusa Penida' },
    { t: '09:00', kind: 'act',    title: 'Kelingking Beach', loc: 'nusa_kling' },
    { t: '11:00', kind: 'act',    title: 'Broken Beach', loc: 'nusa_broken' },
    { t: '13:00', kind: 'lunch',  title: "Dinar a l'illa" },
    { t: '15:00', kind: 'act',    title: 'Diamond Beach', loc: 'nusa_diamond' },
    { t: '18:00', kind: 'move',   title: 'Ferry de tornada' },
    { t: '20:30', kind: 'dinner', title: 'Sopar' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa' },
  ],
  '2026-08-03': [
    { t: '05:00', kind: 'wake',   title: 'Despertar (Tanah Lot a l\'alba)' },
    { t: '05:45', kind: 'act',    title: 'Tanah Lot a la sortida del sol', loc: 'tanahlot' },
    { t: '08:30', kind: 'breakfast', title: 'Esmorzar' },
    { t: '10:00', kind: 'act',    title: 'Surf a Batu Bolong', loc: 'surf_canggu' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar' },
    { t: '16:00', kind: 'free',   title: 'Platja i descans' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '23:00', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa' },
  ],
  '2026-08-04': [
    { t: '08:00', kind: 'wake',   title: 'Despertar' },
    { t: '08:30', kind: 'breakfast', title: 'Esmorzar' },
    { t: '09:30', kind: 'act',    title: 'Ioga + massatge', loc: 'yoga' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar' },
    { t: '15:00', kind: 'act',    title: "Finn's Beach Club", loc: 'finns' },
    { t: '20:00', kind: 'dinner', title: 'Últim sopar amb el Guillem' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'canggu_villa' },
  ],
  '2026-08-05': [
    { t: '06:30', kind: 'wake',   title: 'Despertar' },
    { t: '07:00', kind: 'breakfast', title: 'Esmorzar' },
    { t: '07:30', kind: 'flight', title: 'El Guillem marxa cap a casa' },
    { t: '09:00', kind: 'move',   title: 'Fast boat a Gili Trawangan', loc: 'gili_villa' },
    { t: '12:30', kind: 'move',   title: 'Check-in', loc: 'gili_villa' },
    { t: '13:30', kind: 'lunch',  title: 'Dinar' },
    { t: '15:00', kind: 'free',   title: 'Platja a Gili T' },
    { t: '20:00', kind: 'dinner', title: 'Sopar' },
    { t: '22:00', kind: 'act',    title: 'Horizontal / reggae night', loc: 'horizontal' },
    { t: '01:00', kind: 'sleep',  title: 'Dormir', loc: 'gili_villa' },
  ],
  '2026-08-06': [
    { t: '08:00', kind: 'wake',   title: 'Despertar' },
    { t: '08:30', kind: 'breakfast', title: 'Esmorzar' },
    { t: '10:00', kind: 'act',    title: 'Snorkel amb tortugues (Gili Meno)', loc: 'snorkel_turtle' },
    { t: '13:00', kind: 'lunch',  title: 'Dinar' },
    { t: '15:00', kind: 'act',    title: 'Snorkel taurons punta negra', loc: 'snorkel_shark' },
    { t: '19:00', kind: 'dinner', title: 'Sopar' },
    { t: '20:30', kind: 'act',    title: 'Pesca nocturna amb pescadors locals', loc: 'night_fishing' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'gili_villa' },
  ],
  '2026-08-07': [
    { t: '06:30', kind: 'wake',   title: "Despertar (ferry d'hora)" },
    { t: '07:00', kind: 'breakfast', title: 'Esmorzar' },
    { t: '08:00', kind: 'flight', title: 'Ferry cap a Bali', loc: 'gili_villa' },
    { t: '13:00', kind: 'move',   title: 'Arribada Uluwatu — check-in', loc: 'ulu_villa' },
    { t: '13:30', kind: 'lunch',  title: 'Dinar' },
    { t: '15:00', kind: 'act',    title: 'Platja Padang Padang', loc: 'padangpadang' },
    { t: '18:00', kind: 'act',    title: 'Kecak Fire Dance al temple (sunset)', loc: 'uluwatu_temple' },
    { t: '20:30', kind: 'dinner', title: 'Sopar' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ulu_villa' },
  ],
  '2026-08-08': [
    { t: '07:30', kind: 'wake',   title: 'Despertar' },
    { t: '08:00', kind: 'breakfast', title: 'Esmorzar' },
    { t: '09:00', kind: 'act',    title: 'Surf', loc: 'padangpadang' },
    { t: '12:00', kind: 'act',    title: 'Cliff diving a Thomas Beach', loc: 'thomas' },
    { t: '13:30', kind: 'lunch',  title: 'Dinar' },
    { t: '16:00', kind: 'free',   title: 'Beach club / platja' },
    { t: '20:00', kind: 'dinner', title: 'Sopar — última nit a Bali' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'ulu_villa' },
  ],
  '2026-08-09': [
    { t: '04:30', kind: 'wake',   title: 'Despertar (vol matiner)' },
    { t: '05:00', kind: 'move',   title: "Cap a l'aeroport de Denpasar", loc: 'dps_apt' },
    { t: '07:30', kind: 'flight', title: 'Vol Denpasar → Singapur', loc: 'dps_apt' },
    { t: '09:55', kind: 'flight', title: 'Arribada a Singapur', loc: 'sin_apt' },
    { t: '11:00', kind: 'act',    title: 'Chinatown + dinar Michelin', loc: 'chinatown' },
    { t: '14:00', kind: 'act',    title: 'Botanic Gardens', loc: 'botanic' },
    { t: '16:30', kind: 'act',    title: 'Gardens by the Bay', loc: 'gardensbay' },
    { t: '19:00', kind: 'act',    title: 'Marina Bay + Garden Rhapsody + focs National Day', loc: 'marinabay' },
    { t: '19:45', kind: 'flight', title: 'El David torna a casa (Denpasar → Dubai)', loc: 'dps_apt', pdf: 'docs/vols-david.pdf' },
    { t: '21:30', kind: 'dinner', title: 'Sopar a Lau Pa Sat (satay)', loc: 'laupasat' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'sin2' },
  ],
  '2026-08-10': [
    { t: '09:00', kind: 'wake',   title: 'Despertar' },
    { t: '09:30', kind: 'breakfast', title: 'Esmorzar' },
    { t: '10:30', kind: 'act',    title: 'Little India', loc: 'littleindia' },
    { t: '12:30', kind: 'lunch',  title: 'Dinar' },
    { t: '14:00', kind: 'act',    title: 'Kampong Glam', loc: 'kampongglam' },
    { t: '16:00', kind: 'act',    title: 'Singapore Sling al Raffles', loc: 'raffles' },
    { t: '20:00', kind: 'dinner', title: 'Últim sopar del viatge' },
    { t: '23:30', kind: 'sleep',  title: 'Dormir', loc: 'sin2' },
  ],
  '2026-08-11': [
    { t: '06:30', kind: 'wake',   title: 'Despertar :))' },
    { t: '07:00', kind: 'breakfast', title: 'Esmorzar' },
    { t: '08:00', kind: 'move',   title: 'Cap a Changi', loc: 'sin_apt' },
    { t: '10:25', kind: 'flight', title: 'Vol Singapur → Istanbul', loc: 'sin_apt' },
    { t: '16:40', kind: 'move',   title: 'Escala a Istanbul', loc: 'ist' },
    { t: '20:25', kind: 'flight', title: 'Vol Istanbul → Barcelona', loc: 'ist' },
    { t: '23:15', kind: 'flight', title: 'Arribada a Barcelona ✈️', loc: 'bcn' },
  ],
};

/* Enllaça cada horari amb el seu dia */
DAYS.forEach(d => { d.schedule = SCHEDULES[d.date] || []; });
