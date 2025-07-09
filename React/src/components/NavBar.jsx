import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import StarWarsLogo from '/logo.png'; 
import SidebarMenu from './SideBarMenu';

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <SidebarMenu />
        {/* <Link to="/">
          <img src={StarWarsLogo} alt="Home" />
        </Link> */}
      </div>
    </div>
  );
}
