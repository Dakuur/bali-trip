# Singapur · Bali 2026 🌴

Mapa interactiu del viatge a Singapur, Komodo i Bali (juliol–agost 2026).
Estil Apple Maps / minimalista, satèl·lit, timeline de dies amb play/pausa,
persones que es mouen segons el dia, traçades de vols i activitats filtrables.

## Funcionalitats

- 🛰️ **Mapa satèl·lit** (Esri World Imagery, sense API key) amb zoom i pan.
- 🗺️ **Commutador satèl·lit / mapa** (botó a dalt a la dreta): vista fosca vectorial estil Apple Maps (CARTO).
- 🗓️ **Rodeta de dies** a dalt: canvia de dia amb scroll, arrossegant o amb les fletxes.
- ▶️ **Play / pausa** per reproduir tot el pla; la càmera fa pan/zoom a cada lloc.
- 🧑‍🤝‍🧑 **Persones en cercle**: es mostren al lloc on són cada dia. Alguns membres
  arriben i marxen en dies diferents (David 27 jul–9 ago, Guillem fins 4 ago).
- ✈️ **Traçades de vols** corbades; s'il·luminen els vols del dia.
- 🏠 **Villes i activitats** clicables, amb info i enllaços a Booking/Casai/etc.
- 🎨 **Llegenda amb filtres** per categoria (allotjament, platja, natura, cultura…).

## Estructura

```
bali-trip/
├── public/                 ← arrel de Firebase Hosting
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── data.js         ← TOTES les dades (persones, llocs, dies, vols)
│       ├── map.js          ← mapa, marcadors, vols, càmera
│       └── app.js          ← rodeta, play/pausa, presència, filtres
├── firebase.json
├── .firebaserc             ← posa-hi el teu project id
└── indonesia/              ← documents originals del planning
```

Per editar el viatge només cal tocar **`public/js/data.js`**.

## Provar-ho localment

Obre `public/index.html` al navegador (des de PyCharm: clic dret → *Open in Browser*).
Cal connexió a internet per als tiles del satèl·lit i Leaflet (CDN).

## Desplegar a Firebase

```bash
npm install -g firebase-tools      # un cop
firebase login
# posa el teu project id a .firebaserc (o: firebase use --add)
firebase deploy --only hosting
```
