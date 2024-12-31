// script.js

// Get Elements
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const pressureDisplay = document.getElementById('pressureDisplay');

const numParticlesInput = document.getElementById('numParticles');
const temperatureInput = document.getElementById('temperature');
const tempValueDisplay = document.getElementById('tempValue');
const compressorHeightInput = document.getElementById('compressorHeight');
const compressorHeightValueDisplay = document.getElementById('compressorHeightValue');
const applySettingsButton = document.getElementById('applySettings');
const compressor = document.getElementById('compressor');

let width = canvas.width;
let height = canvas.height;

// Particle Settings
let NUM_PARTICLES = parseInt(numParticlesInput.value);
let PARTICLE_RADIUS = 2;
let MAX_SPEED = parseInt(temperatureInput.value);

// Pressure Calculation
let totalCollisions = 0;
let pressure = 0;
const pressureUpdateInterval = 1000; // Update every second

// Utility Function to Calculate Distance Between Two Particles
function getDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Particle Class
class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = 1; // Assuming unit mass for all particles
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // Collision with walls
        let collided = false;

        // Left Wall
        if (this.x <= PARTICLE_RADIUS) {
            this.x = PARTICLE_RADIUS;
            this.vx *= -1;
            collided = true;
        }
        // Right Wall
        else if (this.x >= width - PARTICLE_RADIUS) {
            this.x = width - PARTICLE_RADIUS;
            this.vx *= -1;
            collided = true;
        }

        // Top Wall (Compressor Boundary)
        if (this.y <= compressorHeight) {
            this.y = compressorHeight;
            this.vy *= -1;
            collided = true;
        }
        // Bottom Wall
        else if (this.y >= height - PARTICLE_RADIUS) {
            this.y = height - PARTICLE_RADIUS;
            this.vy *= -1;
            collided = true;
        }

        if (collided) {
            totalCollisions += 1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#00fffc';
        ctx.fill();
    }
}

// Initialize Particles
let particles = [];

function initializeParticles() {
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        let x, y;
        let safe = false;

        // Ensure particles are not initialized overlapping
        while (!safe) {
            x = Math.random() * (width - 2 * PARTICLE_RADIUS) + PARTICLE_RADIUS;
            y = Math.random() * (height - 2 * PARTICLE_RADIUS) + compressorHeight;
            safe = true;

            for (let j = 0; j < particles.length; j++) {
                const other = particles[j];
                const distance = getDistance({x, y}, other);
                if (distance < 2 * PARTICLE_RADIUS) {
                    safe = false;
                    break;
                }
            }
        }

        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * MAX_SPEED;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, vx, vy));
    }
}

// Handle Inter-Particle Collisions
function handleCollisions() {
    for (let i = 0; i < NUM_PARTICLES; i++) {
        for (let j = i + 1; j < NUM_PARTICLES; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 2 * PARTICLE_RADIUS) {
                // Calculate angle, sine, and cosine
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate particle positions
                const x1 = 0;
                const y1 = 0;

                const x2 = dx * cos + dy * sin;
                const y2 = dy * cos - dx * sin;

                // Rotate velocities
                const vx1 = p1.vx * cos + p1.vy * sin;
                const vy1 = p1.vy * cos - p1.vx * sin;

                const vx2 = p2.vx * cos + p2.vy * sin;
                const vy2 = p2.vy * cos - p2.vx * sin;

                // Conservation of momentum in 1D
                const vx1Final = ((p1.mass - p2.mass) * vx1 + 2 * p2.mass * vx2) / (p1.mass + p2.mass);
                const vx2Final = ((p2.mass - p1.mass) * vx2 + 2 * p1.mass * vx1) / (p1.mass + p2.mass);

                // Update velocities
                p1.vx = vx1Final * cos - vy1 * sin;
                p1.vy = vy1 * cos + vx1Final * sin;
                p2.vx = vx2Final * cos - vy2 * sin;
                p2.vy = vy2 * cos + vx2Final * sin;

                // Separate overlapping particles
                const overlap = 2 * PARTICLE_RADIUS - distance;
                const separationX = (overlap / 2) * cos;
                const separationY = (overlap / 2) * sin;

                p1.x -= separationX;
                p1.y -= separationY;
                p2.x += separationX;
                p2.y += separationY;

                // Increment collision count
                totalCollisions += 1;
            }
        }
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Move and draw particles
    particles.forEach(particle => {
        particle.move();
        particle.draw();
    });

    // Handle inter-particle collisions
    handleCollisions();

    requestAnimationFrame(animate);
}

// Pressure Calculation
setInterval(() => {
    pressure = totalCollisions / (NUM_PARTICLES * (pressureUpdateInterval / 1000));
    pressureDisplay.textContent = `Pressure: ${pressure.toFixed(2)} collisions/sec`;
    totalCollisions = 0;
}, pressureUpdateInterval);

// Apply Settings Button Event Listener
applySettingsButton.addEventListener('click', () => {
    // Update Number of Particles
    const newNum = parseInt(numParticlesInput.value);
    if (newNum !== NUM_PARTICLES) {
        NUM_PARTICLES = newNum;
        initializeParticles();
    }

    // Update Temperature
    const newTemp = parseInt(temperatureInput.value);
    if (newTemp !== MAX_SPEED) {
        MAX_SPEED = newTemp;
        // Update particle velocities based on new temperature
        particles.forEach(particle => {
            const angle = Math.atan2(particle.vy, particle.vx);
            const speed = Math.random() * MAX_SPEED;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
        });
    }

    // Update Compressor Height
    const newHeight = parseInt(compressorHeightInput.value);
    if (newHeight !== compressorHeight) {
        compressorHeight = newHeight;
        compressor.style.height = `${compressorHeight}px`;
        // Adjust particle positions if they are above the new compressor height
        particles.forEach(particle => {
            if (particle.y < compressorHeight + PARTICLE_RADIUS) {
                particle.y = compressorHeight + PARTICLE_RADIUS;
                particle.vy *= -1;
                totalCollisions += 1;
            }
        });
    }
});

// Initialize Compressor Height Display
let compressorHeight = parseInt(compressorHeightInput.value);
compressorHeightValueDisplay.textContent = compressorHeight;

compressorHeightInput.addEventListener('input', () => {
    const currentHeight = parseInt(compressorHeightInput.value);
    compressorHeightValueDisplay.textContent = currentHeight;
});

// Initialize Temperature Display
tempValueDisplay.textContent = MAX_SPEED;

temperatureInput.addEventListener('input', () => {
    const currentTemp = parseInt(temperatureInput.value);
    tempValueDisplay.textContent = currentTemp;
});

// Initialize Particles and Start Animation
initializeParticles();
animate();