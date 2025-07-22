// 簡化版本 - 使用CSS類控制cursor效果
console.log("App.js loaded");

// Browser compatibility checks
const supportsModernScrolling =
  "scrollBehavior" in document.documentElement.style;
const supportsSmoothScroll =
  CSS.supports && CSS.supports("scroll-behavior", "smooth");

// 全局變量
let cursor = null;
let cursorFollower = null;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Enhanced smooth scroll variables
let isScrolling = false;
let scrollVelocity = 0;
let scrollMomentum = 0;
let momentumFrame = null;

// 平滑跟隨動畫函數
function animateFollower() {
  const diffX = mouseX - followerX;
  const diffY = mouseY - followerY;

  followerX += diffX * 0.1; // 調整跟隨速度
  followerY += diffY * 0.1;

  if (cursorFollower) {
    cursorFollower.style.left = followerX - 20 + "px";
    cursorFollower.style.top = followerY - 20 + "px";
  }

  requestAnimationFrame(animateFollower);
}

// 等待頁面完全載入
window.addEventListener("load", function () {
  console.log("Window loaded");

  // 初始化cursor
  cursor = document.querySelector(".cursor");
  cursorFollower = document.querySelector(".cursor-follower");

  console.log("Cursor elements:", cursor, cursorFollower);

  if (cursor && cursorFollower) {
    console.log("Cursor elements found, setting up mouse listener");

    // 啟動跟隨動畫
    animateFollower();

    // 滑鼠移動事件
    document.addEventListener("mousemove", function (e) {
      if (window.innerWidth > 768) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // 主cursor即時跟隨
        cursor.style.left = e.clientX - 10 + "px";
        cursor.style.top = e.clientY - 10 + "px";
      }
    });

    // Hover效果 - 使用CSS類
    document.addEventListener("mouseover", function (e) {
      // 作品項目
      if (e.target.closest(".portfolio-item")) {
        cursor.className = "cursor hover-item";
        cursorFollower.className = "cursor-follower hover-item";
      }
      // 導航連結
      else if (e.target.matches(".nav-link")) {
        cursor.className = "cursor hover-link";
        cursorFollower.className = "cursor-follower hover-link";
      }
      // 按鈕和其他可點擊元素
      else if (
        e.target.matches(
          "a, button, .modal-close, .portfolio-link, .theme-toggle",
        )
      ) {
        cursor.className = "cursor hover-button";
        cursorFollower.className = "cursor-follower hover-button";
      }
      // 文字元素
      else if (
        e.target.matches(
          "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
        )
      ) {
        cursor.className = "cursor hover-text";
        cursorFollower.className = "cursor-follower hover-text";
      }
    });

    // 移出hover效果
    document.addEventListener("mouseout", function (e) {
      if (
        e.target.closest(".portfolio-item") ||
        e.target.matches(
          "a, button, .nav-link, .modal-close, .portfolio-link, .theme-toggle",
        ) ||
        e.target.matches(
          "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
        )
      ) {
        cursor.className = "cursor";
        cursorFollower.className = "cursor-follower";
      }
    });

    console.log("Mouse move listener added");
  } else {
    console.error("Cursor elements not found!");
  }

  // 主題切換
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", function () {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      themeIcon.textContent = newTheme === "light" ? "🌙" : "☀️";
      localStorage.setItem("theme", newTheme);

      console.log("Theme switched to:", newTheme);
    });

    // 初始化主題
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeIcon.textContent = savedTheme === "light" ? "🌙" : "☀️";
  }
});

// Modern smooth scrolling using native CSS scroll-behavior with fallback
function smoothScrollTo(target, duration = 800) {
  const targetPosition = target.offsetTop - 80; // Account for nav height

  if (supportsModernScrolling && supportsSmoothScroll) {
    // Use native smooth scrolling for better performance
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  } else {
    // Fallback for older browsers
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

// Enhanced momentum scrolling for wheel events
function applyMomentumScrolling() {
  if (Math.abs(scrollMomentum) < 0.1) {
    scrollMomentum = 0;
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
    return;
  }

  window.scrollBy(0, scrollMomentum);
  scrollMomentum *= 0.92; // Friction coefficient for smooth deceleration

  momentumFrame = requestAnimationFrame(applyMomentumScrolling);
}

// 導航連結功能
document.addEventListener("DOMContentLoaded", function () {
  // 導航連結平滑滾動
  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        isScrolling = true;
        smoothScrollTo(targetElement);
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      }
    });
  });

  // 處理導航連結，特別是帶有錨點的連結
  document.addEventListener("click", function (e) {
    // 處理作品項目點擊
    const portfolioItem = e.target.closest(".portfolio-item");
    if (portfolioItem) {
      const workLink = portfolioItem.querySelector("a");
      if (workLink) {
        // 設置內部導航標記
        sessionStorage.setItem("internalNavigation", "true");
        // 如果有轉場管理器，讓它處理轉場
        if (window.transitionManager && window.transitionManager.isHomepage()) {
          sessionStorage.setItem("fromHomepage", "true");
        }
      }
      return; // 讓轉場管理器處理作品項目的導航
    }

    // 處理所有內部連結點擊
    const link = e.target.closest("a");
    if (link && link.href) {
      const href = link.getAttribute("href");
      // 檢查是否為內部連結
      if (
        href &&
        (href.startsWith("/") ||
          href.startsWith("./") ||
          href.startsWith("../") ||
          (!href.startsWith("http") &&
            !href.startsWith("mailto:") &&
            !href.startsWith("tel:")))
      ) {
        sessionStorage.setItem("internalNavigation", "true");
      }
    }

    // 處理回到首頁的錨點連結
    if (e.target.matches('a[href^="/#"]')) {
      const hash = e.target.getAttribute("href").substring(1);
      if (window.location.pathname === "/") {
        // 如果已經在首頁，進行平滑滾動
        e.preventDefault();
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          isScrolling = true;
          smoothScrollTo(targetElement);
          setTimeout(() => {
            isScrolling = false;
          }, 500);
        }
      }
      // 如果不在首頁，讓瀏覽器正常導航到首頁+錨點
    }
  });
});

// HTMX事件處理
document.addEventListener("htmx:beforeRequest", function (e) {
  if (e.target.classList.contains("portfolio-grid")) {
    e.target.innerHTML = '<div class="loading">載入中...</div>';
  }
});

document.addEventListener("htmx:responseError", function (e) {
  console.error("HTMX Request Error:", e.detail);
  e.target.innerHTML = '<div class="loading">載入失敗，請重新整理頁面</div>';
});

// HTMX載入完成後，為新載入的作品項目添加轉場支持
document.addEventListener("htmx:afterRequest", function (e) {
  if (e.target.classList.contains("portfolio-grid")) {
    // 為新載入的作品項目添加轉場標記
    const portfolioItems = e.target.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.transitionManager && window.transitionManager.isHomepage()) {
          sessionStorage.setItem("fromHomepage", "true");
        }
      });
    });
  }
});

// Enhanced smooth wheel scrolling with momentum
let lastWheelTime = 0;
let wheelTimeout = null;

document.addEventListener(
  "wheel",
  function (e) {
    if (isScrolling) return;

    // Check if user prefers reduced motion or browser doesn't support smooth scrolling
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !supportsModernScrolling
    ) {
      return; // Let browser handle native scrolling
    }

    const now = performance.now();
    const timeDelta = now - lastWheelTime;
    lastWheelTime = now;

    // Only apply custom scrolling for trackpad/smooth wheels
    if (Math.abs(e.deltaY) < 50 && timeDelta < 100) {
      e.preventDefault();

      // Add to momentum
      scrollVelocity = e.deltaY * 0.8;
      scrollMomentum += scrollVelocity;

      // Clamp momentum to prevent excessive speed
      scrollMomentum = Math.max(-15, Math.min(15, scrollMomentum));

      // Start momentum animation if not already running
      if (!momentumFrame) {
        momentumFrame = requestAnimationFrame(applyMomentumScrolling);
      }

      // Clear any existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      // Stop momentum after inactivity
      wheelTimeout = setTimeout(() => {
        scrollMomentum *= 0.5;
      }, 150);
    }
    // For mouse wheels or large deltas, use native scrolling
  },
  { passive: false },
);

// Performance optimization: throttle scroll events
let isScrollEventThrottled = false;

function throttledScrollHandler() {
  if (!isScrollEventThrottled) {
    isScrollEventThrottled = true;
    requestAnimationFrame(() => {
      // Handle any scroll-related logic here if needed
      isScrollEventThrottled = false;
    });
  }
}

// Add passive scroll listener for better performance
document.addEventListener("scroll", throttledScrollHandler, { passive: true });

// Cleanup momentum scrolling on page visibility change
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    scrollMomentum = 0;
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", function () {
  scrollMomentum = 0;
  if (momentumFrame) {
    cancelAnimationFrame(momentumFrame);
    momentumFrame = null;
  }
});

console.log("App.js setup complete with enhanced smooth scrolling");
