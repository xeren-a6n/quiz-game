const timerTime = 20000;
const timerRefreshRate = 50;

class Timer {
    constructor(onEnd) {
        this.#onEnd = onEnd;
        this.reset();
    }

    #startTime
    #pausedTime
    #interval
    #onEnd
    #toReach

    #stopInternal() {
        if(this.#interval !== null) {
            clearInterval(this.#interval);
        }
        this.#interval = null;
    }

    #startInternal() {
        if(this.#interval === null) {
            this.#interval = setInterval(this.onPing, timerRefreshRate);
        }
    }

    reset() {
        this.#stopInternal();
        this.#toReach = timerTime;
        this.#pausedTime = null;
        this.#startTime = null;
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

    onPing() {
        if(this.getRemainingTime() === 0) {
            this.pause();
            this.#onEnd();
        }
        this.redrawTimer();
    }

    isRunning() {
        return this.#interval !== null;
    }

    redrawTimer() {
        ///TODO timer
    }
}