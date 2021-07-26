import React from 'react'
import styles from '../../css/game.module.css'
import button from '../../css/button.module.css'


// Rules
const passThreshold = 1;

const TextInput = ({ wrongAnswer, onSubmitAnswer, onPassButtonPress }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmitAnswer(event);
        }
    }

    return (
        <div id={styles["input-container"]}>
            <input type="text" id={styles["user-input"]} placeholder="Enter your answer" autoComplete="off" onKeyPress={handleKeyPress} />
            <button 
                id={styles["pass-button"]} 
                className={button["button-box"]} 
                disabled={wrongAnswer < passThreshold}
                onClick={onPassButtonPress}
            >
                PASS
            </button>
        </div>
    )
}

export default TextInput;
