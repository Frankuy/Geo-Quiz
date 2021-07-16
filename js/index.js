// Game Container
var gameContainer = d3.select('#game-svg')
    .attr('viewBox', `0 0 ${width} ${height}`)

function getData() {
    d3.json("/asset/world.geojson")
    .then(function (data) {
        mapData = data;
        randomNumber = Math.floor(Math.random() * mapData.features.length);
        drawMap();
        drawInput();
        drawScore();
        drawTimeRemaining();
    });
}

function drawMap() {
    var projection = d3.geoMercator()
        .scale(1080)
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

    d3.select('#user-input')
        .style('top', (height - heightOffset) + 'px')
        .style('left', (width / 2 - widthInput / 2) + 'px')
        .style('opacity', 1)

    var userInput = document.getElementById('user-input');
    userInput.addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            if (userInput.value.toLowerCase() == mapData.features[randomNumber].properties.name.toLowerCase()) {
                userInput.animate([
                    {border: '2px solid green' },
                    {border: '2px solid black' }
                ],
                {
                    duration: 2000
                })
                score += 1;
                drawScore();
                changeCountry();
            }
            else {
                userInput.animate([
                    {border: '2px solid red' },
                    {border: '2px solid black' }
                ],
                {
                    duration: 2000
                })
            }
        }
    })
    userInput.focus();
}

function drawScore() {
    var scoreContainer = gameContainer.select('#score').attr('transform', `translate(60, ${height / 6})`);

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
    var maxTime = 60000;
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
        .duration(maxTime)
        .ease(d3.easeLinear)
        .on('start', function () {
            timerFunction = setInterval(() => {
                time -= 1000;
            }, 1000)
        })
        .on('end', function () {
            clearInterval(timerFunction);
        })
        .attr('width', 0)
        .attrTween("fill", function() {
            return function(t) {
                if (t >= 1 - 10000/maxTime)  {
                    return `rgb(${t * 255},0,${(1 - t) * 255})`
                }
                else {
                    return "blue"
                }
            };
          });
}


function changeCountry() {
    randomNumber = Math.floor(Math.random() * mapData.features.length);
    drawMap();
}

function redraw() {
    width = window.innerWidth;
    height = window.innerHeight;
    drawMap();
    drawInput();
    drawScore();
}

getData();
window.addEventListener("resize", redraw);

