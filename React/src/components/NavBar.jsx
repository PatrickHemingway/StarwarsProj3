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

    // Y path function
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

        // Fire green lasers
        if (frame >= 160 && frame <= 210 && laserCooldown === 0) {
          lasers.push({ x: x + 30, y: y - 1, dx: 12 });
          laserCooldown = 10;
        }
        if (laserCooldown > 0) laserCooldown--;
      } else {
        const flyAngle = -Math.PI / 18; // ~10 degrees
        const flySpeed = 2.5;
        const dx = flySpeed * Math.cos(flyAngle);
        const dy = flySpeed * Math.sin(flyAngle);
        x += dx;
        y = prevY + dy;
        angle = flyAngle;
        prevY = y;

        // Begin Death Star entrance after fighter done firing
        if (!deathActive) {
          deathActive = true;
          deathEntering = true;
          deathX = canvas.width + 100;
        }
      }

      // Draw fighter
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.drawImage(fighter, -30, -15, 60, 30);
      ctx.restore();

      // Draw green lasers
      ctx.fillStyle = 'lime';
      for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].x += lasers[i].dx;
        ctx.fillRect(lasers[i].x, lasers[i].y, 12, 2);
        if (lasers[i].x > canvas.width) lasers.splice(i, 1);
      }

      x += speed;

      // === DEATH STAR LOGIC ===
      const deathY = canvas.height / 2 - 40; // centered height
      if (deathEntering) {
        deathX -= 1;
        if (deathX <= canvas.width - 150) {
          deathEntering = false;
          deathFiring = true;
          deathLaserFrame = 0;
        }
      } else if (deathFiring) {
        deathLaserFrame++;
        if (deathLaserFrame > 60) {
          deathFiring = false;
          deathExiting = true;
        }
      } else if (deathExiting) {
        deathX += 1;
        if (deathX > canvas.width + 100) {
          deathExiting = false;
          deathActive = false;
        }
      }

      if (deathActive) {
        ctx.drawImage(deathStar, deathX, deathY, 80, 80);

        if (deathFiring) {
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(deathX, deathY + 40);
          ctx.lineTo(0, deathY + 40);
          ctx.stroke();
        }
      }

      // Reset all once both ships are off screen
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
