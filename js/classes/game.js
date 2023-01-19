
class Game {
    constructor() {
        this.audio_question = new Audio('music/open_question.mp3');
        this.audio_question.loop = true;

        this.audio_correct = new Audio('music/correct.mp3');
        this.audio_wrong = new Audio('music/wrong.mp3');
        this.audio_chosing = new Audio('music/chosing.mp3');
        this.audio_slide = new Audio('music/slide.mp3');
        this.audio_bonus = new Audio('music/bonus.mp3');
        this.audio_chosing.loop = true;
    }

    audio_question
    audio_correct
    audio_wrong
    audio_chosing
    audio_slide
    audio_bonus

    shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }


    loadPlayer(data) {

        let p = new Player(data.name, data.backgroundColor, data.textColor);
        for (const q of data.questions) {
            p.addQuestion(new Question(q.points, q.question, q.options, q.answer))
        }
        this.#players.push(p);
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
        this.audio_slide.play();
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
        this.audio_question.load();
        this.audio_chosing.pause();
        this.audio_question.play();
    }

    skipTurn() {
        if(this.#currentQuestion !== null) {
            return
        }
        this.#nextPlayer();
        this.audio_slide.play();
    }

    timeout() {
        if(this.#currentQuestion === null || this.#questionFinished) {
            return;
        }
        this.badAnswer(true);
    }

    typedAnswer(answerNumber) {
        if(this.#currentQuestion === null || this.#questionFinished || !this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.#timer.pause();
        let result = this.#currentQuestion.answered(this.getCurrentPlayer(), answerNumber);
        if(result) {
            this.audio_correct.play();
        } else {
            this.audio_wrong.play();
        }
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
        this.audio_correct.play();
    }


    badAnswer(by_timer = false) {
        if(this.#currentQuestion === null || this.#questionFinished) {
            return;
        }
        if(!by_timer) {
            this.#timer.pause();
            this.audio_wrong.play();
        }
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
        this.audio_chosing.load();
        this.audio_chosing.play();
    }

    timerAction() {
        if(this.#currentQuestion === null || this.#questionFinished) {
            return;
        }
        if(this.#timer.isRunning()) {
            this.#timer.pause();
        } else {
            this.#timer.start();
            this.audio_question.pause();
        }
    }

    addTime() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#usedHelp) {
            return;
        }
        this.audio_bonus.play();
        this.#usedHelp = true;
        this.#timer.add();
        this.#currentQuestion.timeExtend();
    }

    showAnswers() {
        if(this.#currentQuestion === null || this.#questionFinished || this.#usedHelp || this.#currentQuestion.isAnswersShown()) {
            return;
        }
        this.audio_bonus.play();
        this.#timer.add(true);
        this.#currentQuestion.showAnswers();
    }


    startup() {
        this.#timer = new Timer(this);
        this.#players = this.shuffle(this.#players);
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
        this.audio_chosing.play();
    }

    printAllAnswers() {
        let qs = [];
        for (const p of this.#players) {
            for (const q of p.getQuestions()) {
                qs.push([p.getName(), q.getScore(), q.getAnswer()].join(","));
            }
        }
        let s = qs.join("<BR>");
        document.body.innerHTML = s;
    }
}