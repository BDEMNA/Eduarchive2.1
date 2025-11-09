// ================================
// VARIABLES GLOBALES
// ================================
let startTime = null;
let timerInterval = null;
let pauseStartTime = null;
let isPaused = false;
let temperature = 0;
let maxTemperature = 1000; // 1000°C pour la métallurgie
let isCooling = false;

// ================================
// CANVAS - PARTICULES DE MINERAI
// ================================
function initOreCanvas() {
    const canvas = document.getElementById('ore-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class OreParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.color = ['#ffb700', '#ff8c00', '#ffd700', '#c77700'][Math.floor(Math.random() * 4)];
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX *= -1;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Effet de lueur
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new OreParticle());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
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
// ÉTINCELLES FLOTTANTES
// ================================
function createSparkParticles() {
    const container = document.getElementById('spark-particles');
    if (!container) return;
    
    function createSpark() {
        const spark = document.createElement('div');
        spark.className = 'floating-spark';
        spark.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: ${['#ffb700', '#ff8c00', '#ffd700'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            box-shadow: 0 0 ${5 + Math.random() * 10}px currentColor;
            pointer-events: none;
            animation: spark-fly ${3 + Math.random() * 5}s linear infinite;
            opacity: ${0.5 + Math.random() * 0.5};
        `;
        container.appendChild(spark);
        
        setTimeout(() => spark.remove(), 8000);
    }
    
    setInterval(createSpark, 500);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spark-fly {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${-50 + Math.random() * 100}px, -100vh) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// ÉTINCELLES D'INTRO
// ================================
function createIntroSparks() {
    const container = document.getElementById('intro-sparks');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 100 + Math.random() * 100;
            
            spark.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffd700;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                box-shadow: 0 0 10px #ffb700;
                animation: spark-burst-${i} 1.5s ease-out forwards;
            `;
            
            const keyframes = `
                @keyframes spark-burst-${i} {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = keyframes;
            document.head.appendChild(styleSheet);
            
            container.appendChild(spark);
            
            setTimeout(() => spark.remove(), 1500);
        }, i * 20);
    }
}

// ================================
// EFFET TYPING
// ================================
function typeText() {
    const textElement = document.getElementById('typed-text');
    if (!textElement) return;
    
    const texts = [
        'Mine et Métallurgie',
        'Forger l\'avenir, pierre par pierre',
        'L\'excellence commence ici',
        'De la roche au métal précieux'
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
// SYSTÈME DE LOG INDUSTRIEL
// ================================
function addPanelLog(message, type = 'info') {
    const panel = document.getElementById('panel-content');
    if (!panel) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    let icon = '⚡';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠';
    if (type === 'timer') icon = '⏱';
    if (type === 'pause') icon = '☕';
    if (type === 'heat') icon = '🔥';
    if (type === 'cool') icon = '❄';
    
    logEntry.innerHTML = `
        <span class="log-icon">${icon}</span>
        <span class="log-time">[${timeStr}]</span>
        <span class="log-msg log-${type}">${message}</span>
    `;
    
    panel.appendChild(logEntry);
    panel.scrollTop = panel.scrollHeight;
    
    while (panel.children.length > 15) {
        panel.removeChild(panel.firstChild);
    }
}

// ================================
// GESTION DE LA TEMPÉRATURE
// ================================
function updateTemperature(elapsed) {
    const minutes = Math.floor(elapsed / 60000);
    
    // La température monte progressivement toutes les 30 minutes jusqu'à 1000°C
    const targetTemp = Math.min((minutes / 30) * maxTemperature, maxTemperature);
    
    if (!isCooling) {
        temperature = Math.min(temperature + 1, targetTemp);
    } else {
        temperature = Math.max(temperature - 2, 0);
        if (temperature === 0) {
            isCooling = false;
            addPanelLog('Refroidissement terminé. Reprise de la production.', 'success');
        }
    }
    
    // Mise à jour de l'affichage
    const tempGauge = document.getElementById('temp-gauge');
    const tempValue = document.getElementById('temp-value');
    
    if (tempGauge && tempValue) {
        const percentage = (temperature / maxTemperature) * 100;
        tempGauge.style.width = percentage + '%';
        tempValue.textContent = Math.floor(temperature) + '°C';
        
        // Changer la couleur selon la température
        if (temperature < 300) {
            tempGauge.style.background = 'linear-gradient(90deg, #ff8c00, #ffb700)';
        } else if (temperature < 600) {
            tempGauge.style.background = 'linear-gradient(90deg, #ff6600, #ff8c00)';
        } else if (temperature < 900) {
            tempGauge.style.background = 'linear-gradient(90deg, #ff4500, #ff6600)';
        } else {
            tempGauge.style.background = 'linear-gradient(90deg, #ff0000, #ff4500)';
        }
    }
    
    // Vérifier si on atteint 1000°C
    if (temperature >= maxTemperature && !isCooling) {
        startCooling();
    }
}

function startCooling() {
    isCooling = true;
    addPanelLog('⚠ TEMPÉRATURE CRITIQUE! Activation du système de refroidissement...', 'warning');
    
    // Effet visuel de refroidissement
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0, 150, 255, 0.3) 0%, transparent 70%);
        z-index: 9997;
        pointer-events: none;
        animation: cooling-effect 3s ease-in-out;
    `;
    
    document.body.appendChild(overlay);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cooling-effect {
            0% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => overlay.remove(), 3000);
    
    showIndustrialPopup('❄ REFROIDISSEMENT EN COURS', 'Le four atteint sa température maximale. Refroidissement automatique activé.');
}

// ================================
// CHRONOMÈTRE DE PRODUCTION
// ================================
function initProductionTimer() {
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
    
    setTimeout(() => {
        addPanelLog(`Connexion établie le ${formattedTime}`, 'success');
        addPanelLog('Four de fusion initialisé', 'success');
        addPanelLog('Capteurs de température opérationnels', 'success');
    }, 1000);
    
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isPaused) return;
    
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    updateTimerDisplay(minutes, seconds);
    updateTemperature(elapsed);
    updateMiniGauges();
    checkProductionMilestones(minutes, seconds);
}

function updateTimerDisplay(minutes, seconds) {
    const timerText = `⏱ Production: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    let timerElement = document.getElementById('live-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'live-timer';
        timerElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            border: 3px solid rgba(255, 183, 0, 0.4);
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.2rem;
            color: #ffb700;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 0 20px rgba(255, 183, 0, 0.3);
            animation: pulse-industrial 2s ease-in-out infinite;
        `;
        document.body.appendChild(timerElement);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-industrial {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(255, 183, 0, 0.3);
                    border-color: rgba(255, 183, 0, 0.4);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(255, 183, 0, 0.6);
                    border-color: rgba(255, 183, 0, 0.7);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    timerElement.textContent = timerText;
}

function updateMiniGauges() {
    const pressure = 60 + Math.random() * 30;
    const energy = 70 + Math.random() * 25;
    const yield = 50 + Math.random() * 40;
    
    const pressureGauge = document.getElementById('pressure-gauge');
    const energyGauge = document.getElementById('energy-gauge');
    const yieldGauge = document.getElementById('yield-gauge');
    
    if (pressureGauge) pressureGauge.style.width = pressure + '%';
    if (energyGauge) energyGauge.style.width = energy + '%';
    if (yieldGauge) yieldGauge.style.width = yield + '%';
}

function checkProductionMilestones(minutes, seconds) {
    if (seconds !== 0) return;
    
    let message = '';
    let type = 'timer';
    
    switch (minutes) {
        case 5:
            message = '⚒️ La forge est chaude ! Le travail de titan commence !';
            type = 'heat';
            break;
        case 15:
            message = '💪 Production optimale ! Tu forges ton avenir, ingénieur !';
            type = 'success';
            break;
        case 30:
            message = '🔥 Température montante ! Concentration au maximum !';
            type = 'heat';
            addPanelLog('Température: ' + Math.floor(temperature) + '°C - Montée progressive', 'heat');
            break;
        case 45:
            message = '☕ Temps de pause ! Même les forges ont besoin de repos !';
            type = 'pause';
            startPause();
            break;
    }
    
    if (message) {
        addPanelLog(message, type);
        showIndustrialPopup('🏭 ALERTE PRODUCTION', message);
    }
}

function startPause() {
    isPaused = true;
    pauseStartTime = Date.now();
    
    addPanelLog('Mise en pause de la production - 15 minutes', 'pause');
    
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        animation: fadeIn 0.5s ease;
    `;
    
    pauseOverlay.innerHTML = `
        <div style="text-align: center; color: #ffb700;">
            <h2 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 183, 0, 0.8);">☕ PAUSE TECHNIQUE</h2>
            <p style="font-size: 1.8rem; font-weight: bold;" id="pause-countdown">15:00</p>
            <p style="font-size: 1.1rem; opacity: 0.7; margin-top: 20px;">Le four se repose... Toi aussi !</p>
            <div style="margin-top: 30px;">
                <div style="display: inline-block; width: 60px; height: 60px; border: 4px solid rgba(255, 183, 0, 0.3); border-top-color: #ffb700; border-radius: 50%; animation: spin-gear 2s linear infinite;"></div>
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
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin-gear {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function endPause() {
    isPaused = false;
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) pauseOverlay.remove();
    
    startTime = Date.now();
    
    addPanelLog('⚡ Reprise de la production ! Le four redémarre !', 'success');
    showIndustrialPopup('🔥 REPRISE', 'Le four est rallumé ! Au travail, ingénieur !');
}

function showIndustrialPopup(title, message) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #ffb700 0%, #ff8c00 100%);
        color: #0a0a0a;
        padding: 35px 60px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 
            0 0 50px rgba(255, 183, 0, 0.8),
            inset 0 2px 10px rgba(255, 255, 255, 0.3);
        animation: industrialPopup 0.5s ease forwards, industrialPopupOut 0.5s ease 6.5s forwards;
        max-width: 80%;
        text-align: center;
        border: 3px solid rgba(255, 215, 0, 0.8);
    `;
    
    popup.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">${title}</h3>
        <p style="font-size: 1.3rem;">${message}</p>
    `;
    
    document.body.appendChild(popup);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes industrialPopup {
            0% {
                transform: translate(-50%, -50%) scale(0) rotate(-10deg);
            }
            60% {
                transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
            }
            100% {
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
        }
        @keyframes industrialPopupOut {
            to {
                transform: translate(-50%, -50%) scale(0) rotate(10deg);
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
// ÉTINCELLES AU CLIC
// ================================
function initClickSparks() {
    const clickSparksContainer = document.getElementById('click-sparks');
    
    document.addEventListener('click', (e) => {
        createClickSpark(e.clientX, e.clientY, clickSparksContainer);
    });
}

function createClickSpark(x, y, container) {
    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 30 + Math.random() * 40;
        
        spark.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 10px #ffb700;
            pointer-events: none;
            animation: click-spark-${i}-${Date.now()} 0.6s ease-out forwards;
        `;
        
        const keyframes = `
            @keyframes click-spark-${i}-${Date.now()} {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        container.appendChild(spark);
        
        setTimeout(() => {
            spark.remove();
            styleSheet.remove();
        }, 600);
    }
}

// ================================
// TRANSITION MÉCANIQUE
// ================================
function initMechanicalTransitions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('href');
            
            // Créer overlay de transition mécanique
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0a;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: mechanical-slide 0.8s ease forwards;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; color: #ffb700; margin-bottom: 20px; animation: gear-spin 1s linear infinite;">⚙</div>
                    <p style="color: #ffb700; font-size: 1.5rem; font-weight: bold; text-shadow: 0 0 10px rgba(255, 183, 0, 0.6);">
                        CHARGEMENT DU MODULE...
                    </p>
                    <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
                        <div style="width: 15px; height: 15px; background: #ffb700; border-radius: 50%; animation: dot-bounce 1s ease-in-out infinite;"></div>
                        <div style="width: 15px; height: 15px; background: #ffb700; border-radius: 50%; animation: dot-bounce 1s ease-in-out 0.2s infinite;"></div>
                        <div style="width: 15px; height: 15px; background: #ffb700; border-radius: 50%; animation: dot-bounce 1s ease-in-out 0.4s infinite;"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Sons mécaniques (optionnel)
            playMechanicalSound();
            
            // Redirection
            setTimeout(() => {
                window.location.href = target;
            }, 1200);
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mechanical-slide {
            0% {
                clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            }
            100% {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
        }
        @keyframes gear-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes dot-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

function playMechanicalSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Son de clic mécanique
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ================================
// SONS AMBIANTS
// ================================
function initAmbientSounds() {
    document.addEventListener('keypress', () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 150;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
    });
}

// ================================
// EFFET DE MARTEAU (Easter Egg)
// ================================
function initHammerEasterEgg() {
    let hammerSequence = [];
    const targetSequence = ['h', 'a', 'm', 'm', 'e', 'r'];
    
    document.addEventListener('keydown', (e) => {
        hammerSequence.push(e.key.toLowerCase());
        
        if (hammerSequence.length > targetSequence.length) {
            hammerSequence.shift();
        }
        
        if (JSON.stringify(hammerSequence) === JSON.stringify(targetSequence)) {
            activateHammerMode();
            hammerSequence = [];
        }
    });
}

function activateHammerMode() {
    addPanelLog('🔨 MODE MARTEAU ACTIVÉ!', 'success');
    
    // Effet de frappe de marteau sur toute la page
    document.body.style.animation = 'hammer-strike 0.5s ease 3';
    
    // Créer des étincelles partout
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createClickSpark(x, y, document.getElementById('click-sparks'));
        }, i * 50);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes hammer-strike {
            0%, 100% { transform: translateY(0) scale(1); }
            25% { transform: translateY(-10px) scale(1.02); }
            50% { transform: translateY(5px) scale(0.98); }
            75% { transform: translateY(-3px) scale(1.01); }
        }
    `;
    document.head.appendChild(style);
    
    // Son de marteau
    playHammerSound();
}

function playHammerSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 80;
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 300);
    }
}

// ================================
// ANIMATION DES VOYANTS
// ================================
function animatePanelLights() {
    const warningLight = document.querySelector('.light-warning');
    const dangerLight = document.querySelector('.light-danger');
    
    // Le voyant warning clignote aléatoirement
    setInterval(() => {
        if (Math.random() > 0.7 && warningLight) {
            warningLight.style.opacity = '0.3';
            setTimeout(() => {
                warningLight.style.opacity = '1';
            }, 200);
        }
    }, 2000);
    
    // Le voyant danger s'active si température > 800°C
    setInterval(() => {
        if (temperature > 800 && dangerLight) {
            dangerLight.style.background = '#ff5f56';
            dangerLight.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 95, 86, 0.8)';
            dangerLight.style.animation = 'blink-danger 1s ease-in-out infinite';
        } else if (dangerLight) {
            dangerLight.style.background = 'rgba(255, 95, 86, 0.3)';
            dangerLight.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.6)';
            dangerLight.style.animation = 'none';
        }
    }, 1000);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink-danger {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// SURVEILLANCE DE LA TEMPÉRATURE
// ================================
function monitorTemperature() {
    setInterval(() => {
        if (temperature >= maxTemperature * 0.9 && !isCooling) {
            addPanelLog(`⚠ Température élevée: ${Math.floor(temperature)}°C`, 'warning');
        }
        
        if (temperature >= maxTemperature * 0.5 && temperature < maxTemperature * 0.9) {
            if (Math.random() > 0.95) {
                addPanelLog(`Température stable: ${Math.floor(temperature)}°C`, 'heat');
            }
        }
    }, 5000);
}

// ================================
// EFFET DE PULSATION SUR LES STATS
// ================================
function pulseStatsOnMilestone() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            const pulse = stat.querySelector('.stat-pulse');
            if (pulse) {
                pulse.style.animation = 'none';
                setTimeout(() => {
                    pulse.style.animation = 'pulse-ring 2s ease-in-out infinite';
                }, 10);
            }
        });
    });
}

// ================================
// EFFET DE CHALEUR PROGRESSIF
// ================================
function updateHeatEffect() {
    setInterval(() => {
        const heatOverlay = document.querySelector('.heat-overlay');
        if (heatOverlay && temperature > 0) {
            const intensity = Math.min(temperature / maxTemperature, 1);
            heatOverlay.style.opacity = 0.3 + (intensity * 0.4);
            
            // Changer la couleur selon la température
            if (temperature > 700) {
                heatOverlay.style.background = `radial-gradient(circle at 50% 80%, 
                    rgba(255, 0, 0, ${0.2 * intensity}) 0%, 
                    transparent 60%)`;
            } else if (temperature > 400) {
                heatOverlay.style.background = `radial-gradient(circle at 50% 80%, 
                    rgba(255, 140, 0, ${0.15 * intensity}) 0%, 
                    transparent 60%)`;
            }
        }
    }, 1000);
}

// ================================
// MESSAGES ALÉATOIRES DE PRODUCTION
// ================================
function randomProductionMessages() {
    const messages = [
        'Extraction du minerai en cours...',
        'Analyse de la composition chimique...',
        'Fusion du métal à haute température...',
        'Contrôle qualité en cours...',
        'Refroidissement progressif...',
        'Calibrage des instruments...',
        'Mesure de la densité...',
        'Optimisation du rendement...'
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7 && !isPaused) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            addPanelLog(randomMsg, 'info');
        }
    }, 15000);
}

// ================================
// EFFET DE VIBRATION SUR FORTE TEMPÉRATURE
// ================================
function vibrateOnHighTemp() {
    setInterval(() => {
        if (temperature > maxTemperature * 0.8 && !isCooling) {
            document.body.style.animation = 'subtle-shake 0.3s ease';
            setTimeout(() => {
                document.body.style.animation = 'none';
            }, 300);
        }
    }, 3000);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtle-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// INITIALISATION GLOBALE
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Créer les étincelles d'intro
    setTimeout(() => {
        createIntroSparks();
    }, 1000);
    
    // Attendre la fin de l'intro
    setTimeout(() => {
        initOreCanvas();
        createSparkParticles();
        typeText();
        animateStats();
        showWelcomeNotification();
        initProductionTimer();
        initClickSparks();
        initMechanicalTransitions();
        initAmbientSounds();
        initHammerEasterEgg();
        animatePanelLights();
        monitorTemperature();
        pulseStatsOnMilestone();
        updateHeatEffect();
        randomProductionMessages();
        vibrateOnHighTemp();
        
        addPanelLog('Système de forge initialisé', 'success');
        addPanelLog('Capteurs opérationnels', 'success');
        addPanelLog('Prêt pour la production', 'info');
    }, 3500);
});

// ================================
// GESTION DU REDIMENSIONNEMENT
// ================================
window.addEventListener('resize', () => {
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
        e.returnValue = 'La production est en cours ! Êtes-vous sûr de vouloir quitter la forge ?';
        return e.returnValue;
    }
});

// ================================
// EFFET DE PARTICULES AU SCROLL
// ================================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 0 && Math.random() > 0.8) {
        const x = Math.random() * window.innerWidth;
        const y = window.scrollY + Math.random() * window.innerHeight;
        createClickSpark(x, y, document.getElementById('click-sparks'));
    }
});

// ================================
// SONS DE FORGE AU HOVER DES BOUTONS
// ================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 300;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            });
        });
    }, 3500);
});