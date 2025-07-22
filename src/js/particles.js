let particles = [];
let numParticles = 50;
let canvas;
let particlesStarted = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  // Don't initialize particles immediately - wait for loading to complete
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  // Check if loading is complete
  checkLoadingStatus();
}

function checkLoadingStatus() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen && loadingScreen.style.display !== "none") {
    // Loading still active, check again later
    setTimeout(checkLoadingStatus, 100);
    return;
  }

  // Loading complete, start particles
  particlesStarted = true;
}

function draw() {
  // Clear background with transparency
  clear();

  // Only animate particles if loading is complete
  if (particlesStarted) {
    // Update and display particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].display();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(2, 6);
    this.opacity = random(0.1, 0.3);
    this.color = this.getThemeColor();
  }

  getThemeColor() {
    // Check if light theme is active
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    return isLight
      ? color(0, 0, 0, this.opacity * 255)
      : color(255, 255, 255, this.opacity * 255);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen edges
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    // Update color based on current theme
    this.color = this.getThemeColor();
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

// Listen for theme changes
document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        // Theme changed, particles will update their colors in the next frame
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});
