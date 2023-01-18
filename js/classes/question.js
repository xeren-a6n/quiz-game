

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
    #domScoreAnswers;
    #domQuestion;

    #applyPenalization(penalization) {
        let score = this.#score * penalization;
        this.#score = Math.floor(score);
    }

    answered(player, answerNumber) {
        if(this.#answers[answerNumber] === this.#correctAnswer) {
            this.correctAnswer(player);
        } else {
            this.wrongAnswer(answerNumber);
        }
    }

    correctAnswer(player) {
        //TODO sound good
        if(!this.#open) {
            return;
        }
        let score = this.#score;
        if(player !== this.#table) {
            score *= (this.#table.getScore() / player.getScore())
        }
        score = Math.floor(score);
        player.addScore(score);
        this.#open = false;
        this.redrawBox();
    }

    wrongAnswer(answerNumber = null) {
        //TODO sound bad
        if(this.#visibleAnswers && answerNumber !== null) {
            if (answerNumber !== null) {
                this.#answers.splice(answerNumber, 1);
            }
            console.log(this.#answers);
            console.log(this.#answers.length);
            if(this.#answers.length === 1) {
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
        this.redrawAnswers();
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
        t.style.display = "none";
        let h = document.createElement("div");
        h.classList.add("col-12");
        h.classList.add("mb-5");
        let h1 = document.createElement("h1");
        let txt = document.createTextNode(this.#text);
        h1.appendChild(txt);
        let h2 = document.createElement("h2");
        this.#domScoreAnswers = h2;
        let txt2 = document.createTextNode(this.#score.toString());
        h2.appendChild(txt2);
        h.appendChild(h2);
        h.appendChild(h1);
        let r = document.createElement("div");
        r.classList.add("row");
        t.appendChild(h);
        this.#domAnswers = r;
        t.appendChild(r);
        this.redrawAnswers();
        this.#domQuestion = t;
        return t;
    }

    redrawAnswers() {
        let letters = ["A ", "B ", "C ", "D ", "E ", "F "];
        let i = 0;
        this.#domAnswers.innerHTML = "";
        let txt2 = document.createTextNode(this.#score.toString());
        this.#domScoreAnswers.innerHTML = "";
        this.#domScoreAnswers.appendChild(txt2);
        if(this.#visibleAnswers) {
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
    }

    renderBox(idt, id) {
        let x1 = document.createElement("div");
        x1.classList.add("col-3")
        x1.classList.add("question-box")
        x1.dataset.table = idt.toString();
        x1.dataset.id = id.toString();
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
            this.#domBox.firstChild.classList.remove("bg-white");
            this.#domBox.firstChild.classList.add("bg-secondary");
        } else {
            this.#domBox.firstChild.classList.remove("bg-secondary");
            this.#domBox.firstChild.classList.add("bg-white");
        }
        this.#domScore.appendChild(x);
    }

    isAnswersShown() {
        return this.#visibleAnswers;
    }

    isOpen() {
        return this.#open;
    }

    getQuestionDom() {
        return this.#domQuestion;
    }
}