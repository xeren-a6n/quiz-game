

const showAnswersPenalization = 0.5;
const timeExtendPenalization = 0.8;

class Question {

    constructor(score, text, answers, correctAnswer) {
        this.#score = score;
        this.#text = text;
        this.#answers = answers;
        this.#correctAnswer = correctAnswer;
    }

    /**
     * @type number this.#score
     */
    #score;
    #text;
    #answers;
    #correctAnswer;
    #visibleAnswers = false;
    #open = true;
    #table;

    #domBox;
    #domScore;
    #domAnswers;

    #applyPenalization(penalization) {
        let score = this.#score * penalization;
        this.#score = Math.floor(score);
    }

    answered(player, answerNumber) {
        if(this.#answers[answerNumber] === this.#correctAnswer) {
            this.correctAnswer(player);
        } else {
            this.wrongAnswer(answer);
        }
    }

    correctAnswer(player) {
        if(!this.#open) {
            return;
        }
        let score = this.#score;
        if(player !== this.#table.getPlayer()) {
            score *= (this.#table.getPlayer().getScore() / player.getScore())
        }
        player.addScore(score);
        this.#open = false;
        this.redrawBox();
    }

    wrongAnswer(answer) {
        if(this.#visibleAnswers && answer !== null) {
            let index = this.#answers.indexOf(answer);
            if (index !== -1) {
                this.#answers.splice(index, 1);
            }
            if(this.#answers.length > 1) {
                this.#open = false;
            } else {
                this.#applyPenalization(showAnswersPenalization);
            }
        } else {
            this.#applyPenalization(timeExtendPenalization);
        }
        this.redrawBox();
    }

    timeExtend() {
        this.#applyPenalization(timeExtendPenalization);
        this.redrawBox();
    }

    showAnswers() {
        if(this.#visibleAnswers) {
            return
        }
        this.#visibleAnswers = true;
        this.#applyPenalization(showAnswersPenalization);
        this.redrawAnswers();
    }

    /**
     * @param table
     */
    assignToTable(table) {
        this.#table = table;
    }

    renderQuestion() {
        let t = document.createElement("div");
        t.classList.add("row");
        t.classList.add("mt-5");
        let h = document.createElement("div");
        h.classList.add("col-12");
        h.classList.add("mb-5");
        let h1 = document.createElement("h1");
        let txt = document.createTextNode(this.#text);
        h1.appendChild(txt);
        h.appendChild(h1);
        let r = document.createElement("div");
        r.classList.add("row");
        this.#domAnswers = r;
        this.redrawAnswers();
        return t;
    }

    redrawAnswers() {
        let letters = ["A ", "B ", "C ", "D ", "E ", "F "];
        let i = 0;
        this.#domAnswers.innerHTML = "";
        for (const ans of this.#answers) {
            let d = document.createElement("div");
            d.classList.add("col-6");
            let h3 = document.createElement("h3");
            h3.classList.add("border");
            h3.classList.add("border-dark");
            let b = document.createElement("b");
            let letter = document.createTextNode(letters[i]);
            b.appendChild(letter);
            let txt = document.createTextNode(ans);
            h3.appendChild(b);
            h3.appendChild(txt);
            d.appendChild(h3);
            this.#domAnswers.appendChild(d);
            i++;
        }
    }

    renderBox() {
        let x1 = document.createElement("div");
        x1.classList.add("col-3")
        let x = document.createElement("div");
        x.classList.add("bg-white")
        x.classList.add("my-2")
        let y = document.createElement("h1");
        x.appendChild(y);
        x1.appendChild(x);
        this.#domBox = x1;
        this.#domScore = y;
        this.redrawBox();
        return x1;
    }

    redrawBox() {
        this.#domScore.innerHTML = "";
        let x = document.createTextNode(this.#score.toString());
        if(!this.#open) {
            this.#domBox.classList.add("bg-secondary");
        }
        this.#domScore.appendChild(x);
    }

    isAnswersShown() {
        return this.#visibleAnswers;
    }
}