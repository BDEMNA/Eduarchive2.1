// ================================
// VARIABLES GLOBALES
// ================================
let startTime = null;
let timerInterval = null;
let pauseStartTime = null;
let isPaused = false;
let currentStage = 0;
let soilQuality = 75;
let waterLevel = 60;
let nutritionLevel = 80;
let currentSeason = 0; // 0: Printemps, 1: Été, 2: Automne, 3: Hiver
let isRaining = false;

const seasons = [
    { name: 'Printemps', icon: '🌸', temp: '18°C' },
    { name: 'Été', icon: '☀️', temp: '28°C' },
    { name: 'Automne', icon: '🍂', temp: '15°C' },
    { name: 'Hiver', icon: '❄️', temp: '8°C' }
];

// ================================
// CANVAS - CHAMPS ONDULANTS
// ================================
function initFieldCanvas() {
    const canvas = document.getElementById('field-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const waves = [];
    const waveCount = 5;
    
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            y: canvas.height * 0.6 + i * 30,
            amplitude: 10 + i * 5,
            frequency: 0.01 + i * 0.002,
            speed: 0.02 + i * 0.01,
            offset: 0,
            color: `rgba(${107 - i * 10}, ${142 - i * 10}, ${35 + i * 5}, ${0.3 - i * 0.04})`
        });
    }
    
    function drawWave(wave) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x < canvas.width; x++) {
            const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = wave.color;
        ctx.fill();
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        waves.forEach(wave => {
            wave.offset += wave.speed;
            drawWave(wave);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================
// PARTICULES NATURE (POLLEN, GRAINES)
// ================================
function createNatureParticles() {
    const container = document.getElementById('nature-particles');
    if (!container) return;
    
    const particles = ['🌸', '🌼', '🌺', '🍃', '🌾', '🌿'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-nature';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${10 + Math.random() * 15}px;
            opacity: ${0.4 + Math.random() * 0.4};
            pointer-events: none;
            animation: nature-float ${5 + Math.random() * 10}s linear infinite;
        `;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 15000);
    }
    
    setInterval(createParticle, 1500);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes nature-float {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${-30 + Math.random() * 60}px, 100vh) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// PAPILLONS VOLANTS
// ================================
function createButterflies() {
    const container = document.getElementById('butterflies');
    if (!container) return;
    
    function createButterfly() {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';
        butterfly.textContent = '🦋';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.6);
        const duration = 10 + Math.random() * 15;
        
        butterfly.style.cssText = `
            position: absolute;
            left: ${startX}px;
            top: ${startY}px;
            font-size: ${20 + Math.random() * 15}px;
            pointer-events: none;
            animation: butterfly-fly-${Date.now()} ${duration}s ease-in-out infinite;
        `;
        
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * (window.innerHeight * 0.6);
        
        const keyframes = `
            @keyframes butterfly-fly-${Date.now()} {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${(endX - startX) * 0.3}px, ${(endY - startY) * 0.3}px) rotate(10deg);
                }
                50% {
                    transform: translate(${(endX - startX) * 0.7}px, ${(endY - startY) * 0.7}px) rotate(-10deg);
                }
                75% {
                    transform: translate(${(endX - startX)}px, ${(endY - startY)}px) rotate(5deg);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        container.appendChild(butterfly);
        
        setTimeout(() => {
            butterfly.remove();
            styleSheet.remove();
        }, duration * 1000);
    }
    
    // Créer des papillons régulièrement
    setInterval(createButterfly, 5000);
    createButterfly();
}

// ================================
// SYSTÈME DE PLUIE
// ================================
function startRain() {
    const rainOverlay = document.getElementById('rain-overlay');
    if (!rainOverlay || isRaining) return;
    
    isRaining = true;
    rainOverlay.style.display = 'block';
    
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: 2px;
            height: ${10 + Math.random() * 20}px;
            background: linear-gradient(180deg, transparent, rgba(135, 206, 235, 0.6));
            animation: rain-fall ${0.5 + Math.random() * 0.5}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        rainOverlay.appendChild(drop);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rain-fall {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh);
                opacity: 0.3;
            }
        }
    `;
    document.head.appendChild(style);
    
    addJournalLog('☔ Pluie bienfaisante ! Irrigation naturelle en cours...', 'water');
    
    // Augmenter le niveau d'eau
    waterLevel = Math.min(100, waterLevel + 20);
    updateGauges();
    
    // Arrêter après 30 secondes
    setTimeout(stopRain, 30000);
}

function stopRain() {
    const rainOverlay = document.getElementById('rain-overlay');
    if (!rainOverlay) return;
    
    isRaining = false;
    rainOverlay.style.display = 'none';
    rainOverlay.innerHTML = '';
    
    addJournalLog('☀️ La pluie s\'arrête. Le sol est bien hydraté.', 'success');
}

// ================================
// EFFET TYPING
// ================================
function typeText() {
    const textElement = document.getElementById('typed-text');
    if (!textElement) return;
    
    const texts = [
        'Sciences Agricoles et Gestion',
        'De la graine à la récolte',
        'Cultiver l\'excellence, nourrir l\'avenir',
        'Agronomes de demain'
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
// SYSTÈME DE LOG JOURNAL
// ================================
function addJournalLog(message, type = 'info') {
    const journal = document.getElementById('journal-content');
    if (!journal) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
    
    const entry = document.createElement('div');
    entry.className = 'journal-entry';
    
    let icon = '🌱';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠';
    if (type === 'water') icon = '💧';
    if (type === 'harvest') icon = '🌾';
    if (type === 'season') icon = '🌍';
    
    entry.innerHTML = `
        <span class="entry-icon">${icon}</span>
        <span class="entry-time">[${timeStr}]</span>
        <span class="entry-msg log-${type}">${message}</span>
    `;
    
    journal.appendChild(entry);
    journal.scrollTop = journal.scrollHeight;
    
    while (journal.children.length > 15) {
        journal.removeChild(journal.firstChild);
    }
}

// ================================
// CYCLE DE CROISSANCE
// ================================
function updateGrowthStage(elapsed) {
    const minutes = Math.floor(elapsed / 60000);
    
    let newStage = 0;
    if (minutes >= 5) newStage = 1;
    if (minutes >= 15) newStage = 2;
    if (minutes >= 30) newStage = 3;
    if (minutes >= 45) newStage = 4;
    
    if (newStage !== currentStage && newStage <= 4) {
        currentStage = newStage;
        const stages = document.querySelectorAll('.stage');
        
        stages.forEach((stage, index) => {
            if (index <= currentStage) {
                stage.classList.add('active');
            }
        });
        
        const stageNames = ['Semis', 'Germination', 'Croissance', 'Floraison', 'Récolte'];
        addJournalLog(`Nouvelle étape atteinte : ${stageNames[currentStage]}`, 'success');
    }
}

// ================================
// MISE À JOUR DES JAUGES
// ================================
function updateGauges() {
    const soilGauge = document.getElementById('soil-quality');
    const waterGauge = document.getElementById('water-level');
    const nutritionGauge = document.getElementById('nutrition-level');
    
    if (soilGauge) soilGauge.style.width = soilQuality + '%';
    if (waterGauge) waterGauge.style.width = waterLevel + '%';
    if (nutritionGauge) nutritionGauge.style.width = nutritionLevel + '%';
}

function fluctuateGauges() {
    // Les niveaux baissent lentement avec le temps
    soilQuality = Math.max(30, soilQuality - 0.1);
    waterLevel = Math.max(20, waterLevel - 0.15);
    nutritionLevel = Math.max(40, nutritionLevel - 0.08);
    
    updateGauges();
    
    // Alertes si les niveaux sont trop bas
    if (waterLevel < 30 && Math.random() > 0.95) {
        addJournalLog('⚠ Niveau d\'eau faible ! Irrigation recommandée.', 'warning');
        
        // Déclencher la pluie automatiquement
        if (!isRaining && Math.random() > 0.7) {
            startRain();
        }
    }
    
    if (soilQuality < 50 && Math.random() > 0.98) {
        addJournalLog('⚠ Qualité du sol en baisse. Enrichissement nécessaire.', 'warning');
    }
}

// ================================
// GESTION DES SAISONS
// ================================
function updateSeason(elapsed) {
    const minutes = Math.floor(elapsed / 60000);
    
    // Changer de saison toutes les 20 minutes
    const newSeason = Math.floor(minutes / 20) % 4;
    
    if (newSeason !== currentSeason) {
        currentSeason = newSeason;
        const season = seasons[currentSeason];
        
        const seasonIcon = document.getElementById('season-icon');
        const seasonName = document.getElementById('season-name');
        const weatherIcon = document.getElementById('weather-icon');
        const weatherTemp = document.getElementById('weather-temp');
        
        if (seasonIcon) seasonIcon.textContent = season.icon;
        if (seasonName) seasonName.textContent = season.name;
        if (weatherTemp) weatherTemp.textContent = season.temp;
        
        // Icône météo selon la saison
        const weatherIcons = ['🌤️', '☀️', '🌥️', '❄️'];
        if (weatherIcon) weatherIcon.textContent = weatherIcons[currentSeason];
        
        addJournalLog(`Changement de saison : ${season.name}`, 'season');
        showNaturePopup(`🌍 ${season.name.toUpperCase()}`, `Nouvelle saison agricole. Température : ${season.temp}`);
        
        // Ajuster les couleurs de fond selon la saison
        updateSeasonalBackground();
    }
}

function updateSeasonalBackground() {
    const gradients = [
        'linear-gradient(180deg, #87ceeb 0%, #98d98e 50%, #6b8e23 100%)', // Printemps
        'linear-gradient(180deg, #87ceeb 0%, #ffd700 30%, #90ee90 70%, #6b8e23 100%)', // Été
        'linear-gradient(180deg, #ff8c00 0%, #ffa500 30%, #cd853f 70%, #8b4513 100%)', // Automne
        'linear-gradient(180deg, #b0c4de 0%, #e0e0e0 50%, #d3d3d3 100%)' // Hiver
    ];
    
    document.body.style.background = gradients[currentSeason];
}

// ================================
// CHRONOMÈTRE AGRICOLE
// ================================
function initFarmTimer() {
    startTime = Date.now();
    
    const connectionTime = new Date();
    const formattedTime = connectionTime.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Mettre à jour la date dans le journal
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = connectionTime.toLocaleDateString('fr-FR');
    }
    
    setTimeout(() => {
        addJournalLog(`Connexion établie le ${formattedTime}`, 'success');
        addJournalLog('Préparation du terrain terminée', 'success');
        addJournalLog('Semis prêt à commencer', 'info');
    }, 1000);
    
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isPaused) return;
    
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    updateTimerDisplay(minutes, seconds);
    updateGrowthStage(elapsed);
    updateSeason(elapsed);
    fluctuateGauges();
    checkFarmMilestones(minutes, seconds);
}

function updateTimerDisplay(minutes, seconds) {
    const timerText = `⏱ Temps de culture: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    let timerElement = document.getElementById('live-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'live-timer';
        timerElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(139, 69, 19, 0.3);
            backdrop-filter: blur(10px);
            border: 3px solid rgba(107, 142, 35, 0.4);
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.2rem;
            color: #2e7d32;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
            animation: pulse-nature-timer 2s ease-in-out infinite;
        `;
        document.body.appendChild(timerElement);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-nature-timer {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
                    border-color: rgba(107, 142, 35, 0.4);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(50, 205, 50, 0.6);
                    border-color: rgba(107, 142, 35, 0.7);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    timerElement.textContent = timerText;
}

function checkFarmMilestones(minutes, seconds) {
    if (seconds !== 0) return;
    
    let message = '';
    let type = 'info';
    
    switch (minutes) {
        case 5:
            message = '🌱 La germination commence ! Les graines prennent vie !';
            type = 'success';
            break;
        case 15:
            message = '🌿 Croissance vigoureuse ! Les plantes se développent bien !';
            type = 'success';
            break;
        case 30:
            message = '🌻 Floraison magnifique ! Le champ est en pleine forme !';
            type = 'success';
            break;
        case 45:
            message = '🌾 Temps de pause ! Même les agronomes ont besoin de repos !';
            type = 'warning';
            startPause();
            break;
        case 10:
            message = '💧 Les plantes ont soif ! Vérification de l\'irrigation...';
            type = 'water';
            if (Math.random() > 0.5) startRain();
            break;
        case 25:
            message = '🦋 La biodiversité s\'installe ! Papillons et abeilles visitent !';
            type = 'success';
            // Créer plus de papillons
            for (let i = 0; i < 3; i++) {
                setTimeout(createButterflies, i * 500);
            }
            break;
    }
    
    if (message) {
        addJournalLog(message, type);
        if (type === 'success') {
            showNaturePopup('🌾 ÉTAPE AGRICOLE', message);
        }
    }
}

function startPause() {
    isPaused = true;
    pauseStartTime = Date.now();
    
    addJournalLog('Pause agricole - 15 minutes de repos', 'warning');
    
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(34, 139, 34, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        animation: fadeIn 0.5s ease;
    `;
    
    pauseOverlay.innerHTML = `
        <div style="text-align: center; color: #fff;">
            <h2 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);">🌾 PAUSE CHAMPÊTRE</h2>
            <p style="font-size: 1.8rem; font-weight: bold;" id="pause-countdown">15:00</p>
            <p style="font-size: 1.1rem; opacity: 0.9; margin-top: 20px;">Les champs se reposent... Toi aussi !</p>
            <div style="margin-top: 30px; font-size: 3rem;">
                🌿 🌻 🦋 🌸
            </div>
        </div>
    `;
    
    document.body.appendChild(pauseOverlay);
    
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
    
    startTime = Date.now();
    
    addJournalLog('⚡ Reprise des travaux agricoles ! Le champ t\'attend !', 'success');
    showNaturePopup('🌱 REPRISE', 'Les semences ont besoin de toi, agronome !');
}

function showNaturePopup(title, message) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #90ee90 0%, #32cd32 100%);
        color: #1a3a1a;
        padding: 35px 60px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 
            0 0 50px rgba(50, 205, 50, 0.8),
            inset 0 2px 10px rgba(255, 255, 255, 0.3);
        animation: naturePopup 0.5s ease forwards, naturePopupOut 0.5s ease 6.5s forwards;
        max-width: 80%;
        text-align: center;
        border: 3px solid rgba(144, 238, 144, 0.8);
    `;
    
    popup.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">${title}</h3>
        <p style="font-size: 1.3rem;">${message}</p>
    `;
    
    document.body.appendChild(popup);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes naturePopup {
            0% {
                transform: translate(-50%, -50%) scale(0) rotateY(90deg);
            }
            60% {
                transform: translate(-50%, -50%) scale(1.1) rotateY(-10deg);
            }
            100% {
                transform: translate(-50%, -50%) scale(1) rotateY(0deg);
            }
        }
        @keyframes naturePopupOut {
            to {
                transform: translate(-50%, -50%) scale(0) rotateY(-90deg);
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
// TRANSITION NATURE SUR LES BOUTONS
// ================================
function initNatureTransitions() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('href');

            // Création de l'overlay animé
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, #87ceeb 0%, #90ee90 50%, #6b8e23 100%);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: growth-transition 0.8s ease forwards;
            `;

            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 5rem; animation: plant-sprout 1s ease-in-out infinite;">🌱</div>
                    <p style="color: #2e7d32; font-size: 1.5rem; font-weight: bold; margin-top: 20px; text-shadow: 0 0 10px rgba(50, 205, 50, 0.6);">
                        CROISSANCE DU SAVOIR...
                    </p>
                    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; font-size: 2rem;">
                        <span style="animation: leaf-wave 1s ease-in-out infinite;">🍃</span>
                        <span style="animation: leaf-wave 1s ease-in-out 0.2s infinite;">🌿</span>
                        <span style="animation: leaf-wave 1s ease-in-out 0.4s infinite;">🌾</span>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Injection des animations CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes growth-transition {
                    0% {
                        clip-path: circle(0% at 50% 100%);
                    }
                    100% {
                        clip-path: circle(150% at 50% 100%);
                    }
                }

                @keyframes plant-sprout {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }

                @keyframes leaf-wave {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(style);

            // Redirection après l'animation
            setTimeout(() => {
                window.location.href = target;
            }, 1000);
        });
    });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', initNatureTransitions);
