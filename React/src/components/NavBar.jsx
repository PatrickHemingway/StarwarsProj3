import { useEffect } from 'react';
import styles from './NavBar.module.css';
import SidebarMenu from './SideBarMenu';

export default function NavBar() {
  useEffect(() => {
  const canvas = document.getElementById('nav-canvas');
  const ctx = canvas.getContext('2d');
  const fighter = new Image();
  fighter.src = '/Fighter.png';

  let x = 0;
  let prevY = 0;
  let frame = 0;
  const speed = 3;

  const animate = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const y = canvas.height / 2 + Math.sin(frame * 0.1) * 20;
    const dy = y - prevY;
    const dx = speed;
    const angle = Math.atan2(dy, dx); // angle in radians

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(fighter, -30, -15, 60, 30); // center image
    ctx.restore();

    prevY = y;
    x += speed;
    if (x > canvas.width + 60) x = -60;

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
