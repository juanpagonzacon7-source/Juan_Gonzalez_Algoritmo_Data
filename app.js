// =====================
// 1) Datos
// =====================

const canciones = [
  "Pasiempre",
  "11 y Once",
  "Lo Siento BB :/",
  "Volver",
  "Colmillo",
  "Si Preguntan Por Mí",
  "Mojabi Ghost",
  "Todavía",
  "Fantasma",
  "Sacrificio"
];

const segmentos = {
  "F1": "Fan casual",
  "F2": "Fan del reggaetón clásico",
  "F3": "Fan experimental",
  "P":  "Productor / interesado en producción",
  "L":  "Oyente enfocado en letras"
};

const contextos = {
  "I": "¿Cuál impacta más al primer escucha?",
  "R": "¿Cuál tiene más replay value?",
  "C": "¿Cuál representa mejor el concepto del álbum?",
  "F": "¿Cuál funciona mejor en una fiesta?"
};

const RATING_INICIAL = 1000;
const K = 32;

const STORAGE_KEY = "datamash_state_v1";

function defaultState(){
  const buckets = {};
  for (const seg of Object.keys(segmentos)){
    for (const ctx of Object.keys(contextos)){
      const key = `${seg}__${ctx}`;
      buckets[key] = {};
      canciones.forEach(c => buckets[key][c] = RATING_INICIAL);
    }
  }
  return { buckets, votes: [] };
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try { return JSON.parse(raw); }
  catch { return defaultState(); }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function expectedScore(ra, rb){
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function updateElo(bucket, A, B, winner){
  const ra = bucket[A], rb = bucket[B];
  const ea = expectedScore(ra, rb);
  const eb = expectedScore(rb, ra);

  const sa = (winner === "A") ? 1 : 0;
  const sb = (winner === "B") ? 1 : 0;

  bucket[A] = ra + K * (sa - ea);
  bucket[B] = rb + K * (sb - eb);
}

function randomPair(){
  const a = canciones[Math.floor(Math.random() * canciones.length)];
  let b = a;
  while (b === a){
    b = canciones[Math.floor(Math.random() * canciones.length)];
  }
  return [a, b];
}

function bucketKey(seg, ctx){ return `${seg}__${ctx}`; }

function topN(bucket, n=10){
  const arr = Object.entries(bucket).map(([cancion, rating]) => ({cancion, rating}));
  arr.sort((x,y) => y.rating - x.rating);
  return arr.slice(0, n);
}

// UI wiring (idéntico al base)

const segmentSelect = document.getElementById("segmentSelect");
const contextSelect = document.getElementById("contextSelect");
const questionEl = document.getElementById("question");
const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnNewPair = document.getElementById("btnNewPair");
const btnShowTop = document.getElementById("btnShowTop");
const topBox = document.getElementById("topBox");
const btnReset = document.getElementById("btnReset");
const btnExport = document.getElementById("btnExport");

let currentA = null;
let currentB = null;

function fillSelect(selectEl, obj){
  selectEl.innerHTML = "";
  for (const [k, v] of Object.entries(obj)){
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = `${k} — ${v}`;
    selectEl.appendChild(opt);
  }
}

fillSelect(segmentSelect, segmentos);
fillSelect(contextSelect, contextos);

segmentSelect.value = "F1";
contextSelect.value = "I";

function refreshQuestion(){
  questionEl.textContent = contextos[contextSelect.value];
}

function newDuel(){
  [currentA, currentB] = randomPair();
  labelA.textContent = currentA;
  labelB.textContent = currentB;
  refreshQuestion();
}

function renderTop(){
  const bucket = state.buckets[bucketKey(segmentSelect.value, contextSelect.value)];
  const rows = topN(bucket, 10);

  topBox.innerHTML = rows.map((r, idx) => `
    <div class="toprow">
      <div><b>${idx+1}.</b> ${r.cancion}</div>
      <div>${r.rating.toFixed(1)}</div>
    </div>
  `).join("");
}

function vote(winner){
  const key = bucketKey(segmentSelect.value, contextSelect.value);
  const bucket = state.buckets[key];

  updateElo(bucket, currentA, currentB, winner);
  saveState();
  renderTop();
  newDuel();
}

btnA.addEventListener("click", () => vote("A"));
btnB.addEventListener("click", () => vote("B"));
btnNewPair.addEventListener("click", newDuel);
btnShowTop.addEventListener("click", renderTop);

btnReset.addEventListener("click", () => {
  state = defaultState();
  saveState();
  renderTop();
  newDuel();
});

newDuel();
renderTop();
refreshQuestion();
