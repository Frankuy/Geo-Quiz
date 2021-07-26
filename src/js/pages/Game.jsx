import React, { useEffect, useRef, useState } from 'react'
import styles from '../../css/game.module.css'
import button from '../../css/button.module.css'
import { useParams } from 'react-router-dom'
import { clue, stringToMs } from '../utils/utils';
import Score from '../components/Score';
import TimeRemaining from '../components/TimeRemaining';
import TextInput from '../components/TextInput';
import Clue from '../components/Clue';
import mapData from '../../asset/world.geo.json';
import Map from '../components/Map';
import { ticktock, startgame, correct, incorrect } from '../utils/sound';

const Game = () => {
    const { mode, time } = useParams();

    const animateRef = useRef();
    const startTime = useRef();

    const [state, setState] = useState({
        randomNumber: 0,
        score: 0,
        time: stringToMs(time),
        countdown: 4,
        wrongAnswer: 0,
        clueName: '',
    });

    const animate = (_) => {
        let currentMs = new Date() - startTime.current
        let currentSecond = Math.round(currentMs / 1000);

        // Show count down
        if (currentSecond <= 4) {
            setState(prevState => {
                return { ...prevState, countdown: 4 - currentSecond }
            });
            if (currentSecond == 4) {
                ticktock.speedup(1);
                ticktock.loop();
            }
        }

        // After count down (Game Time)
        if (currentSecond >= 4 && currentSecond <= stringToMs(time) / 1000 + 4) {
            setState(prevState => {
                return { ...prevState, time: stringToMs(time) - (currentMs - 4 * 1000) }
            });
            if (currentSecond == stringToMs(time) / 1000 - 10) {
                ticktock.speedup(1.25);
            }
        }

        // End Game
        if (currentSecond > stringToMs(time) / 1000 + 4) {
            cleanup();
        }
        else {
            animateRef.current = requestAnimationFrame(animate);
        }
    }

    const checkAnswer = (event) => {
        let answer = event.target.value;

        if (answer.toLowerCase() == mapData.features[state.randomNumber].properties.name.toLowerCase()) {
            setState(prevState => {
                return { ...prevState, score: prevState.score + 1 }
            });
            correct.play();
            var userInput = document.getElementById(event.target.id);
            userInput.animate([
                { border: '6px solid lightgreen' },
                { border: '6px solid #2E8CB2' }
            ],
                {
                    duration: 2000
                })
            userInput.value = '';
            changeCountry();
        }
        else {
            incorrect.play();
            var userInput = document.getElementById(event.target.id);
            userInput.animate([
                { border: '6px solid red' },
                { border: '6px solid #2E8CB2' }
            ],
                {
                    duration: 2000
                })
            userInput.value = '';
            setState(prevState => {
                return { ...prevState, wrongAnswer: prevState.wrongAnswer + 1 }
            });
        }
    }

    const pass = () => {
        changeCountry();
    }

    const changeCountry = () => {
        let randomNumber = Math.floor(Math.random() * mapData.features.length);
        let clueName = clue(mapData.features[randomNumber].properties.name.toUpperCase());
        setState(prevState => {
            return { ...prevState, wrongAnswer: 0, randomNumber, clueName }
        });
    }

    const newGame = () => {
        setState({
            randomNumber: 0,
            score: 0,
            time: stringToMs(time),
            countdown: 4,
            wrongAnswer: 0,
            clueName: '',
        });

        // Init Game
        let random = Math.floor(Math.random() * mapData.features.length);
        let clueName = clue(mapData.features[random].properties.name.toUpperCase());
        setState(prevState => {
            return { ...prevState, randomNumber: random, clueName }
        });

        // Start Timer
        startTime.current = new Date();
        startgame.play();
        animateRef.current = requestAnimationFrame(animate);
    }

    const cleanup = () => {
        ticktock.stop();
        startgame.stop();
        correct.stop();
        incorrect.stop();
        cancelAnimationFrame(animateRef.current);
    }

    useEffect(() => {
        newGame();
        return () => cleanup();
    }, []);

    if (mode == 'choices') {
        return (
            <div id={styles["game"]}>
                {
                    state.countdown == 0 &&
                    <>
                        <svg id={styles["game-svg"]}>
                            <Map randomNumber={state.randomNumber} mapData={mapData} />
                            <Score score={state.score} />
                            <TimeRemaining time={state.time} maxTime={stringToMs(time)} />
                        </svg>
                        <TextInput wrongAnswer={state.wrongAnswer} onSubmitAnswer={checkAnswer} onPassButtonPress={pass} />
                        <Clue clue={state.clueName} />
                    </>
                }
                {
                    state.time <= 0 &&
                    <div id={styles["end-game"]}>
                        <span>TIME'S UP</span>
                        <button id={styles["new-game"]} className={button["button-box"]} onClick={newGame}>NEW GAME</button>
                    </div>
                }
                {
                    state.countdown > 0 &&
                    <div id={styles["start-game"]}>
                        <span id={styles["countdown"]}>{state.countdown}</span>
                    </div>
                }
            </div>
        )
    }
    else if (mode == 'text') {
        return (
            <div id={styles["game"]}>
                {
                    state.countdown == 0 &&
                    <>
                        <svg id={styles["game-svg"]}>
                            <Map randomNumber={state.randomNumber} mapData={mapData} />
                            <Score score={state.score} />
                            <TimeRemaining time={state.time} maxTime={stringToMs(time)} />
                        </svg>
                        <TextInput wrongAnswer={state.wrongAnswer} onSubmitAnswer={checkAnswer} onPassButtonPress={pass} />
                        <Clue clue={state.clueName} />
                    </>
                }
                {
                    state.time <= 0 &&
                    <div id={styles["end-game"]}>
                        <span>TIME'S UP</span>
                        <button id={styles["new-game"]} className={button["button-box"]} onClick={newGame}>NEW GAME</button>
                    </div>
                }
                {
                    state.countdown > 0 &&
                    <div id={styles["start-game"]}>
                        <span id={styles["countdown"]}>{state.countdown}</span>
                    </div>
                }
            </div>
        )
    }
    else {
        return <div>No Available</div>
    }
}

export default Game;
