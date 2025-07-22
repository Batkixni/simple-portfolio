// Theme Management
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const htmlElement = document.documentElement;

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
}

// Set theme
function setTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update icon
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  }
}

// Toggle theme
function toggleTheme() {
  const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);

  // Update cursor colors after theme change
  setTimeout(updateCursorColors, 50);
}

// Theme toggle event listener
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Initialize theme on page load
initTheme();

// Update cursor colors after theme initialization
function updateCursorColors() {
  if (cursor && cursorFollower && window.innerWidth > 768) {
    const cursorColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--cursor-color")
      .trim();

    gsap.set(cursor, { backgroundColor: cursorColor });
    gsap.set(cursorFollower, { borderColor: cursorColor });
  }
}

// Call after theme initialization
updateCursorColors();

// Custom Cursor
let cursor = document.querySelector(".cursor");
let cursorFollower = document.querySelector(".cursor-follower");

// Update cursor position
document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 768) {
    gsap.to(cursor, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(cursorFollower, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.8,
      ease: "power2.out",
    });
  }
});

// Cursor hover effects
document.addEventListener("mouseover", (e) => {
  // Portfolio items - bigger scale
  if (e.target.closest(".portfolio-item")) {
    gsap.to(cursor, {
      scale: 2.5,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
    gsap.to(cursorFollower, {
      scale: 2,
      duration: 0.5,
      ease: "power2.out",
    });
  }
  // Navigation links - medium scale
  else if (e.target.matches(".nav-link")) {
    gsap.to(cursor, {
      scale: 1.7,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
    gsap.to(cursorFollower, {
      scale: 1.5,
      duration: 0.4,
      ease: "power2.out",
    });
  }
  // Other interactive elements - small scale
  else if (e.target.matches("a, button, .modal-close, .portfolio-link")) {
    gsap.to(cursor, {
      scale: 1.3,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
    gsap.to(cursorFollower, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out",
    });
  }
});

document.addEventListener("mouseout", (e) => {
  if (
    e.target.closest(".portfolio-item") ||
    e.target.matches("a, button, .nav-link, .modal-close, .portfolio-link")
  ) {
    gsap.to(cursor, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(cursorFollower, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  }
});

// Text hover effect
document.addEventListener("mouseover", (e) => {
  if (
    e.target.matches(
      "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
    )
  ) {
    const cursorColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--cursor-color")
      .trim();

    gsap.to(cursor, {
      scale: 0.7,
      backgroundColor: cursorColor,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(cursorFollower, {
      scale: 1.5,
      borderWidth: 2,
      duration: 0.4,
      ease: "power2.out",
    });
  }
});

document.addEventListener("mouseout", (e) => {
  if (
    e.target.matches(
      "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
    )
  ) {
    const cursorColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--cursor-color")
      .trim();

    gsap.to(cursor, {
      scale: 1,
      backgroundColor: cursorColor,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(cursorFollower, {
      scale: 1,
      borderWidth: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  }
});

// Initial page load animations
gsap
  .timeline()
  .to(".hero-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
  })
  .to(
    ".hero-subtitle",
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.5",
  );

// Section titles animation on scroll
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".section-title").forEach((title) => {
  gsap.fromTo(
    title,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    },
  );
});

// Portfolio items stagger animation
function animatePortfolioItems() {
  gsap.utils.toArray(".portfolio-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

// Smooth scroll for navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      gsap.to(window, {
        scrollTo: {
          y: targetElement.offsetTop - 100,
          autoKill: false,
        },
        duration: 1,
        ease: "power2.inOut",
      });
    }
  });
});

// Modal functionality
function openModal(workPath) {
  const modal = document.getElementById("work-modal");
  const modalBody = document.getElementById("modal-body");

  // Show modal with animation
  gsap.set(modal, { display: "block" });
  gsap.fromTo(
    modal,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.3,
    },
  );

  gsap.fromTo(
    ".modal-content",
    {
      scale: 0.8,
      y: 50,
    },
    {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    },
  );

  // Load work content via HTMX
  htmx.ajax("GET", `/api/work/${workPath}`, {
    target: "#modal-body",
  });

  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("work-modal");

  gsap.to(modal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    },
  });
}

// Modal event listeners
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-close") ||
    e.target.classList.contains("modal")
  ) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Handle portfolio item clicks
document.addEventListener("click", (e) => {
  if (e.target.closest(".portfolio-item")) {
    const workPath = e.target.closest(".portfolio-item").dataset.work;
    if (workPath) {
      openModal(workPath);
    }
  }
});

// HTMX event listeners
document.addEventListener("htmx:afterSwap", (e) => {
  // Re-animate portfolio items after HTMX loads content
  if (e.target.classList.contains("portfolio-grid")) {
    animatePortfolioItems();
  }
});

// Parallax effect for hero section
gsap.to(".hero-title", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

gsap.to(".hero-subtitle", {
  yPercent: -30,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

// Navigation background opacity on scroll with theme-aware colors
function updateNavBackground() {
  const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
  const navBgColor =
    currentTheme === "dark"
      ? "rgba(0, 0, 0, 0.98)"
      : "rgba(255, 255, 255, 0.98)";

  gsap.to(".nav", {
    backgroundColor: navBgColor,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top -50px",
      end: "bottom bottom",
      toggleActions: "play none none reverse",
    },
  });
}

// Update navigation background on theme change
updateNavBackground();

// Listen for theme changes to update scroll trigger
themeToggle?.addEventListener("click", () => {
  setTimeout(updateNavBackground, 100);
});

// Loading state management
document.addEventListener("htmx:beforeRequest", (e) => {
  if (e.target.classList.contains("portfolio-grid")) {
    e.target.innerHTML = '<div class="loading">載入中...</div>';
  }
});

// Error handling
document.addEventListener("htmx:responseError", (e) => {
  console.error("HTMX Request Error:", e.detail);
  e.target.innerHTML = '<div class="loading">載入失敗，請重新整理頁面</div>';
});

// Initialize ScrollTrigger refresh on window resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
