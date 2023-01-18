
class Game {
    constructor() {
        this.startup();
    }

    loadPlayer(name, color, textColor, questions) {
        let p = new Player(name, color, textColor);
        this.#players.push(p);
    }


    #players = [];
    #currentPlayer = 0;
    #currentQuestion = null;
    #timer
    #questionFinished = false;
    #usedHelp = false;

    #nextPlayer() {
        this.#currentPlayer++;
        if(this.#currentPlayer >= this.#players.length) {
            this.#currentPlayer = 0;
        }
        this.#timer.reset();
        this.#questionFinished = false;
        this.#currentQuestion = null;
        this.#usedHelp = false;
    }

    getCurrentPlayer() {
        return this.#players[this.#currentPlayer];
    }

    chooseTable() {
        if(this.#currentQuestion !== null) {
            return;
        }
        ///TODO animation of changing table
    }

    chooseQuestion() {
        if(this.#currentQuestion !== null) {
            return;
        }
        ///TODO swap screen to question choose and set choosen question
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
        this.#currentQuestion.correctAnswer(this.getCurrentPlayer());
    }

    goodAnswer() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        this.#currentQuestion.correctAnswer(this.getCurrentPlayer());
    }

    badAnswer() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        this.#currentQuestion.wrongAnswer();
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
        //TODO proper loadind
        //loading
        let p1 = new Player("Otta", "red", "white");
        p1.addQuestion(new Question(1000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(2000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(4000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(1000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(2000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))
        p1.addQuestion(new Question(4000, "1+1 je?", ["1","2","3","4"], "2"))
        //loading
        let p2 = new Player("Domink", "blue", "white");
        p2.addQuestion(new Question(1000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(2000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(1000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(2000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))
        p2.addQuestion(new Question(3000, "1+1 je?", ["1","2","3","4"], "2"))

        this.#players.push(p1);
        this.#players.push(p2);

        this.#timer = new Timer(this.timeout);
        let pl = document.getElementById("players");
        let g = document.getElementById("game");
        for (const p of this.#players) {
            pl.appendChild(p.renderPlayer());
            g.appendChild(p.renderTable())
        }

        $(this.getCurrentPlayer().getDomOfTable()).fadeIn();
        this.getCurrentPlayer().getDomOfBox().classList.add("bg-dark");
    }
}