// script.js

// Get Canvas and Context
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const pressureDisplay = document.getElementById('pressureDisplay');

const width = canvas.width;
const height = canvas.height;

// Particle Settings
const NUM_PARTICLES = 500;
const PARTICLE_RADIUS = 2;
const MAX_SPEED = 2;

// Pressure Calculation
let totalCollisions = 0;
let pressure = 0;
const pressureUpdateInterval = 1000; // Update every second

// Particle Class
class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // Collision with walls
        let collided = false;

        if (this.x <= PARTICLE_RADIUS) {
            this.x = PARTICLE_RADIUS;
            this.vx *= -1;
            collided = true;
        } else if (this.x >= width - PARTICLE_RADIUS) {
            this.x = width - PARTICLE_RADIUS;
            this.vx *= -1;
            collided = true;
        }

        if (this.y <= PARTICLE_RADIUS) {
            this.y = PARTICLE_RADIUS;
            this.vy *= -1;
            collided = true;
        } else if (this.y >= height - PARTICLE_RADIUS) {
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
const particles = [];
for (let i = 0; i < NUM_PARTICLES; i++) {
    const x = Math.random() * (width - 2 * PARTICLE_RADIUS) + PARTICLE_RADIUS;
    const y = Math.random() * (height - 2 * PARTICLE_RADIUS) + PARTICLE_RADIUS;
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * MAX_SPEED;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    particles.push(new Particle(x, y, vx, vy));
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.move();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Pressure Calculation
setInterval(() => {
    pressure = totalCollisions / (NUM_PARTICLES * (pressureUpdateInterval / 1000));
    pressureDisplay.textContent = `Pressure: ${pressure.toFixed(2)} collisions/sec`;
    totalCollisions = 0;
}, pressureUpdateInterval);

// Start Animation
animate();