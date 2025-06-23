// Battery Status Management
class BatteryManager {
    constructor() {
        this.batteryIndicator = document.getElementById('batteryIndicator');
        this.batteryLevel = document.getElementById('batteryLevel');
        this.batteryText = document.getElementById('batteryText');
        this.batteryStatus = document.getElementById('batteryStatus');
        
        this.init();
    }
    
    async init() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.updateBatteryInfo(battery);
                
                // Listen for battery changes
                battery.addEventListener('levelchange', () => this.updateBatteryInfo(battery));
                battery.addEventListener('chargingchange', () => this.updateBatteryInfo(battery));
            } else {
                this.showFallbackBattery();
            }
        } catch {
            this.showFallbackBattery();
        }
    }
    
    updateBatteryInfo(battery) {
        const level = Math.round(battery.level * 100);
        const isCharging = battery.charging;
        
        // Update battery level visual
        this.batteryLevel.style.width = `${level}%`;
        
        // Update battery level color based on percentage
        if (level <= 20) {
            this.batteryLevel.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
        } else if (level <= 50) {
            this.batteryLevel.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc00)';
        } else {
            this.batteryLevel.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        }
        
        // Update text
        this.batteryText.textContent = `${level}%`;
        this.batteryStatus.textContent = isCharging ? 'charging' : 'discharging';
        
        // Add charging animation
        this.batteryIndicator.classList.toggle('charging', isCharging);
    }
    
    showFallbackBattery() {
        // Show a simulated battery status if API is not available
        this.batteryLevel.style.width = '75%';
        this.batteryText.textContent = '75%';
        this.batteryStatus.textContent = 'unknown';
        this.batteryIndicator.style.opacity = '0.7';
    }
}

// Goon Counter Animation
class GoonCounter {
    constructor() {
        this.counter = document.getElementById('goonCounter');
        this.baseValue = 412414;
        this.currentValue = this.baseValue;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Start the floating animation
        this.startFloatingAnimation();
        
        // Add click interaction
        this.counter.addEventListener('click', () => {
            this.incrementCounter();
        });
        
        // Add hover effect
        this.counter.addEventListener('mouseenter', () => {
            this.counter.style.transform = 'scale(1.1)';
        });
        
        this.counter.addEventListener('mouseleave', () => {
            this.counter.style.transform = 'scale(1)';
        });
    }
    
    startFloatingAnimation() {
        // The floating animation is handled by CSS
        // This method can be used for additional JavaScript-based animations
        addGlobalInterval(() => {
            if (!this.isAnimating) {
                this.simulateTick();
            }
        }, 3000); // Simulate a tick every 3 seconds
    }
    
    simulateTick() {
        // Simulate the counter ticking up occasionally
        if (Math.random() < 0.3) { // 30% chance every 3 seconds
            this.incrementCounter();
        }
    }
    
    incrementCounter() {
        this.isAnimating = true;
        this.currentValue++;
        
        // Animate the number change
        this.animateNumberChange(this.currentValue);
        
        // Reset animation flag after animation completes
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }
    
    animateNumberChange(newValue) {
        const duration = 500;
        const startTime = performance.now();
        const startValue = parseInt(this.counter.textContent.replace(/,/g, ''));
        const difference = newValue - startValue;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (difference * easeOutQuart));
            
            this.counter.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.counter.textContent = newValue.toLocaleString();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Page Load Effects
class PageEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Add subtle background animation
        this.addBackgroundAnimation();
        
        // Add typing effect to title
        this.addTypingEffect();
        
        // Remove the problematic scroll animations
        // this.addScrollAnimations();
    }
    
    addBackgroundAnimation() {
        // Create subtle moving gradient effect
        const body = document.body;
        let hue = 0;
        
        addGlobalInterval(() => {
            hue = (hue + 0.1) % 360;
            body.style.background = `
                linear-gradient(135deg, 
                    hsl(${hue}, 5%, 4%) 0%, 
                    hsl(${hue + 10}, 5%, 8%) 50%, 
                    hsl(${hue}, 5%, 6%) 100%)
            `;
        }, 5000);
    }
    
    addTypingEffect() {
        const title = document.querySelector('.title');
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic (debounced for performance)
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let rafId = null;
        let mouseX = 0, mouseY = 0;
        const updateCursor = () => {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            rafId = null;
        };
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!rafId) rafId = requestAnimationFrame(updateCursor);
        });

        // Add hover effect for links and buttons
        document.querySelectorAll('a, button, .player-control').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Entry Screen Logic
    const entryScreen = document.getElementById('entryScreen');
    const mainContainer = document.querySelector('.container');
    const audio = document.getElementById('backgroundSong');

    if (!entryScreen) return; // Exit if there's no entry screen

    const enterSite = () => {
        if (entryScreen.classList.contains('fade-out')) return;

        // Start playing audio at user's system volume
        const playAndProceed = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audio.volume = 0.5;
                    // Fade out entry screen and show main content
                    entryScreen.classList.add('fade-out');
                    mainContainer.classList.remove('hidden');
                    setup3DTilt();
                    entryScreen.addEventListener('transitionend', () => {
                        entryScreen.remove();
                    });
                    entryScreen.removeEventListener('click', enterSite);
                    document.removeEventListener('keydown', enterSite);
                    // Hide audio prompt if visible
                    const audioPrompt = document.getElementById('audioPrompt');
                    if (audioPrompt) audioPrompt.style.display = 'none';
                }).catch(() => {
                    // Show audio prompt if playback fails
                    const audioPrompt = document.getElementById('audioPrompt');
                    if (audioPrompt) audioPrompt.style.display = 'block';
                    const audioPromptBtn = document.getElementById('audioPromptBtn');
                    if (audioPromptBtn) {
                        audioPromptBtn.onclick = () => {
                            playAndProceed();
                        };
                    }
                });
            }
        };
        playAndProceed();
    };

    // Only allow entry on click or safe keydown (not system keys)
    entryScreen.addEventListener('click', enterSite);
    document.addEventListener('keydown', (e) => {
        // Ignore modifier/system keys
        if (
            e.altKey || e.ctrlKey || e.metaKey || e.shiftKey ||
            ["Alt", "Control", "Shift", "Meta", "OS", "CapsLock", "Tab", "Escape", "ContextMenu"].includes(e.key)
        ) {
            return;
        }
        // Allow Enter, Space, or alphanumeric keys
        if (
            e.key === "Enter" ||
            e.key === " " ||
            (/^[a-zA-Z0-9]$/.test(e.key))
        ) {
            enterSite();
        }
    });

    // Initialize components
    new BatteryManager();
    new GoonCounter();
    new PageEffects();
    
    // Add some ambient effects
    addAmbientEffects();

    function setup3DTilt() {
        const aboutSection = document.querySelector('.about-section');
        if (!aboutSection) return;
    
        // --- MOUSE LOGIC FOR DESKTOP ---
        if (!isMobile()) {
            let isHovering = false;
            let currentRotateX = 0, currentRotateY = 0;
            let targetRotateX = 0, targetRotateY = 0;
            
            const animate = () => {
                currentRotateX += (targetRotateX - currentRotateX) * 0.1;
                currentRotateY += (targetRotateY - currentRotateY) * 0.1;
                aboutSection.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
                if (isHovering) requestAnimationFrame(animate);
            };
            
            aboutSection.addEventListener('mouseenter', () => {
                isHovering = true;
                animate();
            });
            
            aboutSection.addEventListener('mousemove', (e) => {
                const rect = aboutSection.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                const maxRotation = 8;
                targetRotateX = Math.max(-maxRotation, Math.min(maxRotation, (mouseY / (rect.height / 2)) * -maxRotation));
                targetRotateY = Math.max(-maxRotation, Math.min(maxRotation, (mouseX / (rect.width / 2)) * maxRotation));
            });
            
            aboutSection.addEventListener('mouseleave', () => {
                isHovering = false;
                targetRotateX = 0;
                targetRotateY = 0;
                const returnToCenter = () => {
                    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
                    currentRotateY += (targetRotateY - currentRotateY) * 0.1;
                    aboutSection.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
                    if (Math.abs(currentRotateX) > 0.1 || Math.abs(currentRotateY) > 0.1) {
                        requestAnimationFrame(returnToCenter);
                    }
                };
                returnToCenter();
            });
            return;
        }
    
        // --- GYROSCOPE LOGIC FOR MOBILE ---
        const initGyroTilt = () => {
            let currentRotateX = 0, currentRotateY = 0;
            let targetRotateX = 0, targetRotateY = 0;
            const easing = 0.08;
    
            const animate = () => {
                currentRotateX += (targetRotateX - currentRotateX) * easing;
                currentRotateY += (targetRotateY - currentRotateY) * easing;
                aboutSection.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
                requestAnimationFrame(animate);
            };
            animate();
    
            window.addEventListener('deviceorientation', (e) => {
                if (e.beta === null || e.gamma === null) return;
                const maxTilt = 12;
                const beta = e.beta;  // Front-back tilt
                const gamma = e.gamma; // Left-right tilt
    
                const clampedBeta = Math.max(-45, Math.min(45, beta));
                const clampedGamma = Math.max(-45, Math.min(45, gamma));
                
                targetRotateX = (clampedBeta / 45) * maxTilt;
                targetRotateY = (clampedGamma / 45) * maxTilt;
            });
        };
    
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+
            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        initGyroTilt();
                    }
                })
                .catch(() => {});
        } else if ('DeviceOrientationEvent' in window) {
            // Android and other devices
            initGyroTilt();
        }
    }

    // Custom Audio Player Logic
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (audio && playPauseBtn) {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        let originalVolume = 0.5;
        let isUserPaused = false;

        const updateOriginalVolume = () => {
            // Only update if audio is playing and not user-paused
            if (!audio.paused && !isUserPaused && Math.abs(audio.volume - originalVolume) > 0.05) {
                originalVolume = audio.volume;
            }
        };

        // Remove all system event volume changes
        const handleVisibilityChange = () => {};
        const handleWindowFocus = () => {};
        const handleWindowBlur = () => {};

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                isUserPaused = false;
                audio.volume = originalVolume;
                audio.play();
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                if (playPauseBtn.parentElement.parentElement) {
                    playPauseBtn.parentElement.parentElement.classList.add('is-playing');
                }
            } else {
                isUserPaused = true;
                // Do NOT update originalVolume here, just pause
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                if (playPauseBtn.parentElement.parentElement) {
                    playPauseBtn.parentElement.parentElement.classList.remove('is-playing');
                }
            }
        });

        audio.addEventListener('play', () => {
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
            if (playPauseBtn.parentElement.parentElement) {
                playPauseBtn.parentElement.parentElement.classList.add('is-playing');
            }
        });

        audio.addEventListener('pause', () => {
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
            if (playPauseBtn.parentElement.parentElement) {
                playPauseBtn.parentElement.parentElement.classList.remove('is-playing');
            }
        });

        audio.addEventListener('playing', () => {
            if (audio.volume === 0.5) {
                originalVolume = 0.5;
            }
        }, { once: true });

        addGlobalInterval(() => {
            if (!isUserPaused) {
                updateOriginalVolume();
            }
        }, 5000);
    }
});

// Ambient Effects
function addAmbientEffects() {
    // Add subtle particle effect
    createParticles();
    
    // Add cursor trail effect (only on desktop)
    if (!isMobile()) {
        addCursorTrail();
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// --- PATCH: Prevent memory leaks from dynamic DOM nodes and event listeners ---
let globalIntervals = [];
let ambientParticles = [];
let cursorTrailElements = [];
let cursorTrailMouseMove = null;

function addGlobalInterval(fn, ms) {
    const id = setInterval(fn, ms);
    globalIntervals.push(id);
    return id;
}
window.addEventListener('beforeunload', () => {
    globalIntervals.forEach(clearInterval);
    globalIntervals = [];
    // Remove ambient particles
    ambientParticles.forEach(p => p.remove());
    ambientParticles = [];
    // Remove cursor trail elements
    cursorTrailElements.forEach(el => el.remove());
    cursorTrailElements = [];
    // Remove cursor trail mousemove listener
    if (cursorTrailMouseMove) {
        document.removeEventListener('mousemove', cursorTrailMouseMove);
        cursorTrailMouseMove = null;
    }
});

function createParticles() {
    const container = document.querySelector('.container');
    if (!container) return;
    // Remove old particles if any
    ambientParticles.forEach(p => p.remove());
    ambientParticles = [];
    const particleCount = isMobile() ? 15 : 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        particle.style.cssText = `
            position: fixed;
            width: ${isMobile() ? '2px' : '3px'};
            height: ${isMobile() ? '2px' : '3px'};
            background: rgba(255, 255, 255, ${isMobile() ? '0.2' : '0.3'});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float-particle ${10 + Math.random() * 15}s infinite linear;
        `;
        container.appendChild(particle);
        ambientParticles.push(particle);
    }
}

function addCursorTrail() {
    // Remove old trail elements if any
    cursorTrailElements.forEach(el => el.remove());
    cursorTrailElements = [];
    const maxTrailLength = 18;
    for (let i = 0; i < maxTrailLength; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            filter: blur(2px);
        `;
        document.body.appendChild(el);
        cursorTrailElements.push(el);
    }
    const positionHistory = [];
    // Remove previous listener if any
    if (cursorTrailMouseMove) {
        document.removeEventListener('mousemove', cursorTrailMouseMove);
    }
    cursorTrailMouseMove = (e) => {
        positionHistory.push({ x: e.clientX, y: e.clientY });
        if (positionHistory.length > maxTrailLength) {
            positionHistory.shift();
        }
        cursorTrailElements.forEach(el => {
            el.style.opacity = '0';
        });
        positionHistory.forEach((pos, index) => {
            const el = cursorTrailElements[index];
            if (!el) return;
            const progress = index / (positionHistory.length - 1);
            const opacity = progress * 0.4;
            const size = progress * 8;
            el.style.opacity = opacity;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.left = `${pos.x - size / 2}px`;
            el.style.top = `${pos.y - size / 2}px`;
        });
    };
    document.addEventListener('mousemove', cursorTrailMouseMove);
}

// Add CSS for ambient effects
const ambientStyles = `
    @keyframes float-particle {
        0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
        }
    }
    
    .charging {
        animation: charging-pulse 2s ease-in-out infinite;
    }
    
    @keyframes charging-pulse {
        0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        50% {
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
        }
    }
`;

// Inject ambient styles
const styleSheet = document.createElement('style');
styleSheet.textContent = ambientStyles;
document.head.appendChild(styleSheet); 