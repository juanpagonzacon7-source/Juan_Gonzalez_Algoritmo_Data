// Lista de canciones del álbum DATA
const songs = [
    { title: "Obstaculo", score: 0 },
    { title: "PASIEMPRE", score: 0 },
    { title: "Todavía", score: 0 },
    { title: "FANTASMA | AVC", score: 0 },
    { title: "MOJABI GHOST", score: 0 },
    { title: "11 y ONCE", score: 0 },
    { title: "Desde las 10 (KANY´S INTERLUDE)", score: 0 },
    { title: "Mañana", score: 0 },
    { title: "BUENOS AIRES", score: 0 },
    { title: "COLMILLO", score: 0 },
    { title: "LA BABY", score: 0 },
    { title: "Me jodí...", score: 0 },
    { title: "VOLVER", score: 0 },
    { title: "EN VISTO", score: 0 },
    { title: "Lo siento BB:/", score: 0 },
    { title: "Si preguntas por mí", score: 0 },
    { title: "Sci-Fi", score: 0 },
    { title: "CORLONE INTERLUDE", score: 0 },
    { title: "PARANORMAL", score: 0 },
    { title: "SACRIFICIO", score: 0 }
];

let song1, song2;

// Función para mostrar dos canciones aleatorias
function showSongs() {
    let indices = [];
    while (indices.length < 2) {
        let rand = Math.floor(Math.random() * songs.length);
        if (!indices.includes(rand)) indices.push(rand);
    }
    song1 = songs[indices[0]];
    song2 = songs[indices[1]];

    document.getElementById("song1").textContent = song1.title;
    document.getElementById("song2").textContent = song2.title;
}

// Función para actualizar el ranking
function updateRanking() {
    let rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";
    songs.sort((a, b) => b.score - a.score);
    songs.forEach(song => {
        let li = document.createElement("li");
        li.textContent = `${song.title} - Puntaje: ${song.score}`;
        rankingList.appendChild(li);
    });
}

// Eventos para elegir canción
document.getElementById("song1").addEventListener("click", () => {
    song1.score++;
    updateRanking();
    showSongs();
});

document.getElementById("song2").addEventListener("click", () => {
    song2.score++;
    updateRanking();
    showSongs();
});

// Inicializar
showSongs();
updateRanking();
