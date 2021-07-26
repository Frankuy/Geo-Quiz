import React from 'react';
import styles from '../../css/main-menu.module.css';
import button from '../../css/button.module.css';
import { Link } from 'react-router-dom';

const MainMenu = () => {
    return (
        <div id={styles['main-menu']}>
            <div id={styles['logo']}></div>
            <Link to="/">
                <div id={styles['explore-button']} className={button['button-icon']} title="Explore"></div>
            </Link>
            <Link to="/setting">
                <div id={styles['setting-button']} className={button['button-icon']} title="Setting"></div>
            </Link>
            <Link to="/play/choices/60s">
                <button className={button['button-box'] + ' ' + button['button-center']}>PLAY</button>
            </Link>
        </div>
    )
}

export default MainMenu;