import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './SidebarMenu.module.css';
import closeIcon from '../assets/close-button.svg';
import starwarsLogo from '/logo.png';

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
      <img src={starwarsLogo} alt="Home" className={styles.logo} />
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.sidebar} ref={sidebarRef}>
            <div className={styles.header}>
              <Link to="/" onClick={closeSidebar}>
                <img src={starwarsLogo} alt="Home" className={styles.logo} />
              </Link>
              <button onClick={closeSidebar} className={styles.closeButton}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>

            <nav className={styles.nav}>
              <Link to="/" onClick={closeSidebar}>Home</Link>
              <Link to="/Chart" onClick={closeSidebar}>Chart</Link>

            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
