var ticktock = new sound("/asset/sfx/mixkit-tick-tock-clock-timer-1048.wav");
var startgame = new sound('/asset/sfx/mixkit-simple-game-countdown-921.wav')

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
    this.loop = function() {
        this.sound.play();
        this.sound.addEventListener("ended", () => {
            this.sound.play();
        })
    }
    this.speedup = function(rate) {
        this.sound.playbackRate = rate;
    }
}