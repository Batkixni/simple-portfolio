// Loading Animation and GSAP Entrance Animations
console.log("Animations.js loaded");

// Loading Animation Controller
class LoadingAnimation {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.progressBar = document.querySelector(".progress-bar");
    this.loadingSvg = document.querySelector("#loading-svg");
    this.loadingSvgPaths = document.querySelectorAll("#loading-svg path");
    this.loadingText = document.querySelector(".loading-text");
    this.progress = 0;
    this.isComplete = false;
    this.shouldSkipLoading = false;

    this.checkTransitionManager();
    this.init();
  }

  checkTransitionManager() {
    // 檢查是否有轉場管理器，並且是否應該跳過載入動畫
    if (window.transitionManager && window.transitionManager.isFromHomepage) {
      this.shouldSkipLoading = true;
    }
  }

  init() {
    if (this.shouldSkipLoading) {
      // 如果應該跳過載入動畫，立即隱藏載入畫面
      this.skipLoadingAnimation();
      return;
    }

    // Initialize SVG paths
    this.initializeSvgPaths();

    // Animate SVG logo in with scale
    gsap.to(this.loadingSvg, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.2,
    });

    // Animate SVG paths with draw-on effect
    this.animateSvgPaths();

    // Animate loading text in
    gsap.to(this.loadingText, {
      opacity: 0.7,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 1.0,
    });

    // Start progress animation
    this.startProgress();
  }

  initializeSvgPaths() {
    // Set initial state for SVG paths
    this.loadingSvgPaths.forEach((path) => {
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        fill: "transparent",
        stroke: "currentColor",
        strokeWidth: 2,
        opacity: 1,
      });
    });
  }

  animateSvgPaths() {
    // Create timeline for path animations
    const pathTimeline = gsap.timeline({ delay: 0.5 });

    this.loadingSvgPaths.forEach((path, index) => {
      // Draw path with stroke
      pathTimeline.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        index * 0.4,
      );

      // Fill path after drawing
      pathTimeline.to(
        path,
        {
          fill: "currentColor",
          strokeWidth: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        index * 0.4 + 1.2,
      );

      // Add subtle glow pulsing effect
      pathTimeline.to(
        path,
        {
          filter: "drop-shadow(0 0 8px currentColor)",
          duration: 0.6,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        index * 0.4 + 1.8,
      );
    });
  }

  skipLoadingAnimation() {
    console.log("Skipping loading animation - smooth transition from homepage");
    this.loadingScreen.style.display = "none";
    this.isComplete = true;
    this.startEntranceAnimations();
  }

  startProgress() {
    // Simulate loading progress
    const progressTween = gsap.to(this, {
      progress: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        this.progressBar.style.width = this.progress + "%";

        // Add glow effect to SVG based on progress
        if (this.loadingSvg) {
          const glowIntensity = this.progress / 100;
          this.loadingSvg.style.filter = `drop-shadow(0 0 ${glowIntensity * 20}px var(--text-color))`;
        }
      },
      onComplete: () => {
        this.complete();
      },
    });
  }

  complete() {
    this.isComplete = true;

    // Final flourish animation for SVG
    gsap.to(this.loadingSvg, {
      scale: 1.1,
      duration: 0.5,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    // Small delay before hiding
    setTimeout(() => {
      this.hide();
    }, 800);
  }

  hide() {
    // Fade out loading screen
    gsap.to(this.loadingScreen, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        this.loadingScreen.style.display = "none";
        // Start entrance animations after loading is complete
        this.startEntranceAnimations();
      },
    });
  }

  startEntranceAnimations() {
    // Check if we're on a work detail page
    const isWorkPage = document.querySelector(".work-detail-page");

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
    this.heroSection = document.querySelector(".work-hero-fullscreen");
    this.heroCover = document.querySelector(".work-hero-cover");
    this.heroOverlay = document.querySelector(".work-hero-overlay");
    this.nav = document.querySelector(".nav");
    this.timeline = gsap.timeline();
  }

  init() {
    console.log("Starting work page entrance animations");
    this.createWorkPageSequence();
  }

  createWorkPageSequence() {
    // First animate the navigation
    this.timeline.to(
      this.nav,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0,
    );

    // Animate the color cover sliding up to reveal the image
    if (this.heroCover) {
      this.timeline.to(
        this.heroCover,
        {
          y: "-100%",
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.3,
      );
    }

    // Fade in the hero overlay content after the cover animation
    if (this.heroOverlay) {
      this.timeline.to(
        this.heroOverlay,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        1.0,
      );
    }

    // Animate other page elements
    this.timeline.to(
      ".work-info-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      1.2,
    );

    this.timeline.to(
      ".work-content-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      1.4,
    );

    this.timeline.to(
      ".footer",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.6,
    );

    // Setup scroll animations for work page
    this.setupWorkPageScrollAnimations();
  }

  setupWorkPageScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate work content elements when they come into view
    gsap.utils
      .toArray(
        ".work-article h1, .work-article h2, .work-article h3, .work-article p, .work-article img",
      )
      .forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
  }
}

// Entrance Animations Controller
class EntranceAnimations {
  constructor() {
    this.animateElements = document.querySelectorAll(".animate-element");
    this.timeline = gsap.timeline();
  }

  init() {
    console.log("Starting entrance animations");
    this.createAnimationSequence();
  }

  createAnimationSequence() {
    // Navigation
    this.timeline.to(
      ".nav",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.2,
    );

    // Hero avatar
    this.timeline.to(
      ".hero-avatar",
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      0.4,
    );

    // Hero title
    this.timeline.to(
      ".hero-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.5,
    );

    this.timeline.to(
      ".hero-subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.6,
    );

    // Works main title
    this.timeline.to(
      ".works-main-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.8,
    );

    // Section titles
    this.timeline.to(
      ".section-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
      },
      1.0,
    );

    // Portfolio items with stagger
    this.timeline.to(
      ".portfolio-item",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: {
          amount: 0.8,
          from: "start",
        },
      },
      1.2,
    );

    // Footer
    this.timeline.to(
      ".footer",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.8,
    );

    // Add scroll-triggered animations for elements that come into view later
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate portfolio items when they come into view
    gsap.utils.toArray(".portfolio-item").forEach((item, index) => {
      // Only apply to items that aren't already animated
      if (!item.classList.contains("animated")) {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    // Animate other elements when they come into view
    gsap.utils
      .toArray(".animate-element:not(.portfolio-item)")
      .forEach((element) => {
        if (!element.classList.contains("animated")) {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

    // Special animation for works sections
    gsap.utils.toArray(".portfolio-section").forEach((section) => {
      const title = section.querySelector(".section-title");
      const items = section.querySelectorAll(".portfolio-item");

      if (title && items.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        // Animate title first
        tl.fromTo(
          title,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
        );

        // Then animate items with stagger
        tl.fromTo(
          items,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.3",
        );
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
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen && loadingScreen.style.display === "none") {
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
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, starting animations");

  // 等待轉場管理器初始化完成
  const initializeAnimations = () => {
    // Start loading animation
    const loading = new LoadingAnimation();

    // Initialize particle integration
    const particles = new ParticleIntegration();
    particles.init();

    // Setup theme change animations
    setupThemeAnimations();
  };

  // 如果轉場管理器已經存在，立即初始化
  if (window.transitionManager) {
    initializeAnimations();
  } else {
    // 否則等待轉場管理器載入
    const waitForTransitionManager = setInterval(() => {
      if (window.transitionManager) {
        clearInterval(waitForTransitionManager);
        initializeAnimations();
      }
    }, 10);

    // 設置超時，避免無限等待
    setTimeout(() => {
      clearInterval(waitForTransitionManager);
      if (!window.transitionManager) {
        console.log(
          "Transition manager not found, proceeding with normal initialization",
        );
        initializeAnimations();
      }
    }, 1000);
  }
});

// Theme change animations
function setupThemeAnimations() {
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      // Animate theme change
      gsap.to("body", {
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Animate all text elements
      gsap.to(".animate-element", {
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
  }
}

// Export for use in other files
window.AnimationController = {
  LoadingAnimation,
  EntranceAnimations,
  WorkPageAnimations,
  ParticleIntegration,
};

console.log("Animations.js setup complete");
