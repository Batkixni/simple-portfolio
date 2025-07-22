// 404 Page P5.js Background Animation
// Advanced particle system with flow fields and digital effects

let particles = [];
let flowField = [];
let digitalLines = [];
let grid = [];
let noisePoints = [];
let cols, rows;
let noiseScale = 0.01;
let time = 0;
let glitchEffect = false;
let glitchTimer = 0;

// Animation parameters
const PARTICLE_COUNT = 120;
const DIGITAL_LINES_COUNT = 15;
const GRID_SIZE = 25;
const NOISE_POINTS_COUNT = 50;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("error-canvas-container");

    // Calculate grid dimensions
    cols = Math.floor(width / GRID_SIZE);
    rows = Math.floor(height / GRID_SIZE);

    // Initialize flow field
    flowField = new Array(cols * rows);

    // Initialize particle system
    initializeParticles();

    // Initialize digital lines
    initializeDigitalLines();

    // Initialize noise points
    initializeNoisePoints();
}

function draw() {
    // Set background with theme awareness
    background(getBackgroundColor());

    // Update global effects
    updateGlobalEffects();

    // Update and render flow field
    updateFlowField();

    // Render grid system
    renderGrid();

    // Update and render particles
    updateParticles();

    // Update and render digital lines
    updateDigitalLines();

    // Update and render noise points
    updateNoisePoints();

    // Render connections between particles
    renderConnections();

    // Apply glitch effects
    applyGlitchEffects();

    // Render digital overlay
    renderDigitalOverlay();

    // Increment time
    time += 0.005;
}

function initializeParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new ErrorParticle());
    }
}

function initializeDigitalLines() {
    digitalLines = [];
    for (let i = 0; i < DIGITAL_LINES_COUNT; i++) {
        digitalLines.push(new DigitalLine());
    }
}

function initializeNoisePoints() {
    noisePoints = [];
    for (let i = 0; i < NOISE_POINTS_COUNT; i++) {
        noisePoints.push(new NoisePoint());
    }
}

function updateGlobalEffects() {
    // Random glitch trigger
    if (random() < 0.008) {
        glitchEffect = true;
        glitchTimer = 30;
    }

    if (glitchTimer > 0) {
        glitchTimer--;
        if (glitchTimer <= 0) {
            glitchEffect = false;
        }
    }
}

function updateFlowField() {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols;
            let angle = noise(xoff, yoff, time * 0.5) * TWO_PI * 3;
            let magnitude = noise(xoff + 100, yoff + 100, time * 0.3);

            let v = p5.Vector.fromAngle(angle);
            v.setMag(magnitude);
            flowField[index] = v;

            xoff += noiseScale;
        }
        yoff += noiseScale;
    }
}

function renderGrid() {
    let col = getTextColor();
    col.setAlpha(30);
    stroke(col);
    strokeWeight(0.3);

    for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            let x = i * GRID_SIZE;
            let y = j * GRID_SIZE;

            let noiseVal = noise(i * noiseScale * 3, j * noiseScale * 3, time);

            if (noiseVal > 0.75) {
                let alpha = map(noiseVal, 0.75, 1, 20, 80);
                col.setAlpha(alpha);
                stroke(col);

                // Draw grid lines
                line(x, y, x + GRID_SIZE, y);
                line(x, y, x, y + GRID_SIZE);

                // Draw connection points
                if (noiseVal > 0.9) {
                    fill(col);
                    noStroke();
                    circle(x, y, 2);
                }
            }
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();

        if (particles[i].isDead()) {
            particles.splice(i, 1);
            particles.push(new ErrorParticle());
        }
    }
}

function updateDigitalLines() {
    for (let line of digitalLines) {
        line.update();
        line.display();
    }
}

function updateNoisePoints() {
    for (let point of noisePoints) {
        point.update();
        point.display();
    }
}

function renderConnections() {
    let col = getTextColor();

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(
                particles[i].pos.x, particles[i].pos.y,
                particles[j].pos.x, particles[j].pos.y
            );

            if (d < 100) {
                let alpha = map(d, 0, 100, 30, 0);
                col.setAlpha(alpha);
                stroke(col);
                strokeWeight(0.5);

                line(
                    particles[i].pos.x, particles[i].pos.y,
                    particles[j].pos.x, particles[j].pos.y
                );
            }
        }
    }
}

function applyGlitchEffects() {
    if (glitchEffect) {
        // Digital noise bars
        let col = getTextColor();
        col.setAlpha(random(50, 120));
        stroke(col);
        strokeWeight(random(1, 4));

        for (let i = 0; i < random(3, 8); i++) {
            let x = random(width);
            let y = random(height);
            let w = random(20, 200);
            let h = random(1, 5);

            rect(x, y, w, h);
        }

        // Color channel shift
        if (random() < 0.3) {
            loadPixels();
            let shift = int(random(-5, 5));

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let index = (x + y * width) * 4;
                    let shiftedIndex = ((x + shift) + y * width) * 4;

                    if (shiftedIndex >= 0 && shiftedIndex < pixels.length) {
                        pixels[index] = pixels[shiftedIndex]; // Red channel shift
                    }
                }
            }
            updatePixels();
        }
    }
}

function renderDigitalOverlay() {
    // Random digital artifacts
    if (random() < 0.02) {
        let col = getTextColor();
        col.setAlpha(random(20, 60));
        fill(col);
        noStroke();

        // Digital squares
        for (let i = 0; i < random(2, 6); i++) {
            let x = random(width);
            let y = random(height);
            let size = random(2, 8);
            rect(x, y, size, size);
        }
    }

    // Scanning lines
    if (random() < 0.01) {
        let col = getTextColor();
        col.setAlpha(random(10, 30));
        stroke(col);
        strokeWeight(1);

        let y = random(height);
        line(0, y, width, y);
    }
}

// Particle class with advanced behaviors
class ErrorParticle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = random(1, 3);
        this.size = random(2, 6);
        this.life = random(300, 600);
        this.maxLife = this.life;
        this.trail = [];
        this.maxTrailLength = 12;
        this.color = getTextColor();
        this.behavior = random(['flow', 'orbit', 'linear']);
        this.target = createVector(random(width), random(height));
    }

    update() {
        // Apply different behaviors
        switch(this.behavior) {
            case 'flow':
                this.followFlow();
                break;
            case 'orbit':
                this.orbit();
                break;
            case 'linear':
                this.moveLinear();
                break;
        }

        // Add random disturbance
        if (random() < 0.05) {
            let randomForce = p5.Vector.random2D();
            randomForce.mult(0.1);
            this.acc.add(randomForce);
        }

        // Update physics
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Update trail
        this.trail.push(this.pos.copy());
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Wrap around edges
        this.wrapAroundEdges();

        // Update life
        this.life--;

        // Change behavior occasionally
        if (random() < 0.002) {
            this.behavior = random(['flow', 'orbit', 'linear']);
            this.target = createVector(random(width), random(height));
        }
    }

    followFlow() {
        let x = Math.floor(this.pos.x / GRID_SIZE);
        let y = Math.floor(this.pos.y / GRID_SIZE);
        let index = x + y * cols;

        if (flowField[index]) {
            let force = flowField[index].copy();
            force.mult(0.5);
            this.acc.add(force);
        }
    }

    orbit() {
        let center = createVector(width/2, height/2);
        let toCenter = p5.Vector.sub(center, this.pos);
        let distance = toCenter.mag();

        if (distance > 0) {
            toCenter.normalize();
            toCenter.mult(0.1);

            // Create orbital motion
            let perpendicular = createVector(-toCenter.y, toCenter.x);
            perpendicular.mult(0.3);

            this.acc.add(toCenter);
            this.acc.add(perpendicular);
        }
    }

    moveLinear() {
        let toTarget = p5.Vector.sub(this.target, this.pos);
        let distance = toTarget.mag();

        if (distance < 20) {
            this.target = createVector(random(width), random(height));
        } else {
            toTarget.normalize();
            toTarget.mult(0.2);
            this.acc.add(toTarget);
        }
    }

    wrapAroundEdges() {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    display() {
        let alpha = map(this.life, 0, this.maxLife, 0, 255);
        this.color = getTextColor();

        // Draw trail
        for (let i = 0; i < this.trail.length - 1; i++) {
            let trailAlpha = map(i, 0, this.trail.length - 1, 0, alpha * 0.4);
            this.color.setAlpha(trailAlpha);
            stroke(this.color);
            strokeWeight(map(i, 0, this.trail.length - 1, 0.5, 2));

            if (this.trail[i + 1]) {
                line(
                    this.trail[i].x, this.trail[i].y,
                    this.trail[i + 1].x, this.trail[i + 1].y
                );
            }
        }

        // Draw main particle
        this.color.setAlpha(alpha * 0.8);
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size);

        // Draw glow effect occasionally
        if (random() < 0.1) {
            this.color.setAlpha(alpha * 0.2);
            fill(this.color);
            circle(this.pos.x, this.pos.y, this.size * 2.5);
        }
    }

    isDead() {
        return this.life <= 0;
    }
}

// Digital line effect class
class DigitalLine {
    constructor() {
        this.reset();
    }

    reset() {
        this.start = createVector(random(width), random(height));
        this.end = createVector(random(width), random(height));
        this.length = random(50, 300);
        this.angle = random(TWO_PI);
        this.speed = random(0.5, 2.5);
        this.life = random(100, 300);
        this.maxLife = this.life;
        this.strokeWeight = random(0.5, 2);
    }

    update() {
        // Move line
        this.start.x += cos(this.angle) * this.speed;
        this.start.y += sin(this.angle) * this.speed;

        // Update end point
        this.end.x = this.start.x + cos(this.angle) * this.length;
        this.end.y = this.start.y + sin(this.angle) * this.length;

        this.life--;

        // Reset if dead or out of bounds
        if (this.life <= 0 || this.isOutOfBounds()) {
            this.reset();
        }

        // Occasionally change direction
        if (random() < 0.01) {
            this.angle += random(-0.3, 0.3);
        }
    }

    isOutOfBounds() {
        return (this.start.x < -this.length || this.start.x > width + this.length ||
                this.start.y < -this.length || this.start.y > height + this.length);
    }

    display() {
        let alpha = map(this.life, 0, this.maxLife, 0, 120);
        let col = getTextColor();
        col.setAlpha(alpha);
        stroke(col);
        strokeWeight(this.strokeWeight);

        line(this.start.x, this.start.y, this.end.x, this.end.y);

        // Add end points
        if (random() < 0.3) {
            fill(col);
            noStroke();
            circle(this.start.x, this.start.y, 2);
            circle(this.end.x, this.end.y, 2);
        }
    }
}

// Noise point class for additional visual interest
class NoisePoint {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.noiseOffset = random(1000);
        this.size = random(1, 4);
        this.intensity = random(0.5, 1);
    }

    update() {
        // Use noise for organic movement
        this.pos.x = noise(this.noiseOffset, time) * width;
        this.pos.y = noise(this.noiseOffset + 100, time) * height;
        this.noiseOffset += 0.01;
    }

    display() {
        let alpha = noise(this.noiseOffset + 200, time) * 150 * this.intensity;
        let col = getTextColor();
        col.setAlpha(alpha);
        fill(col);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size);
    }
}

// Utility functions
function getBackgroundColor() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return isLight ? color(254, 253, 248) : color(26, 26, 26);
}

function getTextColor() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return isLight ? color(0, 0, 0) : color(255, 255, 255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Recalculate grid
    cols = Math.floor(width / GRID_SIZE);
    rows = Math.floor(height / GRID_SIZE);
    flowField = new Array(cols * rows);

    // Reset some elements for new canvas size
    initializeDigitalLines();
    initializeNoisePoints();
}

// Mouse interaction
function mouseMoved() {
    // Add attraction force to nearby particles
    for (let particle of particles) {
        let distance = dist(mouseX, mouseY, particle.pos.x, particle.pos.y);
        if (distance < 100) {
            let force = createVector(mouseX - particle.pos.x, mouseY - particle.pos.y);
            force.normalize();
            force.mult(0.1);
            particle.acc.add(force);
        }
    }
}

// Theme change handler
document.addEventListener("DOMContentLoaded", function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
                // Theme changed - particles will update colors in next frame
                for (let particle of particles) {
                    particle.color = getTextColor();
                }
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
    });
});
