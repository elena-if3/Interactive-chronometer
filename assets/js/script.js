// Variabile per memorizzare il tempo di partenza (in millisecondi)
let startTime = 0;

// Tempo totale trascorso (anche dopo stop/start) in millisecondi
let elapsedTime = 0;

// ID del setInterval attivo (usato per fermarlo con clearInterval)
let timerInterval = null;

// Flag per sapere se il cronometro è attualmente in esecuzione
let isRunning = false;

// Array per salvare i tempi intermedi (lap)
let laps = [];

// Timeout ID per i messaggi temporanei
let feedbackTimeout = null;

// Selezioniamo gli elementi dal DOM
const display = document.getElementById("display");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const lapButton = document.getElementById("lap");
const lapsList = document.getElementById("laps");

// Funzione per formattare il tempo da millisecondi a stringa leggibile
function formatTime(ms) {
    const time = new Date(ms); // Convertiamo i millisecondi in oggetto Date
    const hours = String(time.getUTCHours()).padStart(2, "0");
    const minutes = String(time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(time.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(time.getUTCMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`; // Return: la stringa formattata
}

// Funzione per aggiornare il display visivo del tempo
function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

// EVENTO: Start (avvia il cronometro)
startButton.addEventListener("click", () => {
    if (isRunning) return; // Se è già in esecuzione, non fare nulla

    isRunning = true; // Imposta il flag su "in esecuzione"
    startTime = Date.now() - elapsedTime; // Corregge per il tempo già trascorso in modo che il cronometro non riparta da zero

    // Ogni 10 millisecondi, aggiorna il tempo
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime; // Calcola tempo attuale
        updateDisplay(); // Aggiorna il display
    }, 10);

    showTemporaryFeedback("Started!"); // Mostra un messaggio temporaneo
});

// EVENTO: Stop (mette in pausa il cronometro)
stopButton.addEventListener("click", () => {
    if (!isRunning) return; // Se non è in esecuzione, non fare nulla

    clearInterval(timerInterval); // Ferma l'intervallo attivo
    isRunning = false; // Imposta il flag su "non in esecuzione"

    showTemporaryFeedback("Stopped."); // Messaggio temporaneo
});

// EVENTO: Reset (azzera tutto)
resetButton.addEventListener("click", () => {
    clearInterval(timerInterval); // Ferma il cronometro
    isRunning = false; // Imposta il flag
    elapsedTime = 0; // Azzera il tempo
    updateDisplay(); // Mostra 00:00.000

    laps = []; // Svuota la lista dei laps
    lapsList.innerHTML = ""; // Svuota la lista visuale

    showTemporaryFeedback("Reset!"); // Messaggio
});

// EVENTO: Lap (registra tempo corrente)
lapButton.addEventListener("click", () => {
    if (!isRunning) return; // Non si può salvare un lap se è fermo

    const lapTime = elapsedTime; // Memorizza il tempo attuale
    laps.push(lapTime); // Aggiunge lap all'array dei laps (alla fine)

    const li = document.createElement("li"); // Crea nuovo <li>
    li.classList.add("list-group-item"); // Aggiunge al <li> la classe di Bootstrap
    li.textContent = `Lap ${laps.length}: ${formatTime(lapTime)}`; // Testo formattato
    lapsList.appendChild(li); // Aggiunge alla lista nella pagina

    showTemporaryFeedback("Lap saved!"); // Messaggio temporaneo
});

// Funzione per mostrare un messaggio temporaneo sotto il cronometro
function showTemporaryFeedback(message) {
    let feedbackDiv = document.getElementById("feedback");

    // Se il div non esiste, crealo
    if (!feedbackDiv) {
        feedbackDiv = document.createElement("div");
        feedbackDiv.id = "feedback";
        feedbackDiv.style.marginTop = "15px";
        feedbackDiv.style.color = "#708090";
        lapsList.parentNode.insertBefore(feedbackDiv, lapsList); // Inserisce sotto il cronometro
    }

    feedbackDiv.textContent = message; // Mostra il messaggio

    // Se c'è già un timeout attivo, lo cancella per evitarne due sovrapposti
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
    }

    // Dopo 2 secondi, cancella il messaggio
    feedbackTimeout = setTimeout(() => {
        feedbackDiv.textContent = "";
    }, 2000);
}
