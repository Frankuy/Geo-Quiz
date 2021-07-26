import React, { useState } from 'react';
import styles from '../../css/setting.module.css';
import button from '../../css/button.module.css';
import utils from '../../css/utils.module.css';
import { Link } from 'react-router-dom';

const Setting = () => {
    const [mode, setMode] = useState('Choices');
    const [time, setTime] = useState('60s');

    const toggleMode = () => {
        setMode(mode == 'Choices' ? 'Text' : 'Choices');
    }

    const toggleTime = () => {
        if (time == '60s') {
            setTime('3m');
        }
        else if (time == '3m') {
            setTime('5m');
        }
        else if (time == '5m') {
            setTime('10m');
        }
        else {
            setTime('60s');
        }
    }

    return (
        <div id={styles['setting']}>
            <Link to="/">
                <div id={styles['close-button']} className={button['button-icon']} title="Close"></div>
            </Link>
            <div className={styles["container"]}>
                <div id={styles["mode"]} className={styles["row"]}>
                    <div className={utils["font-bold"]}>Mode</div>
                    <button 
                        id={styles["mode-button"]} 
                        className={utils["font-bold"] + ' ' + button["button-toggle"]} 
                        onClick={toggleMode}
                    >
                        {mode}
                    </button>
                </div>
                <div id={styles["time"]} className={styles["row"]}>
                    <div className={utils["font-bold"]}>Time</div>
                    <button 
                        id={styles["time-button"]} 
                        className={utils["font-bold"] + ' ' + button["button-toggle"]}
                        onClick={toggleTime}
                    >
                        {time}
                    </button>
                </div>
            </div>
            <Link to={`/play/${mode.toLowerCase()}/${time}`}>
                <button className={button['button-box'] + ' ' + button['button-center']}>PLAY</button>
            </Link>
        </div>
    )
}

export default Setting;
