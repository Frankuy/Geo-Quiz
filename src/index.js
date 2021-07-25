import './css/style.css';
import './css/main-menu.css';
import './css/setting.css';
import { select, geoPath, geoMercator, scaleLog, geoCentroid, interpolateRgb, extent, easeLinear, selectAll } from 'd3';
import { ticktock, startgame, correct, incorrect } from './js/sound';
import mapData from './asset/world.geo.json';

// Global Variable
var height = window.innerHeight;
var width = window.innerWidth;
var randomNumber;
var score;
var time;
var countdown;
var wrongAnswer;
var clueName;
const passThreshold = 1;

// Setting
var time_setting = '60 s';
var mode_setting = 'Choices';

// Game Container
var gameContainer = select('#game-svg')
    .attr('width', width)
    .attr('height', height)
// .attr('viewBox', `0 0 ${width} ${height}`)

function newGame(mode, time_ms) {
    // Init variable
    score = 0;
    time = time_ms;
    countdown = 4;
    randomNumber = Math.floor(Math.random() * mapData.features.length);
    wrongAnswer = 0;
    clueName = clue(mapData.features[randomNumber].properties.name.toUpperCase());

    // Layout setting
    drawPassButton(false);
    drawClue(false);
    select('#user-input').property('disabled', false);
    select('#start-game').style('display', 'flex');
    select('#end-game').style('display', 'none');

    // Button event listener
    select('#new-game').on('click', function () { newGame(mode_setting, stringToMs(time_setting)); })
    select('#pass-button').on('click', function () { pass(); })

    // Show start countdown event
    var timer = setInterval(() => {
        if (countdown <= 4 && countdown > 0) {
            if (countdown == 4) {
                startgame.play();
            }
            select('#countdown').text(countdown);
        }
        else {
            clearInterval(timer);
            select('#countdown').text('');
            select('#start-game').style('display', 'none');

            // Draw game
            drawMap();
            drawClue(true);
            drawInput();
            drawScore();
            drawTimeRemaining();
        }
        countdown -= 1;
    }, 1000);
}

// function getData() {
//     console.log(mapData);
// json(GeoJson)
// .then(function (data) {
//     // Get map then game played
//     mapData = data;
//     newGame();
// });
// }

function drawMap() {
    var area = geoPath().area(mapData.features[randomNumber])

    var log = scaleLog().domain(
        extent(mapData.features, feature => geoPath().area(feature))
    ).range([1080, 50])

    var scale = width <= 740 ? log(area) : log(area) * width / 1200;

    var projection = geoMercator()
        // .scale(1080)
        .scale(scale)
        .center(geoCentroid(mapData.features[randomNumber]))
        .translate([width / 2, height / 2]);

    var pathGenerator = geoPath().projection(projection);

    var countryPath = gameContainer
        .select('#map')
        .selectAll('path')
        .data(mapData.features)

    countryPath.join("path")
        .attr("fill", (d, i) => i == randomNumber ? "#2E8CB2" : "#BAD0DC")
        .attr("stroke", (d, i) => i == randomNumber ? "white" : "#BAD0DC")
        .attr("stroke-width", (d, i) => i == randomNumber ? 2 : 1)
        .attr("d", pathGenerator);
}

function drawInput() {
    var userInput = select('#user-input');
    var heightOffset = width < 768 ? 80 : 120;

    userInput.style('display', 'block')

    var widthInput = select('#user-input').node().getBoundingClientRect().width;
    userInput
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 - widthInput / 2 - 8) + 'px')

    select('#pass-button')
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 + widthInput / 2) + 'px')

    var userInput = document.getElementById('user-input');
    userInput.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
            if (userInput.value.toLowerCase() == mapData.features[randomNumber].properties.name.toLowerCase()) {
                correct.play();
                userInput.animate([
                    { border: '2px solid lightgreen' },
                    { border: '2px solid black' }
                ],
                    {
                        duration: 2000
                    })
                userInput.value = '';
                score += 1;
                drawScore();
                changeCountry();
            }
            else {
                incorrect.play();
                userInput.animate([
                    { border: '2px solid red' },
                    { border: '2px solid black' }
                ],
                    {
                        duration: 2000
                    })
                userInput.value = '';
                wrongAnswer += 1;
                if (wrongAnswer == passThreshold) {
                    drawPassButton(true);
                }
            }
        }
    })
    userInput.focus();
}

function drawScore() {
    var top = width <= 740 ? 64 : 80;
    var left = 60;
    var radius = width <= 740 ? 32 : 40;
    var fontSize = width <= 740 ? 24 : 32;

    var scoreContainer = gameContainer.select('#score')
        // .attr('transform', `translate(60, ${height / 8 <= 80 ? 80 : height / 8})`)
        .attr('transform', `translate(${left}, ${top})`)

    scoreContainer.selectAll('*').remove();

    scoreContainer
        .append('circle')
        .attr('r', radius)
        .attr('fill', '#2E8CB2')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)

    scoreContainer
        .append('text')
        // .attr('x', center)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('dy', 2)
        .attr('fill', 'white')
        .attr('font-size', fontSize - 2 * score.toString().length)
        .text(score);
}

function drawTimeRemaining() {
    var heightTime = 12;
    var maxTime = stringToMs(time_setting);

    var timeContainer = gameContainer.select('#time')
        // .attr('transform', `translate(0, ${height - heightTime})`);

    if (time == maxTime) {
        timeContainer.selectAll('*').remove();

        ticktock.loop();
        ticktock.speedup(1);

        var timerFunction = setInterval(() => {
            time -= 100;            
            if (time == 0) {
                ticktock.stop();
                select('#end-game').style('display', 'flex');
                select('#user-input').property('disabled', true);
                clearInterval(timerFunction);
            }
            else if (time == 10000) {
                ticktock.speedup(1.25);
            }
        }, 100);

        timeContainer
            .append('rect')
            .attr('id', 'time-container')
            .attr('width', width)
            .attr('height', heightTime)
            .attr('fill', 'white')
        
        var timeRemaining = timeContainer
            .append('rect')
            .attr('id', 'time-remaining')
            .attr('width', width)
            .attr('height', heightTime)
            .attr('fill', '#1DA2D8')
        
        // Add Transition Color
        timeRemaining
            .transition('color')
            .duration(time)
            .ease(easeLinear)
            .attrTween("fill", function () {
                return function (t) {
                    const interpolate = interpolateRgb("#1DA2D8", "red");
                    const scale = scaleLog().domain([1 - 10000 / maxTime, 1]).range([0, 1]).clamp(true);
                    return interpolate(scale(t));
                };
            });

        // Add Transition Width
        timeRemaining
            .transition('width')
            .duration(time)
            .ease(easeLinear)
            .attr('width', 0)
    }
    else {
        timeContainer.select('#time-container')
            .attr('width', width)
        
        var timeRemaining = timeContainer.select('#time-remaining');
        
        timeRemaining.interrupt('width');

        timeRemaining
            .attr('width', width * time / maxTime)
            .transition('width')
            .duration(time)
            .ease(easeLinear)
            .attr('width', 0)
    }
}

function drawPassButton(show) {
    if (show) {
        select('#pass-button').style('display', 'block');
    }
    else {
        select('#pass-button').style('display', 'none');
    }
}

function drawClue(show) {
    var clueContainer = select('#clue');

    if (show) {
        clueContainer.text(clueName);
        clueContainer.style('display', 'block');

        var widthClue = clueContainer.node().getBoundingClientRect().width;
        // var heightClue = clueContainer.node().getBoundingClientRect().height;
        var left = width <= 740 ? width - widthClue - 30 : width / 2 - widthClue / 2;
        // var top = height / 8 <= 80 ? 80 - heightClue / 2 : height / 8 - heightClue / 2;
        var top = 30;

        clueContainer.style('top', top + 'px').style('left', left + 'px')
    }
    else {
        clueContainer.style('display', 'none');
    }
}

function clue(name) {
    var names = name.split(' ');
    var clueName = names.map(val => {
        if (val.length > 6) {
            var rdx = 1 + Math.floor(Math.random() * (val.length - 1));
            return val[0] + val.substr(1, rdx - 1).replace(/\D/g, "_") + val[rdx] + val.substr(rdx + 1, val.length).replace(/\D/g, "_");
        }
        else {
            var rdx = Math.floor(Math.random() * val.length);
            return val.substr(0, rdx).replace(/\D/g, "_") + val[rdx] + val.substr(rdx + 1, val.length).replace(/\D/g, "_");
        }
    }).join(' ');

    return clueName;
}

function changeCountry() {
    randomNumber = Math.floor(Math.random() * mapData.features.length);
    clueName = clue(mapData.features[randomNumber].properties.name.toUpperCase());
    drawClue(true);
    drawMap();
}

function pass() {
    if (wrongAnswer >= passThreshold) {
        wrongAnswer = 0;
        drawPassButton(false);
        changeCountry();
    }
}

function redraw() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (countdown == -1) {
        drawScore();
        drawTimeRemaining();
        drawMap();
        drawInput();
        drawClue(true);
    }
}

function stringToMs(string) {
    if (string == '60 s') {
        return 60 * 1000;
    }
    else if (string == '3 m') {
        return 3 * 60 * 1000;
    }
    else if (string == '5 m') {
        return 5 * 60 * 1000;
    }
    else if (string == '10 m') {
        return 10 * 60 * 1000;
    }
}

window.addEventListener("resize", redraw);
window.addEventListener("load", function() {
    // Remove Loading
    select("#loading").remove();
    select("#start-game").style("display", "none");

    // Show Main Menu
    select("#main-menu").style("display", "block");
    select("#setting").style("bottom", `-${height}px`);

    // Setting Button
    select("#setting-button").on("click", () => {
        select("#setting").transition().duration(400).style("bottom", "0px");
    })

    // Close Button
    select("#close-button").on("click", () => {
        select("#setting").transition().duration(400).style("bottom", `-${height}px`);
    })

    // Play Button
    selectAll(".play-button").on("click", () => {
        select("#main-menu").style("display", "none");
        select("#setting").style("bottom", `-${height}px`);
        newGame(mode_setting, stringToMs(time_setting));
    })

    // Mode Button
    let mode_button = select("#mode-button");
    mode_button.on("click", function() {
        if (mode_setting == 'Choices') {
            mode_setting = 'Text';
            mode_button.text(mode_setting);
        }
        else {
            mode_setting = 'Choices';
            mode_button.text(mode_setting);
        }
    })

    // Time Button
    let time_button = select("#time-button");
    time_button.on("click", function() {
        if (time_setting == '60 s') {
            time_setting = '3 m';
            time_button.text(time_setting);
        }
        else if (time_setting == '3 m') {
            time_setting = '5 m';
            time_button.text(time_setting);
        }
        else if (time_setting == '5 m') {
            time_setting = '10 m';
            time_button.text(time_setting);
        }
        else {
            time_setting = '60 s';
            time_button.text(time_setting);
        }
    })
})
