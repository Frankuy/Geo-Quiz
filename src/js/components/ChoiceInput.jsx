import React from 'react'
import styles from '../../css/game.module.css'
import button from '../../css/button.module.css'

const ChoiceInput = ({ choices, onClick }) => {
    return (
        <div id={styles["input-container"]}>
            {
                choices.map((choice,index) => {
                    return (
                        <button
                            key={index}
                            className={button["button-box"] + ' ' + styles["choice-button"]}
                            value={choice}
                            onClick={onClick}
                        >
                            {choice}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default ChoiceInput
