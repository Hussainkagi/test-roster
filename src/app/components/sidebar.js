// Sidebar.js
import React from 'react';
import { UilBars,UilUsersAlt, UilFootball } from '@iconscout/react-unicons'
import styles from '../Styles/sidebar.module.css';
import { useRouter } from 'next/navigation'
import Link from 'next/link';


const Sidebar = () => {
  const router = useRouter();
    return (
        <nav className={`d-none d-md-block ${styles.sidebar}`}>
          <div className={styles.sidebarSticky}>
            <ul className={`nav flex-column ${styles.list}`}>
              <li className="nav-item">
                <Link className="nav-link active" href="/">
               <UilFootball size='24' color="#fea013" className={styles.logo} />
                  
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/">
                <UilBars size="24" color="#fea013" className={styles.navicons}/>
                  
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/components/ground">
                <UilUsersAlt size="24" color="#fea013" className={styles.navicons} />
                </Link>
              </li>
              
              {/* Add more items as needed */}
            </ul>
          </div>
        </nav>
      );
};

export default Sidebar;
