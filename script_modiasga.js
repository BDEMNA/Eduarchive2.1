// ================================
// VARIABLES GLOBALES
// ================================
let isTransitioning = false;

// ================================
// PARTICULES NATURE FLOTTANTES
// ================================
function createFloatingParticles() {
    const particles = ['🌸', '🌼', '🌺', '🍃', '🌾', '🌿', '🦋', '🐝'];
    const body = document.body;
    
    function createParticle() {
        if (isTransitioning) return;
        
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 100;
        const duration = 8 + Math.random() * 7;
        
        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${15 + Math.random() * 20}px;
            opacity: ${0.4 + Math.random() * 0.4};
            pointer-events: none;
            z-index: 1;
            animation: particle-float-${Date.now()} ${duration}s ease-out forwards;
        `;
        
        const keyframes = `
            @keyframes particle-float-${Date.now()} {
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
        
        body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, duration * 1000);
    }
    
    setInterval(createParticle, 1500);
    createParticle();
}

// ================================
// EFFET DE CROISSANCE SUR LES LIVRES
// ================================
function initBookGrowthEffect() {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        book.addEventListener('mouseenter', () => {
            // Créer des feuilles autour du livre
            for (let i = 0; i < 3; i++) {
                createLeafBurst(book, i);
            }
        });
    });
}

function createLeafBurst(book, index) {
    const leaf = document.createElement('span');
    leaf.textContent = ['🍃', '🌿', '🌱'][index];
    leaf.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 10;
        animation: leaf-burst-${index} 0.8s ease-out forwards;
    `;
    
    const positions = [
        { top: '10%', left: '10%' },
        { top: '10%', right: '10%' },
        { bottom: '10%', left: '50%' }
    ];
    
    Object.assign(leaf.style, positions[index]);
    
    const keyframes = `
        @keyframes leaf-burst-${index} {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: scale(1.5) rotate(${180 + index * 60}deg) translateY(-20px);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    book.appendChild(leaf);
    
    setTimeout(() => {
        leaf.remove();
        style.remove();
    }, 800);
}

// ================================
// ANIMATION D'APPARITION DES LIVRES
// ================================
function animateBooksOnScroll() {
    const books = document.querySelectorAll('.book');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'book-appear 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1
    });
    
    books.forEach(book => observer.observe(book));
}

// ================================
// SON DE NATURE AU CLIC
// ================================
function playNatureSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 500 + Math.random() * 300;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// ================================
// TRANSITION NATURE VERS MODULES
// ================================
function initModuleTransitions() {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        book.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isTransitioning) return;
            isTransitioning = true;
            
            const target = book.getAttribute('href');
            
            // Son de nature
            playNatureSound();
            
            // Créer l'overlay de transition
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, #90ee90 0%, #32cd32 50%, #228b22 100%);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: growth-overlay 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center; position: relative;">
                    <div style="font-size: 6rem; animation: seed-sprout 1.2s ease-in-out infinite;">🌱</div>
                    <h2 style="color: white; font-size: 2rem; margin-top: 20px; text-shadow: 0 0 20px rgba(0, 0, 0, 0.5); animation: text-pulse 1.5s ease-in-out infinite;">
                        ${book.querySelector('h2').textContent}
                    </h2>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.2rem; margin-top: 15px;">
                        Ouverture du module...
                    </p>
                    <div style="margin-top: 30px; display: flex; gap: 20px; justify-content: center; font-size: 2.5rem;">
                        <span style="animation: leaf-spin 2s linear infinite;">🍃</span>
                        <span style="animation: leaf-spin 2s linear infinite 0.3s;">🌿</span>
                        <span style="animation: leaf-spin 2s linear infinite 0.6s;">🌾</span>
                        <span style="animation: leaf-spin 2s linear infinite 0.9s;">🌻</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Créer des feuilles qui tombent
            createFallingLeaves(overlay);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes growth-overlay {
                    0% {
                        clip-path: circle(0% at 50% 50%);
                    }
                    100% {
                        clip-path: circle(150% at 50% 50%);
                    }
                }
                @keyframes seed-sprout {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-30px) scale(1.3);
                    }
                }
                @keyframes text-pulse {
                    0%, 100% {
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
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
            }, 1500);
        });
    });
}

// ================================
// FEUILLES QUI TOMBENT
// ================================
function createFallingLeaves(container) {
    const leaves = ['🍃', '🍂', '🌿'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const leaf = document.createElement('div');
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${20 + Math.random() * 30}px;
                animation: fall-leaf-${i} ${2 + Math.random() * 3}s ease-in forwards;
                pointer-events: none;
            `;
            
            const keyframes = `
                @keyframes fall-leaf-${i} {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(${window.innerHeight + 100}px) rotate(${360 + Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            container.appendChild(leaf);
        }, i * 100);
    }
}

// ================================
// TRANSITION POUR LES BOUTONS FOOTER
// ================================
function initFooterTransitions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isTransitioning) return;
            isTransitioning = true;
            
            const target = btn.getAttribute('href');
            
            playNatureSound();
            
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
                animation: slide-up 0.6s ease forwards;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 5rem; animation: bounce-icon 1s ease-in-out infinite;">
                        ${btn.textContent.includes('accueil') ? '🏠' : '📝'}
                    </div>
                    <p style="color: #2e7d32; font-size: 1.5rem; font-weight: bold; margin-top: 20px;">
                        ${btn.textContent.includes('accueil') ? 'Retour aux champs...' : 'Chargement des devoirs...'}
                    </p>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slide-up {
                    0% {
                        transform: translateY(100%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
                @keyframes bounce-icon {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                window.location.href = target;
            }, 800);
        });
    });
}

// ================================
// EFFET DE VENT SUR LES LIVRES
// ================================
function createWindEffect() {
    const books = document.querySelectorAll('.book');
    
    setInterval(() => {
        if (Math.random() > 0.7 && !isTransitioning) {
            books.forEach((book, index) => {
                setTimeout(() => {
                    book.style.animation = 'none';
                    setTimeout(() => {
                        book.style.animation = '';
                    }, 10);
                }, index * 50);
            });
        }
    }, 8000);
}

// ================================
// COMPTEUR DE MODULES
// ================================
function displayModuleCount() {
    const books = document.querySelectorAll('.book');
    const header = document.querySelector('header p');
    
    if (header && books.length > 0) {
        const originalText = header.textContent;
        header.textContent = `${originalText} • ${books.length} modules disponibles`;
        header.style.animation = 'text-pulse 2s ease-in-out infinite';
    }
}

// ================================
// EASTER EGG : SUPER CROISSANCE
// ================================
function initGrowthEasterEgg() {
    let growthSequence = [];
    const targetSequence = ['g', 'r', 'o', 'w'];
    
    document.addEventListener('keydown', (e) => {
        growthSequence.push(e.key.toLowerCase());
        
        if (growthSequence.length > targetSequence.length) {
            growthSequence.shift();
        }
        
        if (JSON.stringify(growthSequence) === JSON.stringify(targetSequence)) {
            activateSuperGrowth();
            growthSequence = [];
        }
    });
}

function activateSuperGrowth() {
    const books = document.querySelectorAll('.book');
    
    books.forEach((book, index) => {
        setTimeout(() => {
            book.style.animation = 'none';
            book.style.transform = 'scale(0)';
            
            setTimeout(() => {
                book.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                book.style.transform = 'scale(1.1)';
                
                // Créer explosion de feuilles
                for (let i = 0; i < 10; i++) {
                    createLeafExplosion(book, i);
                }
                
                setTimeout(() => {
                    book.style.transform = 'scale(1)';
                    book.style.animation = '';
                }, 800);
            }, 100);
        }, index * 100);
    });
    
    playGrowthSound();
}

function createLeafExplosion(book, index) {
    const leaf = document.createElement('span');
    leaf.textContent = ['🍃', '🌿', '🌱', '🌾', '🌻'][index % 5];
    
    const angle = (Math.PI * 2 * index) / 10;
    const distance = 80 + Math.random() * 40;
    
    leaf.style.cssText = `
        position: absolute;
        font-size: 2rem;
        pointer-events: none;
        top: 50%;
        left: 50%;
        z-index: 100;
        animation: explode-leaf-${index} 1s ease-out forwards;
    `;
    
    const keyframes = `
        @keyframes explode-leaf-${index} {
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
    
    book.appendChild(leaf);
    
    setTimeout(() => {
        leaf.remove();
        style.remove();
    }, 1000);
}

function playGrowthSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    [200, 300, 400, 500, 600].forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

// ================================
// HOVER SONS SUBTILS
// ================================
function initHoverSounds() {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        book.addEventListener('mouseenter', () => {
            if (!isTransitioning) {
                playNatureSound();
            }
        });
    });
}

// ================================
// INITIALISATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    createFloatingParticles();
    initBookGrowthEffect();
    animateBooksOnScroll();
    initModuleTransitions();
    initFooterTransitions();
    createWindEffect();
    displayModuleCount();
    initGrowthEasterEgg();
    initHoverSounds();
    
    console.log('🌾 Bibliothèque agricole chargée !');
});

// ================================
// GESTION RESPONSIVE
// ================================
window.addEventListener('resize', () => {
    // Réajuster les particules si nécessaire
    const particles = document.querySelectorAll('.floating-particle');
    if (particles.length > 50) {
        particles.forEach((p, index) => {
            if (index < particles.length - 30) p.remove();
        });
    }
});