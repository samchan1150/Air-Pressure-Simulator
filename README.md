# Air Pressure Simulator

Welcome to the Air Pressure Simulator, an interactive tool designed to visualize and explore the fundamental principles of air pressure and gas behavior. Whether you're a student, educator, or enthusiast, this simulator offers a hands-on experience to understand how various factors influence air pressure within a confined space.

By manipulating the number of particles, temperature, and compressor height, users can gain intuitive insights into how these factors interplay to influence air pressure. Observing the changes in the Pressure Display and particle behavior offers a tangible understanding of concepts such as:

- **Kinetic Theory of Gases**: Demonstrates how particle motion and collisions contribute to pressure.
- **Compression and Volume**: Illustrates the relationship between gas compression (reducing volume) and increased pressure.
- **Temperature Effects**: Shows how thermal energy impacts particle speeds and collision frequencies, affecting pressure.

## How It Works

The simulator models air particles moving within a rectangular container, representing a simplified gas system. Here's a breakdown of the key components and how they interact to demonstrate air pressure:

### Particles as Air Molecules

- **Representation**: Each particle symbolizes an air molecule with properties such as position, velocity, and mass.
- **Movement**: Particles move in random directions with varying speeds, influenced by the system's temperature.
- **Collisions**: When particles collide with the container walls or each other, they transfer momentum, contributing to the overall pressure exerted on the container.

### Temperature Control

- **Function**: Adjusting the temperature slider changes the kinetic energy of the particles.
- **Impact**: Higher temperatures increase particle speeds, leading to more frequent and forceful collisions, thereby raising the air pressure. Conversely, lower temperatures reduce particle movement, decreasing pressure.

### Number of Particles

- **Function**: Setting the number of particles alters the density of the gas within the container.
- **Impact**: A higher particle count results in a denser gas, increasing the likelihood of collisions and elevating pressure. Fewer particles reduce density and pressure.

### Compressor Height

- **Function**: Modifying the compressor height dynamically adjusts the available space for particles.
- **Impact**: Raising the compressor height compresses the gas, forcing particles closer together, which increases collision frequency and air pressure. Lowering the compressor provides more space, reducing collisions and pressure.

### Pressure Display

- **Function**: Continuously monitors and displays the current air pressure based on collision rates.
- **Calculation**: Pressure is calculated as the number of particle collisions per second, normalized per particle to provide an accurate and scalable measure of air pressure.

## Interactive Controls

- **Number of Particles**: Input field accompanied by an Update Particles button allows you to set and apply the desired particle count (ranging from 100 to 2500). Adjusting this parameter lets you observe how gas density affects pressure.
- **Temperature (°C)**: A precise slider ranging from -273.15°C (absolute zero) to 500°C with 0.01°C increments enables real-time adjustments to the system's temperature, directly influencing particle velocities and pressure.
- **Compressor Height**: A slider ranging from 50 px to 300 px lets you dynamically alter the compressor's position, simulating compression and decompression of the gas, thereby affecting collision rates and pressure.

## Visual Representation

- **Container**: The simulation area visually represents the gas container, with particles animated to move and collide within its boundaries.
- **Compressor**: A highlighted section within the container adjusts its height based on user input, acting as a dynamic boundary that compresses the gas.
- **Particles**: Colored circles represent individual air molecules, moving and interacting based on the current simulation parameters.




