
class Game {
    constructor() {
    }


    loadPlayer(data) {

        let p = new Player(name, color, textColor);
        // p.addQuestion(new Question(1000, "1+1 je?", ["1","2","3","4"], "2"))
        // this.#players.push(p);
    }


    #players = [];
    #currentPlayer = 0;
    #currentQuestion = null;
    #timer
    #questionFinished = false;
    #usedHelp = false;

    #nextPlayer() {
        if(this.#currentQuestion !== null) {
            return;
        }
        this.#currentPlayer++;
        if(this.#currentPlayer >= this.#players.length) {
            this.#currentPlayer = 0;
        }
        this.#timer.reset();
        this.#questionFinished = false;
        this.#currentQuestion = null;
        this.#usedHelp = false;

        $(".player-table").slideUp();
        $(this.getCurrentPlayer().getDomOfTable()).slideDown();
        $(".player-card").removeClass("bg-dark");
        $(".player-card").removeClass("bg-primary");
        $(this.getCurrentPlayer().getDomOfBox()).addClass("bg-dark");
    }

    getCurrentPlayer() {
        return this.#players[this.#currentPlayer];
    }

    chooseTable(id) {
        if(this.#currentQuestion !== null || this.#players[id].getDomOfTable().style.display !== "none") {
            return;
        }
        $(".player-table").slideUp();
        $(this.#players[id].getDomOfTable()).slideDown();
        $(".player-card").removeClass("bg-primary");
        if(this.#players[id] !== this.#currentPlayer) {
            $(this.#players[id].getDomOfBox()).addClass("bg-primary");
        }

    }

    chooseQuestion(table, question) {
        let p = this.#players[table];
        let q = p.getQuestion(question);
        if(this.#currentQuestion !== null || !q.isOpen() || (p !== this.getCurrentPlayer() && (!p.isStealingEnabled() || !this.getCurrentPlayer().isStealingEnabled()))) {
            return;
        }
        $(".player-table").slideUp();
        this.#currentQuestion = q;
        q.redrawAnswers();

        $(q.getQuestionDom()).fadeIn();
    }

    skipTurn() {
        if(this.#currentQuestion !== null) {
            return
        }
        this.#nextPlayer();
    }

    timeout() {
        if(this.#currentQuestion === null || this.#questionFinished) {
            return;
        }
        this.badAnswer();
    }

    typedAnswer(answerNumber) {
        if(this.#currentQuestion === null || this.#questionFinished || !this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        this.#currentQuestion.answered(this.getCurrentPlayer(), answerNumber);
        this.getCurrentPlayer().redrawPlayer();
        this.#questionFinished = true;
    }

    goodAnswer() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        this.#currentQuestion.correctAnswer(this.getCurrentPlayer());
        this.getCurrentPlayer().redrawPlayer();
        this.#questionFinished = true;
    }

    badAnswer() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        this.#currentQuestion.wrongAnswer();
        this.#questionFinished = true;
    }

    nextPlayer() {
        if(this.#currentQuestion === null || !this.#questionFinished) {
            return;
        }
        $(this.#currentQuestion.getQuestionDom()).fadeOut();
        this.#currentQuestion = null;
        this.#nextPlayer();
    }

    timerAction() {
        if(this.#currentQuestion === null || this.#questionFinished) {
            return;
        }
        if(this.#timer.isRunning()) {
            this.#timer.pause();
        } else {
            this.#timer.start();
        }
    }

    addTime() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#usedHelp) {
            return;
        }
        this.#usedHelp = true;
        this.#timer.add();
        this.#currentQuestion.timeExtend();
    }

    showAnswers() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#usedHelp || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.add();
        this.#currentQuestion.showAnswers();
    }


    startup() {
        this.#timer = new Timer(this);
        let pl = document.getElementById("players");
        let g = document.getElementById("game");
        g.appendChild(this.#timer.renderTimer());
        let i = 0;
        for (const p of this.#players) {
            pl.appendChild(p.renderPlayer(i));
            g.appendChild(p.renderTable(i))
            i++;
        }

        for (const p of this.#players) {
            p.renderQuestions(g);
        }

        $(this.getCurrentPlayer().getDomOfTable()).fadeIn();
        this.getCurrentPlayer().getDomOfBox().classList.add("bg-dark");
    }
}