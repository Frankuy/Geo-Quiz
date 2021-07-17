import TicktockWav from "../asset/sfx/mixkit-tick-tock-clock-timer-1048.wav";
import StartgameWav from "../asset/sfx/mixkit-simple-game-countdown-921.wav";
import CorrectWav from "../asset/sfx/351564__bertrof__game-sound-correct-with-delay.wav";
import IncorrectWav from "../asset/sfx/351563__bertrof__game-sound-incorrect-with-delay.wav";

var ticktock = new sound(TicktockWav);
var startgame = new sound(StartgameWav);
var correct = new sound(CorrectWav);
var incorrect = new sound(IncorrectWav);

// var ticktock = new sound("/asset/sfx/mixkit-tick-tock-clock-timer-1048.wav");
// var startgame = new sound('/asset/sfx/mixkit-simple-game-countdown-921.wav');
// var correct = new sound('/asset/sfx/351564__bertrof__game-sound-correct-with-delay.wav');
// var incorrect = new sound('/asset/sfx/351563__bertrof__game-sound-incorrect-with-delay.wav');

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
        this.sound.currentTime = 0;
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

export { ticktock, startgame, correct, incorrect  };