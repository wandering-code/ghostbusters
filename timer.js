document.addEventListener("DOMContentLoaded", function() {
    // Variables para el temporizador
    let timer;
    let isRunning = false;
    let elapsedTime = 0;

    // Función para formatear el tiempo
    function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Referencias a elementos del DOM
    const clockIcon = document.getElementById('clock-icon');
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    const startStopButton = document.getElementById('start-stop-button');
    const resetButton = document.getElementById('reset-button');

    // Mostrar/Ocultar el recuadro del temporizador
    clockIcon.addEventListener('click', () => {
        if (timerContainer.style.right === '20px') {
            timerContainer.style.right = '-250px';
        } else {
            timerContainer.style.right = '20px';
        }
    });

    // Iniciar/Parar el temporizador
    startStopButton.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timer);
            startStopButton.textContent = 'Iniciar';
        } else {
            const startTime = Date.now() - elapsedTime;
            timer = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                timerDisplay.textContent = formatTime(elapsedTime);
            }, 1000);
            startStopButton.textContent = 'Parar';
        }
        isRunning = !isRunning;
    });

    // Resetear el temporizador
    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        elapsedTime = 0;
        timerDisplay.textContent = '00:00:00';
        startStopButton.textContent = 'Iniciar';
        isRunning = false;
    });
});
