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
const updateParticlesButton = document.getElementById('updateParticles');
const compressor = document.getElementById('compressor');

let width = canvas.width;
let height = canvas.height;

// Particle Settings
let NUM_PARTICLES = parseInt(numParticlesInput.value) || 500;
let PARTICLE_RADIUS = 2;

// Temperature Settings
let temperatureCelsius = parseFloat(temperatureInput.value) || 0; // Default -273.15°C
let temperatureKelvin = temperatureCelsius + 273.15;

// Pressure Calculation
let totalCollisions = 0;
let pressure = 0;
const pressureUpdateInterval = 1000; // Update every second

// Velocity Threshold for Collision Counting
const COLLISION_SPEED_THRESHOLD = 0.5; // Adjust based on simulation needs

// Utility Function to Calculate Distance Between Two Particles
function getDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Function to Generate Gaussian Random Numbers using Box-Muller Transform
function getRandomNormal(mean = 0, stdDev = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
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
        if (this.y <= compressorHeight + PARTICLE_RADIUS) {
            this.y = compressorHeight + PARTICLE_RADIUS;
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
            y = Math.random() * (height - 2 * PARTICLE_RADIUS - compressorHeight) + compressorHeight + PARTICLE_RADIUS;
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

        // Convert temperature from Celsius to Kelvin
        temperatureKelvin = temperatureCelsius + 273.15;

        // Calculate standard deviation based on temperature
        // Using (1/2)m*v^2 = (1/2)k*T => v = sqrt(k*T/m)
        // For simulation purposes, set k/m = scaling factor
        const scalingFactor = 0.1; // Adjusted for better scaling
        const stdDev = temperatureKelvin > 0 ? Math.sqrt(temperatureKelvin * scalingFactor) : 0;

        // Generate velocities based on Maxwell-Boltzmann distribution
        const vx = temperatureKelvin > 0 ? getRandomNormal(0, stdDev) : 0;
        const vy = temperatureKelvin > 0 ? getRandomNormal(0, stdDev) : 0;

        particles.push(new Particle(x, y, vx, vy));
    }
}

// Handle Inter-Particle Collisions
function handleCollisions() {
    // Skip collision handling at or below absolute zero
    if (temperatureKelvin <= 0) {
        return;
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
        for (let j = i + 1; j < NUM_PARTICLES; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use <= to prevent floating-point precision issues
            if (distance <= 2 * PARTICLE_RADIUS) {
                // Calculate relative velocity
                const dvx = p1.vx - p2.vx;
                const dvy = p1.vy - p2.vy;
                const relativeSpeed = Math.sqrt(dvx * dvx + dvy * dvy);

                // Only handle collision if relative speed exceeds threshold
                if (relativeSpeed >= COLLISION_SPEED_THRESHOLD) {
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
                    if (overlap > 0) { // Prevent negative separation
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
    // Calculate collisions per particle
    pressure = totalCollisions / NUM_PARTICLES;

    // Ensure pressure is zero at or below absolute zero
    if (temperatureKelvin <= 0) {
        pressure = 0;
    }

    pressureDisplay.textContent = `Pressure: ${pressure.toFixed(2)} Collisions/Particle/sec`;
    totalCollisions = 0;
}, pressureUpdateInterval);

// Update Particles Button Event Listener
updateParticlesButton.addEventListener('click', () => {
    // Update Number of Particles
    let newNum = parseInt(numParticlesInput.value);
    if (isNaN(newNum) || newNum < 100) {
        newNum = 100;
        numParticlesInput.value = 100;
    } else if (newNum > 2500) {
        newNum = 2500;
        numParticlesInput.value = 2500;
    }

    if (newNum !== NUM_PARTICLES) {
        NUM_PARTICLES = newNum;
        initializeParticles();
    }
});

// Temperature Input Event Listener (Dynamic Update)
temperatureInput.addEventListener('input', () => {
    const newTempCelsius = parseFloat(temperatureInput.value);
    temperatureCelsius = isNaN(newTempCelsius) ? temperatureCelsius : newTempCelsius;
    temperatureKelvin = temperatureCelsius + 273.15;

    // Update Temperature Display
    tempValueDisplay.textContent = `${temperatureCelsius.toFixed(2)}°C`;

    // Update particle velocities based on new temperature
    particles.forEach(particle => {
        const angle = Math.atan2(particle.vy, particle.vx);
        const scalingFactor = 0.1; // Adjusted for better scaling
        const stdDev = temperatureKelvin > 0 ? Math.sqrt(temperatureKelvin * scalingFactor) : 0;
        const speed = temperatureKelvin > 0 ? getRandomNormal(0, stdDev) : 0;
        particle.vx = speed * Math.cos(angle);
        particle.vy = speed * Math.sin(angle);
    });
});

// Compressor Height Input Event Listener (Dynamic Update)
compressorHeightInput.addEventListener('input', () => {
    const newHeight = parseInt(compressorHeightInput.value);
    compressorHeight = isNaN(newHeight) ? compressorHeight : newHeight;
    compressorHeightValueDisplay.textContent = `${compressorHeight} px`;
    compressor.style.height = `${compressorHeight}px`;

    // Adjust particle positions if they are above the new compressor height
    particles.forEach(particle => {
        if (particle.y < compressorHeight + PARTICLE_RADIUS) {
            particle.y = compressorHeight + PARTICLE_RADIUS;
            particle.vy *= -1;
            totalCollisions += 1;
        }
    });
});

// Initialize Compressor Height Display
let compressorHeight = parseInt(compressorHeightInput.value) || 100;
compressorHeightValueDisplay.textContent = `${compressorHeight} px`;

// Initialize Temperature Display
temperatureKelvin = temperatureCelsius + 273.15;
tempValueDisplay.textContent = `${temperatureCelsius.toFixed(2)}°C`;

// Initialize Particles and Start Animation
initializeParticles();
animate();
