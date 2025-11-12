// ================================
// VARIABLES GLOBALES
// ================================
let isTransitioning = false;
let currentPdfUrl = '';

// ================================
// PARTICULES DE FOND AGRICOLES
// ================================
function createBackgroundParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;
    
    const particles = ['🌾', '🌿', '🍃', '🌱', '🌸', '🦋', '🐝'];
    
    function createParticle() {
        if (isTransitioning) return;
        
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 150;
        const duration = 10 + Math.random() * 10;
        const size = 15 + Math.random() * 25;
        
        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${size}px;
            opacity: ${0.3 + Math.random() * 0.4};
            pointer-events: none;
            z-index: 0;
            animation: particle-rise-${Date.now()} ${duration}s ease-out forwards;
        `;
        
        const keyframes = `
            @keyframes particle-rise-${Date.now()} {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                100% {
                    transform: translate(${endX - startX}px, ${-window.innerHeight - 100}px) rotate(${360 * Math.random()}deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, duration * 1000);
    }
    
    setInterval(createParticle, 1200);
    createParticle();
}

// ================================
// ANIMATION DES CARTES D'EXAMENS
// ================================
function animateExamCards() {
    const cards = document.querySelectorAll('.exam-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2
    });
    
    cards.forEach(card => {
        observer.observe(card);
        
        // Effet de feuilles au hover
        card.addEventListener('mouseenter', () => {
            createCardLeaves(card);
        });
    });
}

function createCardLeaves(card) {
    const leaves = ['🍃', '🌿', '🌱'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const leaf = document.createElement('span');
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 60 + Math.random() * 40;
            
            leaf.style.cssText = `
                position: absolute;
                font-size: 1.5rem;
                pointer-events: none;
                top: 50%;
                left: 50%;
                z-index: 100;
                animation: leaf-burst-${i}-${Date.now()} 1s ease-out forwards;
            `;
            
            const keyframes = `
                @keyframes leaf-burst-${i}-${Date.now()} {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1.5) rotate(${360 * Math.random()}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            card.appendChild(leaf);
            
            setTimeout(() => {
                leaf.remove();
                style.remove();
            }, 1000);
        }, i * 100);
    }
}

// ================================
// GESTION DU PDF VIEWER
// ================================
function initPdfViewer() {
    const examButtons = document.querySelectorAll('.exam-btn');
    const pdfOverlay = document.getElementById('pdf-overlay');
    const pdfFrame = document.getElementById('pdf-frame');
    const pdfTitle = document.getElementById('pdf-title');
    const closeBtn = document.getElementById('close-pdf');
    const downloadBtn = document.getElementById('download-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const loadingSpinner = document.getElementById('pdf-loading');
    
    examButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const pdfUrl = btn.getAttribute('data-pdf');
            const examTitle = btn.closest('.exam-card').querySelector('.exam-title').textContent;
            
            openPdfViewer(pdfUrl, examTitle);
        });
    });
    
    function openPdfViewer(url, title) {
        if (!url) {
            alert('Le fichier PDF n\'est pas disponible pour le moment.');
            return;
        }
        
        currentPdfUrl = url;
        pdfTitle.textContent = title;
        pdfOverlay.classList.add('active');
        loadingSpinner.classList.add('active');
        
        // Charger le PDF
        pdfFrame.src = url;
        
        pdfFrame.onload = () => {
            loadingSpinner.classList.remove('active');
            playOpenSound();
        };
        
        pdfFrame.onerror = () => {
            loadingSpinner.classList.remove('active');
            alert('Erreur lors du chargement du PDF. Vérifiez que le fichier existe.');
        };
        
        // Bloquer le scroll du body
        document.body.style.overflow = 'hidden';
    }
    
    function closePdfViewer() {
        pdfOverlay.classList.remove('active');
        pdfFrame.src = '';
        currentPdfUrl = '';
        document.body.style.overflow = 'auto';
        playCloseSound();
    }
    
    // Fermer le viewer
    closeBtn.addEventListener('click', closePdfViewer);
    
    pdfOverlay.addEventListener('click', (e) => {
        if (e.target === pdfOverlay) {
            closePdfViewer();
        }
    });
    
    // Télécharger le PDF
    downloadBtn.addEventListener('click', () => {
        if (currentPdfUrl) {
            const link = document.createElement('a');
            link.href = currentPdfUrl;
            link.download = currentPdfUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            playDownloadSound();
        }
    });
    
    // Plein écran
    fullscreenBtn.addEventListener('click', () => {
        const container = document.querySelector('.pdf-viewer-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.log('Erreur plein écran:', err);
            });
            fullscreenBtn.querySelector('span').textContent = '⛶';
        } else {
            document.exitFullscreen();
            fullscreenBtn.querySelector('span').textContent = '⛶';
        }
    });
    
    // Fermer avec ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfOverlay.classList.contains('active')) {
            closePdfViewer();
        }
    });
}

// ================================
// SONS NATURE
// ================================
function playOpenSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    [400, 500, 600].forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, index * 100);
    });
}

function playCloseSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    [600, 500, 400].forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, index * 80);
    });
}

function playDownloadSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 500 + Math.random() * 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
}

// ================================
// ANIMATION DES RESSOURCES
// ================================
function animateResources() {
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 * index}s`;
        
        card.addEventListener('mouseenter', () => {
            playClickSound();
            createSparkles(card);
        });
        
        card.addEventListener('click', () => {
            showResourceMessage(card.querySelector('h3').textContent);
        });
    });
}

function createSparkles(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('span');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            
            sparkle.style.cssText = `
                position: absolute;
                font-size: 1.5rem;
                pointer-events: none;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle-pop 0.8s ease-out forwards;
            `;
            
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }, i * 100);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-pop {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: scale(1.5) rotate(180deg);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-sparkle]')) {
        style.setAttribute('data-sparkle', 'true');
        document.head.appendChild(style);
    }
}

function showResourceMessage(resourceName) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #90ee90 0%, #32cd32 100%);
        color: #1a3a1a;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 1.3rem;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: message-pop 0.5s ease forwards;
        text-align: center;
        border: 3px solid rgba(144, 238, 144, 0.8);
    `;
    
    message.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">🌿</div>
        <p>${resourceName}</p>
        <p style="font-size: 1rem; margin-top: 10px; opacity: 0.8;">Bientôt disponible !</p>
    `;
    
    document.body.appendChild(message);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes message-pop {
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
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        message.style.animation = 'message-pop 0.3s ease reverse forwards';
        setTimeout(() => {
            message.remove();
            style.remove();
        }, 300);
    }, 2000);
}

// ================================
// TRANSITIONS NAVIGATION
// ================================
function initNavigationTransitions() {
    const footerButtons = document.querySelectorAll('.footer-btn');
    
    footerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isTransitioning) return;
            isTransitioning = true;
            
            const target = btn.getAttribute('href');
            const isHome = btn.classList.contains('btn-home');
            
            playClickSound();
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #90ee90 0%, #32cd32 100%);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: ${isHome ? 'circle-expand' : 'slide-left'} 0.8s ease forwards;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 5rem; animation: icon-bounce 1s ease-in-out infinite;">
                        ${isHome ? '🏠' : '📚'}
                    </div>
                    <p style="color: white; font-size: 1.5rem; font-weight: bold; margin-top: 20px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
                        ${isHome ? 'Retour aux champs...' : 'Retour aux modules...'}
                    </p>
                    <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center; font-size: 2rem;">
                        <span style="animation: leaf-spin 2s linear infinite;">🍃</span>
                        <span style="animation: leaf-spin 2s linear infinite 0.3s;">🌿</span>
                        <span style="animation: leaf-spin 2s linear infinite 0.6s;">🌾</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes circle-expand {
                    0% {
                        clip-path: circle(0% at 50% 50%);
                    }
                    100% {
                        clip-path: circle(150% at 50% 50%);
                    }
                }
                @keyframes slide-left {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                @keyframes icon-bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                @keyframes leaf-spin {
                    0% {
                        transform: rotate(0deg) translateY(0);
                    }
                    100% {
                        transform: rotate(360deg) translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                window.location.href = target;
            }, 1200);
        });
    });
}

// ================================
// EASTER EGG : SUPER CROISSANCE
// ================================
function initGrowthEasterEgg() {
    let sequence = [];
    const target = ['h', 'a', 'r', 'v', 'e', 's', 't'];
    
    document.addEventListener('keydown', (e) => {
        sequence.push(e.key.toLowerCase());
        
        if (sequence.length > target.length) {
            sequence.shift();
        }
        
        if (JSON.stringify(sequence) === JSON.stringify(target)) {
            activateHarvest();
            sequence = [];
        }
    });
}

function activateHarvest() {
    const cards = document.querySelectorAll('.exam-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            // Animation de récolte
            card.style.transform = 'translateY(-20px) scale(1.1)';
            
            // Créer des graines qui tombent
            for (let i = 0; i < 20; i++) {
                createHarvestParticle(card, i);
            }
            
            setTimeout(() => {
                card.style.transform = '';
            }, 500);
        }, index * 200);
    });
    
    playHarvestSound();
    
    // Message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        color: white;
        padding: 40px 60px;
        border-radius: 25px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: harvest-message 3s ease forwards;
    `;
    
    message.innerHTML = `
        <div style="font-size: 5rem; margin-bottom: 20px;">🌾</div>
        <p>RÉCOLTE ABONDANTE !</p>
        <p style="font-size: 1.2rem; margin-top: 15px;">Tous les examens sont prêts !</p>
    `;
    
    document.body.appendChild(message);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes harvest-message {
            0%, 80% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => message.remove(), 3000);
}

function createHarvestParticle(card, index) {
    const particles = ['🌾', '🌽', '🥕', '🍅', '🥔'];
    const particle = document.createElement('span');
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    const startX = card.offsetLeft + card.offsetWidth / 2;
    const startY = card.offsetTop + card.offsetHeight / 2;
    
    particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: harvest-fall-${index} 2s ease-out forwards;
    `;
    
    const endX = startX + (Math.random() - 0.5) * 300;
    const endY = window.innerHeight + 50;
    
    const keyframes = `
        @keyframes harvest-fall-${index} {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${endX - startX}px, ${endY - startY}px) rotate(${360 * Math.random()}deg) scale(0.5);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
        style.remove();
    }, 2000);
}

function playHarvestSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    [300, 400, 500, 600, 700, 800].forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

// ================================
// INITIALISATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    createBackgroundParticles();
    animateExamCards();
    initPdfViewer();
    animateResources();
    initNavigationTransitions();
    initGrowthEasterEgg();
    
    console.log('🌾 Module Pratique Agricole chargé !');
    console.log('💡 Easter egg: tape "harvest" pour une surprise !');
});

// ================================
// GESTION RESPONSIVE
// ================================
window.addEventListener('resize', () => {
    const particles = document.querySelectorAll('.bg-particle');
    if (particles.length > 40) {
        particles.forEach((p, index) => {
            if (index < particles.length - 30) p.remove();
        });
    }
});s