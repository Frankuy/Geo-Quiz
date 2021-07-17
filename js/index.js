// Game Container
var gameContainer = d3.select('#game-svg')
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
    d3.select('#user-input').property('disabled', false);
    d3.select('#start-game').style('display', 'flex');
    d3.select('#end-game').style('display', 'none');

    // Button event listener
    d3.select('#new-game').on('click', function() { newGame(); })
    d3.select('#pass-button').on('click', function() { pass(); })
    
    // Show start countdown event
    var timer = setInterval(() => {
        if (countdown == 4) {
            startgame.play();
        }
        if (countdown <= 4 && countdown > 0) {
            d3.select('#countdown').text(countdown);
        }
        else {
            clearInterval(timer);
            d3.select('#countdown').text('');
            d3.select('#start-game').style('display', 'none');
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

function getData() {
    d3.json("/asset/world.geojson")
    .then(function (data) {
        // Get map then game played
        mapData = data;
        newGame();
    });
}

function drawMap() {
    var area = d3.geoPath().area(mapData.features[randomNumber])

    var scaleLog = d3.scaleLog().domain(
        d3.extent(mapData.features, feature => d3.geoPath().area(feature))
    ).range([1080, 50])

    var projection = d3.geoMercator()
        // .scale(1080)
        .scale(scaleLog(area))
        .center(d3.geoCentroid(mapData.features[randomNumber]))
        .translate([width / 2, height / 2]);
    
    var pathGenerator = d3.geoPath().projection(projection);

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

    d3.select('#pass-button')
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 + widthInput / 2 + 24) + 'px')

    d3.select('#user-input')
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
        .ease(d3.easeLinear)
        .on('start', function () {
            ticktock.loop();
            ticktock.speedup(1);
            timerFunction = setInterval(() => {
                time -= 1000;
            }, 1000)
        })
        .on('end', function () {
            ticktock.stop();
            d3.select('#end-game').style('display', 'flex');
            d3.select('#user-input').property('disabled', true);
            clearInterval(timerFunction);
        })
        .attr('width', 0)
        .attrTween("fill", function() {
            return function(t) {
                const interpolate = d3.interpolateRgb("blue", "red");
                const scale = d3.scaleLog().domain([1 - 10000/maxTime, 1]).range([0, 1]).clamp(true);
                return interpolate(scale(t));
            };
          });
}

function drawPassButton(show) {
    if (show) {
        d3.select('#pass-button').style('display', 'block');
    }
    else {
        d3.select('#pass-button').style('display', 'none');
    }
}

function drawClue(show) {
    var clueContainer = d3.select('#clue');

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

function redraw() {
    width = window.innerWidth;
    height = window.innerHeight;
    drawClue(true);
    drawMap();
    drawInput();
    drawScore();
}

getData();
window.addEventListener("resize", redraw);

