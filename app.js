let cnvs, ctx;

class Particle {
  // initialize particle
  constructor(x, y, radius, direction) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.direction = direction;
  }

  // draw the particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  }

  // initialize first frame
  init() {
    this.draw();
  }

  update() { // move the particles constantly

    if (this.x >= cnvs.width || this.x <= 0) {
      this.direction.x = -this.direction.x;
    }
    if (this.y >= cnvs.height || this.y <= 0) {
      this.direction.y = -this.direction.y;
    }

    this.x += this.direction.x;
    this.y += this.direction.y;
    this.draw();
  }
}


const particles = [];
const numberOfParticles = 40;
const speed = 3.5;

window.addEventListener('load', () => {
  cnvs = document.getElementById('cnvs');
  ctx = cnvs.getContext('2d');
  updateCanvas();

  for (let i = 0; i < numberOfParticles; i++) {
    const particle = new Particle(
      // position
      Math.random() * cnvs.width, Math.random() * cnvs.height,
      // radius and direction
      Math.random() * .5 + 1, {
      x: Math.random() * speed - 1,  
      y: Math.random() * speed - 1
    })  
    particle.init();
    particles.push(particle);
  }  
  playParticles();
})  


function playParticles() {
  requestAnimationFrame(playParticles);

  ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  for (const particle of particles) {
    particle.update();
    let iterations = 0;
    let r = Math.random() * 255,
        g = Math.random() * 255,
        b = Math.random() * 255;
    for (const otherParticle of particles) {
      if (particle !== otherParticle) {
        // if the number of iterations is divisible by 10, regenerate a random value for r,g,b
        if (iterations % 1000 === 0) {
          r = Math.random() * 255;
          g = Math.random() * 255;
          b = Math.random() * 255;

          iterations = 0;
        }
        const distance = Math.sqrt(
          Math.pow(particle.x - otherParticle.x, 2) +
          Math.pow(particle.y - otherParticle.y, 2)
        );
        const radiusCoefficient = 50;
        const maxDistance = 
          particle.radius * radiusCoefficient + otherParticle.radius * radiusCoefficient;
        if (distance < maxDistance) {
          // animate the line between the particles with respect to their distance
          const color = `rgba(${r}, ${g}, ${b}, ${(maxDistance - distance) / maxDistance})`;
          // draw a white line from the particle to the other particle
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }  
}  

// update canvas width and height on window resize
window.addEventListener('resize', updateCanvas);

function updateCanvas() {
  cnvs.width = window.innerWidth;
  cnvs.height = window.innerHeight;
}  
