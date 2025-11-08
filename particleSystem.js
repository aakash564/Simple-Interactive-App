export class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5; // Velocity X
        this.vy = (Math.random() - 0.5) * 1.5; // Velocity Y
        this.radius = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.mass = this.radius * 0.1;
    }

    update(boundsWidth, boundsHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Simple wall collision
        if (this.x + this.radius > boundsWidth || this.x - this.radius < 0) {
            this.vx = -this.vx * 0.9;
            if (this.x > boundsWidth) this.x = boundsWidth - this.radius;
            if (this.x < 0) this.x = this.radius;
        }

        if (this.y + this.radius > boundsHeight || this.y - this.radius < 0) {
            this.vy = -this.vy * 0.9;
            if (this.y > boundsHeight) this.y = boundsHeight - this.radius;
            if (this.y < 0) this.y = this.radius;
        }

        // Apply slight drag/damping
        this.vx *= 0.998;
        this.vy *= 0.998;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export class ParticleSystem {
    constructor(canvas, maxParticles = 300) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = maxParticles;
        this.isMouseDown = false;
        this.mouse = { x: 0, y: 0 };

        this.setupEventListeners();
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        this.canvas.addEventListener('mouseup', () => this.handlePointerUp());

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) this.handlePointerDown(e.touches[0]);
        }, { passive: true });
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) this.handlePointerMove(e.touches[0]);
        }, { passive: true });
        this.canvas.addEventListener('touchend', () => this.handlePointerUp());
    }

    handlePointerDown(e) {
        this.isMouseDown = true;
        this.mouse.x = e.clientX || e.x;
        this.mouse.y = e.clientY || e.y;
    }

    handlePointerMove(e) {
        const newX = e.clientX || e.x;
        const newY = e.clientY || e.y;

        if (this.isMouseDown) {
            const dx = newX - this.mouse.x;
            const dy = newY - this.mouse.y;

            // Apply force to nearby particles (a simple push/pull effect)
            this.applyInteraction(newX, newY, dx, dy);
        }

        // Spawn particles if mouse is down, but only occasionally
        if (this.isMouseDown && Math.random() < 0.3 && this.particles.length < this.maxParticles) {
             this.addParticle(newX, newY);
        }

        this.mouse.x = newX;
        this.mouse.y = newY;
    }

    handlePointerUp() {
        this.isMouseDown = false;
    }

    addParticle(x, y) {
        this.particles.push(new Particle(x, y));
        if (this.particles.length > this.maxParticles) {
            this.particles.shift(); // Keep array size limited
        }
    }

    applyInteraction(mx, my, dx, dy) {
        const interactionRadius = 100;
        
        for (const p of this.particles) {
            const distSq = (p.x - mx) ** 2 + (p.y - my) ** 2;
            
            if (distSq < interactionRadius * interactionRadius) {
                const distance = Math.sqrt(distSq);
                
                // Calculate push force based on mouse movement direction
                const pushStrength = (1 - distance / interactionRadius) * 0.1;
                
                p.vx += dx * pushStrength;
                p.vy += dy * pushStrength;
            }
        }
    }

    update() {
        for (const p of this.particles) {
            p.update(this.width, this.height);
        }
    }

    draw() {
        // Subtle fading trail effect
        this.ctx.fillStyle = 'rgba(17, 17, 17, 0.2)'; 
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (const p of this.particles) {
            p.draw(this.ctx);
        }
    }
}
