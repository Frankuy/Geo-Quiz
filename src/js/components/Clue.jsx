import React from 'react'
import styles from '../../css/game.module.css'

const Clue = ({ clue }) => {
    return (
        <div id={styles["clue"]}>
            {clue}
        </div>
    )
}

export default Clue
