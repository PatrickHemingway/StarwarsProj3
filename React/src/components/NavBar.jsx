import { useEffect } from 'react';
import styles from './NavBar.module.css';
import SidebarMenu from './SideBarMenu';

export default function NavBar() {
useEffect(() => {
  const canvas = document.getElementById('nav-canvas');
  const ctx = canvas.getContext('2d');

  const fighter = new Image();
  const deathStar = new Image();
  fighter.src = '/Fighter.png';
  deathStar.src = '/deathstar.png';
  const energyParticles = [];

  let x = -60;
  let frame = 0;
  let prevY = 0;
  let speed = 1.5;
  const lasers = [];
  let laserCooldown = 0;

  // Death Star state
  let deathX = canvas?.width || 1200;
  let deathEntering = false;
  let deathFiring = false;
  let deathExiting = false;
  let deathLaserFrame = 0;
  let deathActive = false;
  let deathAngle = 0;
  let deathScale = 1;

  function getPathY(frame) {
    const transitionStart = 150;
    const transitionEnd = 220;
    const centerY = canvas.height / 2;

    if (frame < transitionStart) return centerY;

    const progress = Math.min((frame - transitionStart) / (transitionEnd - transitionStart), 1);
    const waveAmplitude = 10 * progress;
    const waveFrequency = 0.04 * progress;

    return centerY + Math.sin(frame * waveFrequency) * waveAmplitude;
  }

  const animate = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === FIGHTER LOGIC ===
    speed = Math.min(speed + 0.04, 4.5);
    let y, angle;
    const flyUpStart = 260;

    if (frame < flyUpStart) {
      y = getPathY(frame);
      const dy = y - prevY;
      const dx = speed;
      angle = Math.atan2(dy, dx);
      prevY = y;

      if (frame >= 160 && frame <= 210 && laserCooldown === 0) {
        lasers.push({ x: x + 30, y: y - 1, dx: 12 });
        laserCooldown = 10;
      }
      if (laserCooldown > 0) laserCooldown--;
    } else {
      const flyAngle = -Math.PI / 18;
      const flySpeed = 2.5;
      const dx = flySpeed * Math.cos(flyAngle);
      const dy = flySpeed * Math.sin(flyAngle);
      x += dx;
      y = prevY + dy;
      angle = flyAngle;
      prevY = y;

      // Start Death Star earlier
      if (!deathActive && frame > 230) {
        deathActive = true;
        deathEntering = true;
        deathX = canvas.width - 5;
        deathScale = 4;
        deathAngle = 0;
      }
    }

    // Draw fighter
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(fighter, -30, -15, 60, 30);
    ctx.restore();

    // Draw fighter lasers
    ctx.fillStyle = 'lime';
    for (let i = lasers.length - 1; i >= 0; i--) {
      lasers[i].x += lasers[i].dx;
      ctx.fillRect(lasers[i].x, lasers[i].y, 12, 2);
      if (lasers[i].x > canvas.width) lasers.splice(i, 1);
    }

    x += speed;

    // === DEATH STAR LOGIC ===
    const deathY = canvas.height / 2 - 100;
    if (deathEntering) {
      deathX -= 0.5;
      deathScale -= 0.002;
      deathAngle -= 0.0015;

      if (deathX <= canvas.width - 120) {
        deathEntering = false;
        deathFiring = true;
        deathLaserFrame = 0;
      }
    } else if (deathFiring) {
      deathLaserFrame++;
      if (deathLaserFrame > 120) {
        deathFiring = false;
        deathExiting = true;
      }
    } else if (deathExiting) {
      deathX += 0.4;
      if (deathX > canvas.width + 100) {
        deathExiting = false;
        deathActive = false;
      }
    }

    if (deathActive) {
      const deathSize = 80 * deathScale;
      ctx.save();
      ctx.translate(deathX + deathSize / 2, deathY + deathSize / 2);
      ctx.rotate(deathAngle);
      ctx.drawImage(deathStar, -deathSize / 2, -deathSize / 2, deathSize, deathSize);
      ctx.restore();

      // Laser beam effect
      if (deathFiring) {
  const flicker = deathLaserFrame % 10 < 5;
  const growProgress = Math.min(deathLaserFrame / 30, 1);
  const shrinkProgress = deathLaserFrame > 90 ? 1 - (deathLaserFrame - 90) / 30 : 1;
  const widthFactor = flicker ? (growProgress * shrinkProgress) : (growProgress * shrinkProgress * 0.8);
  const laserWidth = 4 + 20 * widthFactor;
  const beamY = deathY + 100;

  // === Main laser beam ===
  const gradient = ctx.createLinearGradient(deathX - 5, 0, 0, 0);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(1, 'red');

  ctx.strokeStyle = gradient;
  ctx.lineWidth = laserWidth;
  ctx.beginPath();
  ctx.moveTo(deathX, beamY);
  ctx.lineTo(0, beamY);
  ctx.stroke();

  // === Intense particle explosion across screen ===
  const particlesPerFrame = 150;

  for (let i = 0; i < particlesPerFrame; i++) {
      energyParticles.push({
      x: deathX,
      y: beamY + (Math.random() - 0.5) * (laserWidth * 0.2),
      size: Math.random() * 10 + 1, // 🔥 doubled size from (0.5 to 2) ➜ now (1 to 4)
      dx: -(Math.random() * 20 + 10), // 🔥 doubled leftward speed ➜ now (-10 to -30)
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? 'red' : 'white'
    });
  }

  // Draw particles
  for (let i = energyParticles.length - 1; i >= 0; i--) {
    const p = energyParticles[i];
    ctx.fillStyle = `rgba(${p.color === 'white' ? '255,255,255' : '255,0,0'}, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.x += p.dx;
    p.alpha -= 0.01;

    if (p.alpha <= 0 || p.x < 0) {
      energyParticles.splice(i, 1);
    }
  }
}

    }

    // Reset animation
    if ((x > canvas.width + 60 || y < -30) && !deathActive && !deathEntering && !deathFiring && !deathExiting) {
      x = -60;
      frame = 0;
      speed = 1.5;
      prevY = canvas.height / 2;
      lasers.length = 0;
      laserCooldown = 0;
    }

    frame++;
    requestAnimationFrame(animate);
  };

  fighter.onload = animate;
}, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <SidebarMenu />
      </div>
      <canvas id="nav-canvas" className={styles.canvas}></canvas>
    </div>
  );
}