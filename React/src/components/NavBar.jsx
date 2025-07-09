import { useEffect } from 'react';
import styles from './NavBar.module.css';
import SidebarMenu from './SideBarMenu';

export default function NavBar() {
useEffect(() => {
  const canvas = document.getElementById('nav-canvas');
  const ctx = canvas.getContext('2d');
  const fighter = new Image();
  fighter.src = '/Fighter.png';

  let x = -60;
  let frame = 0;
  let prevY = 0;
  let speed = 1.5;
  const lasers = [];
  let laserCooldown = 0;

  // Path function: linear to sinusoid transition
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

  speed = Math.min(speed + 0.04, 4.5);

  let y, angle;
  const flyUpStart = 260;

  if (frame < flyUpStart) {
    y = getPathY(frame);
    const dy = y - prevY;
    const dx = speed;
    angle = Math.atan2(dy, dx);
    prevY = y;

    // Fire lasers before transition to sinusoid
    if (frame >= 160 && frame <= 210 && laserCooldown === 0) {
      lasers.push({ x: x + 30, y: y - 1, dx: 12 });
      laserCooldown = 10;
    }
    if (laserCooldown > 0) laserCooldown--;
  } else {
    // Fly upward at 10-degree angle
    const flyAngle = -Math.PI / 21; // -10 degrees in radians
    const flySpeed = 2.5; // constant speed, no acceleration
    const dx = flySpeed * Math.cos(flyAngle);
    const dy = flySpeed * Math.sin(flyAngle);

    x += dx;
    y = prevY + dy;
    angle = flyAngle;
    prevY = y;
  }


  // Draw fighter
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(fighter, -30, -15, 60, 30);
  ctx.restore();

  // Draw lasers
  ctx.fillStyle = 'lime';
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].x += lasers[i].dx;
    ctx.fillRect(lasers[i].x, lasers[i].y, 12, 2);
    if (lasers[i].x > canvas.width) lasers.splice(i, 1);
  }

  // Move fighter forward
  x += speed;

  // Reset animation if off-screen
  if (x > canvas.width + 60 || y < -30) {
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
