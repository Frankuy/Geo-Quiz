import { select, geoPath, geoMercator, scaleLog, geoCentroid, interpolateRgb, extent, easeLinear } from 'd3';
import { ticktock, startgame, correct, incorrect } from './js/sound';
import mapData from './asset/world.geo.json';
import './css/style.css';

// Global Variable
var height = window.innerHeight;
var width = window.innerWidth;
var randomNumber;
var score;
var time;
var countdown;
var wrongAnswer;
const passThreshold = 1;

// Game Container
var gameContainer = select('#game-svg')
    .attr('viewBox', `0 0 ${width} ${height}`)

function newGame() {
    // Init variable
    score = 0;
    time = 60000;
    countdown = 4;
    randomNumber = Math.floor(Math.random() * mapData.features.length);
    wrongAnswer = 0;

    // Layout setting
    drawPassButton(false);
    drawClue(false);
    select('#user-input').property('disabled', false);
    select('#start-game').style('display', 'flex');
    select('#end-game').style('display', 'none');

    // Button event listener
    select('#new-game').on('click', function() { newGame(); })
    select('#pass-button').on('click', function() { pass(); })
    
    // Show start countdown event
    var timer = setInterval(() => {
        if (countdown == 4) {
            startgame.play();
        }
        if (countdown <= 4 && countdown > 0) {
            select('#countdown').text(countdown);
        }
        else {
            clearInterval(timer);
            select('#countdown').text('');
            select('#start-game').style('display', 'none');
        }
        countdown -= 1;
    }, 1000);

    // Draw game
    setTimeout(() => {
        drawMap();
        drawClue(true);
        drawInput();
        drawScore();
        drawTimeRemaining();
    }, 5000)
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

    var projection = geoMercator()
        // .scale(1080)
        .scale(log(area))
        .center(geoCentroid(mapData.features[randomNumber]))
        .translate([width / 2, height / 2]);
    
    var pathGenerator = geoPath().projection(projection);

    var countryPath = gameContainer
        .select('#map')
        .selectAll('path')
        .data(mapData.features)

    countryPath.join("path")
        .attr("fill", (d, i) => i == randomNumber ? "blue" : "grey")
        .attr("stroke", (d, i) => i == randomNumber ? "white" : "white")
        .attr("stroke-width", (d, i) => i == randomNumber ? 2 : 1)
        .attr("d", pathGenerator);
}

function drawInput() {
    var widthInput = 160;
    var heightOffset = height / 4;

    select('#pass-button')
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 + widthInput / 2 + 24) + 'px')

    select('#user-input')
        .style('display', 'block')
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 - widthInput / 2 - 8) + 'px')

    var userInput = document.getElementById('user-input');
    userInput.addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            if (userInput.value.toLowerCase() == mapData.features[randomNumber].properties.name.toLowerCase()) {
                correct.play();
                userInput.animate([
                    {border: '2px solid green' },
                    {border: '2px solid black' }
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
                    {border: '2px solid red' },
                    {border: '2px solid black' }
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
    var scoreContainer = gameContainer.select('#score').attr('transform', `translate(60, ${height / 8 <= 80 ? 80 : height / 8 })`);

    scoreContainer.selectAll('*').remove();

    scoreContainer
        .append('circle')
        .attr('r', 40)
        .attr('fill', 'green')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('cx', 40 / 2);

    scoreContainer
        .datum(score)
        .append('text')
        .attr('x', 40 / 2)        
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('dy', 2)
        .attr('fill', 'white')
        .attr('font-size', 32 - 2 * score.toString().length)
        .text(d => d);
}

function drawTimeRemaining() {
    var heightTime = 12;
    var maxTime = time;
    var timerFunction;

    var timeContainer = gameContainer.select('#time')
        // .attr('transform', `translate(0, ${height - heightTime})`);

    timeContainer
        .append('rect')
        .attr('width', width)
        .attr('height', heightTime)
        .attr('fill', 'white')

    timeContainer
        .datum(time)
        .append('rect')
        .attr('width', width)
        .attr('height', heightTime)
        .attr('fill', 'blue')
        .transition()
        .duration(time)
        .ease(easeLinear)
        .on('start', function () {
            ticktock.loop();
            ticktock.speedup(1);
            timerFunction = setInterval(() => {
                time -= 1000;
            }, 1000)
        })
        .on('end', function () {
            ticktock.stop();
            select('#end-game').style('display', 'flex');
            select('#user-input').property('disabled', true);
            clearInterval(timerFunction);
        })
        .attr('width', 0)
        .attrTween("fill", function() {
            return function(t) {
                const interpolate = interpolateRgb("blue", "red");
                const scale = scaleLog().domain([1 - 10000/maxTime, 1]).range([0, 1]).clamp(true);
                return interpolate(scale(t));
            };
          });
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
        clueContainer.text(clue(mapData.features[randomNumber].properties.name.toUpperCase()));
        clueContainer.style('display', 'block');

        var widthClue = clueContainer.node().getBoundingClientRect().width;
        var heightClue = clueContainer.node().getBoundingClientRect().height;
        var left = width / 2 - widthClue / 2;
        var top = height / 8 <= 80 ? 80 - heightClue / 2 : height / 8 - heightClue / 2;
        
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

// function redraw() {
    // width = window.innerWidth;
    // height = window.innerHeight;
    // drawClue(true);
    // drawMap();
    // drawInput();
    // drawScore();
// }

newGame();
// window.addEventListener("resize", redraw);
