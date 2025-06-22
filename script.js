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
        } catch (error) {
            console.log('Battery API not available:', error);
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
        if (isCharging) {
            this.batteryIndicator.classList.add('charging');
        } else {
            this.batteryIndicator.classList.remove('charging');
        }
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
        setInterval(() => {
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
        const startValue = parseInt(this.counter.textContent);
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
        
        setInterval(() => {
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
    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
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
        audio.volume = 0.5; // Safety volume - 50% to avoid blasting eardrums
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback failed:", error);
            });
        }

        // Fade out entry screen
        entryScreen.classList.add('fade-out');

        // Fade in main content
        mainContainer.classList.remove('hidden');

        // Remove the entry screen from the DOM after the transition
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.remove();
        });
        
        // Remove this event listener so it only runs once
        entryScreen.removeEventListener('click', enterSite);
        document.removeEventListener('keydown', enterSite);
    };

    entryScreen.addEventListener('click', enterSite);
    document.addEventListener('keydown', enterSite);

    // Initialize components
    new BatteryManager();
    new GoonCounter();
    new PageEffects();
    new DiscordStatus('1380838876049834155');
    
    // Add some ambient effects
    addAmbientEffects();

    // 3D Tilt Effect for About Section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        if (!isMobile()) {
            // Desktop mouse tilt
            let isHovering = false;
            let currentRotateX = 0;
            let currentRotateY = 0;
            let targetRotateX = 0;
            let targetRotateY = 0;
            
            const animate = () => {
                currentRotateX += (targetRotateX - currentRotateX) * 0.1;
                currentRotateY += (targetRotateY - currentRotateY) * 0.1;
                
                aboutSection.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
                
                if (isHovering) {
                    requestAnimationFrame(animate);
                }
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
        } else {
            // Mobile gyroscope tilt
            window.addEventListener('deviceorientation', (e) => {
                const beta = e.beta; // X-axis rotation (front to back)
                const gamma = e.gamma; // Y-axis rotation (left to right)
                
                const maxRotation = 10;
                
                let rotateX = (beta - 45) * 0.3;
                let rotateY = gamma * 0.3;
                
                // Clamp values
                rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
                rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));
                
                aboutSection.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }
    }

    // Custom Audio Player Logic
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (audio && playPauseBtn) {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        // Page Visibility API for audio control
        let originalVolume = 1;
        let volumeTransition = null;
        
        const fadeVolume = (targetVolume, duration = 1000) => {
            // Clear any existing transition
            if (volumeTransition) {
                clearInterval(volumeTransition);
            }
            
            const startVolume = audio.volume;
            const volumeDifference = targetVolume - startVolume;
            const steps = 30; // 30 steps over 1 second
            const stepTime = duration / steps;
            const volumePerStep = volumeDifference / steps;
            
            let currentStep = 0;
            
            volumeTransition = setInterval(() => {
                currentStep++;
                audio.volume = startVolume + (volumePerStep * currentStep);
                
                if (currentStep >= steps) {
                    audio.volume = targetVolume; // Ensure exact target
                    clearInterval(volumeTransition);
                    volumeTransition = null;
                }
            }, stepTime);
        };
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched to another tab - lower volume gradually
                originalVolume = audio.volume;
                fadeVolume(0.3); // Fade to 30%
            } else {
                // User returned to the tab - restore volume gradually
                fadeVolume(originalVolume);
            }
        };

        const handleWindowFocus = () => {
            // User returned to the browser window - restore volume
            if (!document.hidden) {
                fadeVolume(originalVolume);
            }
        };

        const handleWindowBlur = () => {
            // User alt-tabbed to another app or minimized browser - lower volume
            originalVolume = audio.volume;
            fadeVolume(0.2); // Fade to 20% (even lower than tab switching)
        };

        // Listen for page visibility changes (tab switching)
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Listen for window focus/blur (alt-tab and minimize)
        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
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

        // Set initial state for the play/pause button when audio starts playing via `enterSite`
        audio.addEventListener('playing', () => {
             pauseIcon.style.display = 'block';
             playIcon.style.display = 'none';
        }, { once: true });
    }
});

class DiscordStatus {
    constructor(userId) {
        this.userId = userId;
        this.apiUrl = `https://api.lanyard.rest/v1/users/${this.userId}`;
        
        this.statusEl = document.getElementById('discordStatus');
        this.avatarEl = document.getElementById('discordAvatar');
        this.indicatorEl = document.getElementById('discordStatusIndicator');
        this.usernameEl = document.getElementById('discordUsername');
        this.activityEl = document.getElementById('discordActivity');
        
        this.init();
    }
    
    async init() {
        if (!this.statusEl) return;
        
        const fetchData = async () => {
            try {
                const res = await fetch(this.apiUrl);
                if (!res.ok) { // Check if response is successful (status 200-299)
                    throw new Error(`API returned status ${res.status}`);
                }
                const { data } = await res.json();
                this.updateStatus(data);
            } catch (error) {
                console.error('Error fetching Discord status:', error);
                this.showError();
            }
        };

        await fetchData(); // Initial fetch
        
        // Poll for updates every 30 seconds
        setInterval(fetchData, 30000);
    }
    
    updateStatus(data) {
        if (!data || !data.discord_user) {
            this.showError();
            return;
        }

        const { discord_user, discord_status, activities } = data;
        
        // Avatar
        this.avatarEl.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp`;
        
        // Status indicator
        this.indicatorEl.className = `discord-status-indicator ${discord_status}`;
        
        // Username
        this.usernameEl.textContent = discord_user.username;
        
        // Activity
        if (activities && activities.length > 0) {
            const activity = activities[0];
            let activityText = '';
            
            if (activity.name === 'Spotify') {
                activityText = `Listening to ${activity.details} by ${activity.state}`;
            } else if (activity.name === 'Visual Studio Code') {
                activityText = `Working on ${activity.details}`;
            } else {
                activityText = `Playing ${activity.name}`;
            }
            this.activityEl.textContent = activityText;
        } else {
            this.activityEl.textContent = 'No current activity';
        }
    }
    
    showError() {
        this.usernameEl.textContent = 'Error';
        this.activityEl.textContent = 'Could not fetch status';
        this.indicatorEl.className = 'discord-status-indicator offline';
    }
}

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

function createParticles() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Reduce particle count on mobile for better performance
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
    }
}

function addCursorTrail() {
    const trailElements = [];
    const maxTrailLength = 18; // A good length for a subtle trail

    // Create a pool of elements to be used for the trail
    for (let i = 0; i < maxTrailLength; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            filter: blur(2px); /* This creates the soft, faded look */
        `;
        document.body.appendChild(el);
        trailElements.push(el);
    }

    const positionHistory = [];

    document.addEventListener('mousemove', (e) => {
        positionHistory.push({ x: e.clientX, y: e.clientY });

        // Trim the history to the max trail length
        if (positionHistory.length > maxTrailLength) {
            positionHistory.shift();
        }
        
        // Hide all elements first to prevent artifacts
        trailElements.forEach(el => {
            el.style.opacity = '0';
        });

        // Update the trail based on the cursor's history
        positionHistory.forEach((pos, index) => {
            const el = trailElements[index];
            if (!el) return;

            // Progress will be 0 for the oldest point and 1 for the newest
            const progress = index / (positionHistory.length - 1);
            
            // The trail fades in from tail to head
            const opacity = progress * 0.4; 
            const size = progress * 8; // The trail gets bigger towards the cursor

            el.style.opacity = opacity;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.left = `${pos.x - size / 2}px`;
            el.style.top = `${pos.y - size / 2}px`;
        });
    });
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