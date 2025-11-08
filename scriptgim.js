// ================================
// VARIABLES GLOBALES
// ================================
let startTime = null;
let timerInterval = null;
let pauseStartTime = null;
let isPaused = false;

// ================================
// EFFET MATRIX CANVAS
// ================================
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================
// PARTICULES DE CODE FLOTTANTES
// ================================
function createCodeParticles() {
    const container = document.getElementById('code-particles');
    if (!container) return;
    
    const codeSnippets = [
        'function()', '{ }', 'console.log()', 'return;', 'const x =', 
        'if (true)', 'async', 'await', 'import', 'export', '=> {}',
        'class', 'extends', 'new', 'this.', 'let', 'var', '===',
        '0x1A', 'null', 'undefined', 'try', 'catch', 'throw'
    ];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-code';
        particle.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            color: rgba(0, 255, 136, ${0.2 + Math.random() * 0.3});
            font-size: ${10 + Math.random() * 8}px;
            pointer-events: none;
            animation: float-code ${5 + Math.random() * 10}s linear infinite;
        `;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 15000);
    }
    
    // Créer des particules régulièrement
    setInterval(createParticle, 2000);
    
    // Styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-code {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// EFFET TYPING
// ================================
function typeText() {
    const textElement = document.getElementById('typed-text');
    if (!textElement) return;
    
    const texts = [
        'Génie Informatique et Maintenance',
        'Code. Create. Innovate.',
        'Building the future, one line at a time',
        'Welcome to the digital realm'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ================================
// ANIMATION DES STATISTIQUES
// ================================
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// ================================
// SYSTÈME DE LOG TERMINAL
// ================================
function addTerminalLog(message, type = 'info') {
    const terminal = document.getElementById('terminal-content');
    if (!terminal) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
    
    const logEntry = document.createElement('p');
    
    let icon = '→';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠';
    if (type === 'timer') icon = '⏱';
    if (type === 'pause') icon = '☕';
    
    logEntry.innerHTML = `
        <span class="terminal-time">[${timeStr}]</span> 
        <span class="terminal-${type}">${icon}</span> 
        ${message}
    `;
    
    terminal.appendChild(logEntry);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Garder seulement les 10 dernières lignes
    while (terminal.children.length > 10) {
        terminal.removeChild(terminal.firstChild);
    }
}

// ================================
// CHRONOMÈTRE DE TRAVAIL
// ================================
function initWorkTimer() {
    startTime = Date.now();
    
    // Afficher l'heure de connexion réelle
    const connectionTime = new Date();
    const formattedTime = connectionTime.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    setTimeout(() => {
        addTerminalLog(`Connexion établie le ${formattedTime}`, 'success');
    }, 1000);
    
    // Démarrer le chronomètre
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isPaused) return;
    
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    // Afficher le chronomètre dans le terminal
    updateTimerDisplay(minutes, seconds);
    
    // Messages motivationnels
    checkTimerMilestones(minutes, seconds);
}

function updateTimerDisplay(minutes, seconds) {
    const timerText = `Temps de travail: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Créer ou mettre à jour l'affichage du timer
    let timerElement = document.getElementById('live-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'live-timer';
        timerElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid rgba(0, 255, 136, 0.3);
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.2rem;
            color: #00ff88;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            animation: pulse-timer 2s ease-in-out infinite;
        `;
        document.body.appendChild(timerElement);
        
        // Ajouter animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-timer {
                0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); }
                50% { box-shadow: 0 0 30px rgba(0, 255, 136, 0.6); }
            }
        `;
        document.head.appendChild(style);
    }
    
    timerElement.innerHTML = `⏱ ${timerText}`;
}

function checkTimerMilestones(minutes, seconds) {
    // Vérifier uniquement quand les secondes sont à 0 pour éviter les répétitions
    if (seconds !== 0) return;
    
    let message = '';
    let type = 'timer';
    
    switch (minutes) {
        case 5:
            message = '💪 Le vrai travail commence ! Concentre-toi, ingénieur !';
            type = 'success';
            break;
        case 15:
            message = '🎯 Continue ! On est prêt pour un 15 au prochain devoir !';
            type = 'success';
            break;
        case 30:
            message = '🔥 Je crois que l\'on est au pic de notre concentration !';
            type = 'success';
            break;
        case 45:
            message = '☕ Je crois qu\'il faut que l\'on fasse une pause. On a bien travaillé Ingénieur !';
            type = 'pause';
            startPause();
            break;
    }
    
    if (message) {
        addTerminalLog(message, type);
        showMotivationalPopup(message);
    }
}

function startPause() {
    isPaused = true;
    pauseStartTime = Date.now();
    
    addTerminalLog('Pause de 15 minutes activée...', 'pause');
    
    // Créer overlay de pause
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        animation: fadeIn 0.5s ease;
    `;
    
    pauseOverlay.innerHTML = `
        <div style="text-align: center; color: #00ff88;">
            <h2 style="font-size: 3rem; margin-bottom: 20px;">☕ PAUSE</h2>
            <p style="font-size: 1.5rem;" id="pause-countdown">15:00</p>
            <p style="font-size: 1rem; opacity: 0.7; margin-top: 20px;">Repose-toi bien, ingénieur !</p>
        </div>
    `;
    
    document.body.appendChild(pauseOverlay);
    
    // Décompte de la pause
    const pauseInterval = setInterval(() => {
        const pauseElapsed = Date.now() - pauseStartTime;
        const pauseRemaining = 15 * 60 * 1000 - pauseElapsed;
        
        if (pauseRemaining <= 0) {
            clearInterval(pauseInterval);
            endPause();
        } else {
            const mins = Math.floor(pauseRemaining / 60000);
            const secs = Math.floor((pauseRemaining % 60000) / 1000);
            const countdownEl = document.getElementById('pause-countdown');
            if (countdownEl) {
                countdownEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }
    }, 1000);
}

function endPause() {
    isPaused = false;
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) pauseOverlay.remove();
    
    // Réinitialiser le chronomètre
    startTime = Date.now();
    
    addTerminalLog('⚡ Il est l\'heure de reprendre le travail !', 'success');
    showMotivationalPopup('⚡ Il est l\'heure de reprendre le travail !');
}

function showMotivationalPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'motivational-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #00ff88 0%, #00cc70 100%);
        color: #0a0a0a;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 0 50px rgba(0, 255, 136, 0.8);
        animation: popupAppear 0.5s ease forwards, popupDisappear 0.5s ease 6.5s forwards;
        max-width: 80%;
        text-align: center;
    `;
    popup.textContent = message;
    
    document.body.appendChild(popup);
    
    // Ajouter animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupAppear {
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }
        @keyframes popupDisappear {
            to {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => popup.remove(), 7000);
}

// ================================
// NOTIFICATION D'ACCUEIL
// ================================
function showWelcomeNotification() {
    const notif = document.getElementById('notif');
    if (notif) {
        notif.style.display = 'block';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 4000);
    }
}

// ================================
// EFFETS SONORES (optionnel)
// ================================
function playTypingSound() {
    // Créer un contexte audio pour des effets sonores subtils
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    document.addEventListener('keypress', () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    });
}

// ================================
// EASTER EGG : KONAMI CODE
// ================================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateMatrixMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateMatrixMode() {
    addTerminalLog('🎮 MATRIX MODE ACTIVATED!', 'success');
    document.body.style.animation = 'matrix-flash 0.5s ease';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-flash {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg) brightness(1.5); }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// INITIALISATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'intro se termine
    setTimeout(() => {
        initMatrix();
        createCodeParticles();
        typeText();
        animateStats();
        showWelcomeNotification();
        initWorkTimer();
        playTypingSound();
        initKonamiCode();
        
        addTerminalLog('Système initialisé avec succès', 'success');
        addTerminalLog('Modules chargés', 'success');
        addTerminalLog('En attente de commande...', 'info');
    }, 3500);
});

// ================================
// GESTION DU REDIMENSIONNEMENT
// ================================
window.addEventListener('resize', () => {
    // Repositionner les éléments si nécessaire
    const timerElement = document.getElementById('live-timer');
    if (timerElement && window.innerWidth < 768) {
        timerElement.style.right = '10px';
        timerElement.style.top = '80px';
        timerElement.style.fontSize = '1rem';
        timerElement.style.padding = '10px 15px';
    }
});

// ================================
// PRÉVENIR LA FERMETURE ACCIDENTELLE
// ================================
window.addEventListener('beforeunload', (e) => {
    if (startTime && (Date.now() - startTime) > 60000) {
        e.preventDefault();
        e.returnValue = 'Tu es sûr de vouloir quitter ? Ton chrono sera réinitialisé !';
        return e.returnValue;
    }
});