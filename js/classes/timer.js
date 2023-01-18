const timerTime = 20000;
const timerRefreshRate = 50;

class Timer {
    constructor(game) {
        this.#game = game;
        this.reset();
    }

    #startTime
    #pausedTime
    #interval
    #game
    #toReach
    #domTimer = null;

    #stopInternal() {
        if(this.#interval !== null) {
            clearInterval(this.#interval);
        }
        this.#interval = null;
    }

    #startInternal() {
        if(this.#interval === null) {
            this.#interval = setInterval(this.onPing, timerRefreshRate, this);
        }
    }

    reset() {
        this.#stopInternal();
        this.#toReach = timerTime;
        this.#pausedTime = null;
        this.#startTime = null;
        this.redrawTimer();
    }

    add() {
        this.#toReach += timerTime;
    }

    start() {
        if(this.#interval !== null) {
            return;
        }
        let d = (new Date()).getTime();
        if(this.#pausedTime !== null) {
            d -= this.#pausedTime - this.#startTime;
            this.#pausedTime = null;
        }
        this.#startTime = d;
        this.#startInternal();
    }

    pause() {
        this.#stopInternal();
        this.#pausedTime = (new Date()).getTime();
    }

    getRemainingTime() {
        if(this.#startTime === null) {
            return this.#toReach / 1000;
        }
        let since = this.#pausedTime ? this.#pausedTime : (new Date()).getTime();
        let ms = this.#toReach - (since - this.#startTime);
        if(ms < 0) {
            ms = 0;
        }
        return Math.ceil(ms / 1000);
    }

    onPing(timer) {
        if(timer.getRemainingTime() === 0) {
            timer.pause();
            timer.#game.timeout();
        }
        timer.redrawTimer();
    }

    isRunning() {
        return this.#interval !== null;
    }

    renderTimer() {
        let t = document.createElement("div");
        t.classList.add("row");
        t.classList.add("my-2");
        let c = document.createElement("div");
        c.classList.add("col-12");
        c.classList.add("bg-dark");
        let h = document.createElement("h1");
        h.classList.add("text-white");
        this.#domTimer = h;
        c.appendChild(h);
        t.appendChild(c);
        this.redrawTimer()
        return t;
    }

    redrawTimer() {
        if(this.#domTimer === null) {
            return;
        }
        this.#domTimer.innerHTML = "";
        let txt = document.createTextNode(this.getRemainingTime().toString());
        this.#domTimer.appendChild(txt);
    }
}