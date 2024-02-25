const canvas = document.getElementById("sim");
const context = canvas.getContext('2d')
console.log(sim);

const numElectrons = 1;
const numProtons = 1;
const numNeutrons = 0;
const mux = 1e2;
const scale = 1e-14;

//universal constants
const mol = 6.022e23;
const k = 9e9;
const h = 6.63e-34;

let particles = [];

//protones (temporal)
for (let i = 0; i < numProtons; i++) {
  particles.push({
    type: 2, //2=gauge
    color: 'red',
    charge: 1.602e-19,
    chargeType: 1,
    mass: 1.6725e-27,
    radius: 3,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx:0,
    vy:0
  });
}

//neutrones (temporal)
for (let i = 0; i < numNeutrons; i++) {
  particles.push({
    type: 2, //2=gauge
    color: 'gray',
    charge: 0,
    chargeType: 1,
    mass: 1.6750e-27,
    radius: 3,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx:0,
    vy:0
  });
}

//electrones
for (let i = 0; i < numElectrons; i++) {
  particles.push({
    type:1,//1=leptone
    color: 'blue',
    charge: -1.602e-19,
    chargeType: 0,
    mass: 9.1091e-31,
    energy: -13.6,
    radius:3,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx:0,
    vy:0,
    spin:1
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = particle.color;
    context.fill();
  });
}

function electromagneticField(){
  particula1for:
  for ( let i = 0; i < particles.length; i++ ){
    const particle1 = particles[i];
    if (particle1.charge < 0) {
      particle1.charge *= -1;
    }
    for (let j = 0; j < particles.length; j++){
      const particle2 = particles[j];
      if (particle2.charge < 0) {
        particle2.charge *= -1;
      }
      if (particle1 !== particle2) {
        
        const dx = (particle1.x*scale - particle2.x*scale);
        const dy = (particle1.y*scale - particle2.y*scale);
        const distance = Math.sqrt(dx**2 + dy**2);
        //console.log(distance)
        if (distance >= 50*scale) {
          //
          const force = ((k * (particle1.charge * particle2.charge)) / (distance**2))*mux;
          const e = force/particle1.charge;
          console.log(e)
          
          let forceX = (force * dx) / distance;
          let forceY = (force * dy) / distance;
          
          if (particle1.chargeType !== particle2.chargeType) {
            forceX *= -1;
            forceY *= -1;
          }
          
          particle1.vx += forceX;
          particle1.vy += forceY;
        }
         
        particle1.x += (particle1.vx * mux);
        particle1.y += (particle1.vy * mux); 
        //console.log(particle1.vx)
          //console.log(particle1.vy)
          
        //console.log(particle1.vx*mux)

        // Asegura que la partícula no se salga del canvas
        //particle1.x = Math.max(0, Math.min(canvas.width, particle1.x));
        //particle1.y = Math.max(0, Math.min(canvas.height, particle1.y));
        if ((particle1.x < 0e-50 || particle1.x > canvas.width) || (particle1.y < 0e-50 || particle1.y > canvas.height)) {
          //console.log(particles[i].x, particles[i].y)
          //console.log(particle1.x, particle1.y)
          particles.splice(i, 1);
          break particula1for;
        }
      }
    }
  }
}

/*function strongForce() {
  particles.forEach((particle1) => {
    particles.forEach(particle2 => {
      if (particle1 !== particle2 && (particle1.type === 2 && particle2.type === 2)) {

        const dx = (particle1.x * scale - particle2.x * scale);
        const dy = (particle1.y * scale - particle2.y * scale);
        const tempdist = Math.sqrt(dx ** 2 + dy ** 2);
        const distance = 1 / (tempdist**2); // Inversamente proporcional a la distancia al cuadrado

        if (tempdist >= 100 * scale) {
          //
          const force = (particle1.mass * particle2.mass * distance) * 1e49;

          const forceX = ((force * dx) / distance)*-1;
          const forceY = ((force * dy) / distance)*-1;

          particle1.vx += forceX;
          particle1.vy += forceY;
        }

        particle1.x += (particle1.vx * mux);
        particle1.y += (particle1.vy * mux);
        //console.log(particle1.vx)
        //console.log(particle1.vy)

        //console.log(particle1.vx*mux)

        // Asegura que la partícula no se salga del canvas
        //particle1.x = Math.max(0, Math.min(canvas.width, particle1.x));
        //particle1.y = Math.max(0, Math.min(canvas.height, particle1.y));
      }
    })
  })
}
*/

function checkCollisions() {
  particles.forEach((particle1)=>{
    particles.forEach((particle2)=>{
      if (particle1 !== particle2) {
        const dx = particle1.x*scale - particle2.x*scale;
        const dy = particle1.y*scale - particle2.y*scale;
        const distance = Math.sqrt(dx**2 + dy**2);
        const minDistance = 51*scale;
        if (distance < minDistance) {
          const overlap = minDistance - distance;
          const angle = Math.atan2(dy, dx); 
          const newParticle1X = particle1.x + (overlap / 2) * Math.cos(angle); 
          const newParticle1Y = particle1.y + (overlap / 2) * Math.sin(angle); 
          const newParticle2X = particle2.x - (overlap / 2) * Math.cos(angle); 
          const newParticle2Y = particle2.y - (overlap / 2) * Math.sin(angle);
          particle1.x = newParticle1X;
          particle1.y = newParticle1Y;
          particle2.x = newParticle2X;
          particle2.y = newParticle2Y;
        }
      }
    })
  })
}

function animate() {
  requestAnimationFrame(animate, 100);
  //context.clearRect(0, 0, canvas.width, canvas.height)
  drawParticles();
  electromagneticField();
  //strongForce();
  //checkCollisions();
  //console.log(particles.length)
}
animate();