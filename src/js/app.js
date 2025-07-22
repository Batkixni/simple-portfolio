// 簡化版本 - 使用CSS類控制cursor效果
console.log("App.js loaded");

// 全局變量
let cursor = null;
let cursorFollower = null;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Smooth scroll variables
let isScrolling = false;

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

// Enhanced smooth scrolling function
function smoothScrollTo(target, duration = 500) {
  const targetPosition = target.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Better easing curve - cubic-bezier(0.25, 0.46, 0.45, 0.94)
  function ease(t, b, c, d) {
    t /= d;
    return c * (t * t * t * (t * (t * 6 - 15) + 10)) + b;
  }

  requestAnimationFrame(animation);
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

// Add smooth scrolling for mouse wheel with better responsiveness
let scrollTimeout;
let isWheelScrolling = false;

document.addEventListener(
  "wheel",
  function (e) {
    if (isScrolling) return;

    e.preventDefault();

    if (!isWheelScrolling) {
      isWheelScrolling = true;
      const delta = e.deltaY;
      const scrollTop = window.pageYOffset;
      const scrollAmount =
        Math.abs(delta) > 100
          ? delta > 0
            ? 300
            : -300
          : delta > 0
            ? 150
            : -150;
      const targetScroll = scrollTop + scrollAmount;

      window.scrollTo({
        top: Math.max(
          0,
          Math.min(
            document.body.scrollHeight - window.innerHeight,
            targetScroll,
          ),
        ),
        behavior: "smooth",
      });

      setTimeout(() => {
        isWheelScrolling = false;
      }, 50);
    }
  },
  { passive: false },
);

console.log("App.js setup complete");
