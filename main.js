import { ParticleSystem } from './ParticleSystem.js';

const canvas = document.getElementById('appCanvas');
const particleSystem = new ParticleSystem(canvas, 500);

// Initialize with a few starting particles
for(let i = 0; i < 50; i++) {
    particleSystem.addParticle(
        canvas.width / 2 + Math.random() * 100 - 50, 
        canvas.height / 2 + Math.random() * 100 - 50
    );
}

function gameLoop() {
    particleSystem.update();
    particleSystem.draw();
    requestAnimationFrame(gameLoop);
}

// Start the simulation
gameLoop();

// Provide feedback/instruction to the user
console.log("Simple Interactive App started. Click and drag on the screen to generate and move particles!");
