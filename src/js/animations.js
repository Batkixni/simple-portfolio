// Loading Animation and GSAP Entrance Animations
console.log("Animations.js loaded");

// Loading Animation Controller
class LoadingAnimation {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.querySelector('.progress-bar');
        this.loadingLogo = document.querySelector('.loading-logo h1');
        this.loadingText = document.querySelector('.loading-text');
        this.progress = 0;
        this.isComplete = false;

        this.init();
    }

    init() {
        // Animate loading logo in
        gsap.to(this.loadingLogo, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2
        });

        // Animate loading text in
        gsap.to(this.loadingText, {
            opacity: 0.7,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.5
        });

        // Start progress animation
        this.startProgress();
    }

    startProgress() {
        // Simulate loading progress
        const progressTween = gsap.to(this, {
            progress: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.progressBar.style.width = this.progress + '%';
            },
            onComplete: () => {
                this.complete();
            }
        });
    }

    complete() {
        this.isComplete = true;

        // Small delay before hiding
        setTimeout(() => {
            this.hide();
        }, 300);
    }

    hide() {
        // Fade out loading screen
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
                // Start entrance animations after loading is complete
                this.startEntranceAnimations();
            }
        });
    }

    startEntranceAnimations() {
        // Check if we're on a work detail page
        const isWorkPage = document.querySelector('.work-detail-page');

        if (isWorkPage) {
            // Initialize work page specific animations
            const workAnimations = new WorkPageAnimations();
            workAnimations.init();
        } else {
            // Initialize regular entrance animations
            const entranceAnimations = new EntranceAnimations();
            entranceAnimations.init();
        }
    }
}

// Work Page Animations Controller
class WorkPageAnimations {
    constructor() {
        this.heroSection = document.querySelector('.work-hero-fullscreen');
        this.heroCover = document.querySelector('.work-hero-cover');
        this.heroOverlay = document.querySelector('.work-hero-overlay');
        this.nav = document.querySelector('.nav');
        this.timeline = gsap.timeline();
    }

    init() {
        console.log("Starting work page entrance animations");
        this.createWorkPageSequence();
    }

    createWorkPageSequence() {
        // First animate the navigation
        this.timeline.to(this.nav, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 0);

        // Animate the color cover sliding up to reveal the image
        if (this.heroCover) {
            this.timeline.to(this.heroCover, {
                y: "-100%",
                duration: 1.2,
                ease: "power2.inOut"
            }, 0.3);
        }

        // Fade in the hero overlay content after the cover animation
        if (this.heroOverlay) {
            this.timeline.to(this.heroOverlay, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, 1.0);
        }

        // Animate other page elements
        this.timeline.to('.work-info-section', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 1.2);

        this.timeline.to('.work-content-section', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 1.4);

        this.timeline.to('.footer', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 1.6);

        // Setup scroll animations for work page
        this.setupWorkPageScrollAnimations();
    }

    setupWorkPageScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animate work content elements when they come into view
        gsap.utils.toArray('.work-article h1, .work-article h2, .work-article h3, .work-article p, .work-article img').forEach((element) => {
            gsap.fromTo(element, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}

// Entrance Animations Controller
class EntranceAnimations {
    constructor() {
        this.animateElements = document.querySelectorAll('.animate-element');
        this.timeline = gsap.timeline();
    }

    init() {
        console.log("Starting entrance animations");
        this.createAnimationSequence();
    }

    createAnimationSequence() {
        // Navigation
        this.timeline.to('.nav', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 0.2);

        // Hero section
        this.timeline.to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 0.4);

        this.timeline.to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 0.6);

        // Works main title
        this.timeline.to('.works-main-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, 0.8);

        // Section titles
        this.timeline.to('.section-title', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2
        }, 1.0);

        // Portfolio items with stagger
        this.timeline.to('.portfolio-item', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: {
                amount: 0.8,
                from: "start"
            }
        }, 1.2);

        // Footer
        this.timeline.to('.footer', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 1.8);

        // Add scroll-triggered animations for elements that come into view later
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animate portfolio items when they come into view
        gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
            // Only apply to items that aren't already animated
            if (!item.classList.contains('animated')) {
                gsap.fromTo(item, {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Animate other elements when they come into view
        gsap.utils.toArray('.animate-element:not(.portfolio-item)').forEach((element) => {
            if (!element.classList.contains('animated')) {
                gsap.fromTo(element, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Special animation for works sections
        gsap.utils.toArray('.portfolio-section').forEach((section) => {
            const title = section.querySelector('.section-title');
            const items = section.querySelectorAll('.portfolio-item');

            if (title && items.length > 0) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                });

                // Animate title first
                tl.fromTo(title, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });

                // Then animate items with stagger
                tl.fromTo(items, {
                    opacity: 0,
                    y: 40
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.1
                }, "-=0.3");
            }
        });
    }
}

// Particle Animation Integration
class ParticleIntegration {
    constructor() {
        this.isLoadingComplete = false;
    }

    init() {
        // Wait for loading to complete before starting particles
        const checkLoading = setInterval(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && loadingScreen.style.display === 'none') {
                this.isLoadingComplete = true;
                clearInterval(checkLoading);
                this.startParticles();
            }
        }, 100);
    }

    startParticles() {
        // Particles will start automatically via particles.js
        // This is just for coordination
        console.log("Particles can start now");
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, starting animations");

    // Start loading animation
    const loading = new LoadingAnimation();

    // Initialize particle integration
    const particles = new ParticleIntegration();
    particles.init();

    // Setup theme change animations
    setupThemeAnimations();
});

// Theme change animations
function setupThemeAnimations() {
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Animate theme change
            gsap.to('body', {
                duration: 0.3,
                ease: "power2.inOut"
            });

            // Animate all text elements
            gsap.to('.animate-element', {
                duration: 0.3,
                ease: "power2.inOut"
            });
        });
    }
}

// Export for use in other files
window.AnimationController = {
    LoadingAnimation,
    EntranceAnimations,
    WorkPageAnimations,
    ParticleIntegration
};

console.log("Animations.js setup complete");
