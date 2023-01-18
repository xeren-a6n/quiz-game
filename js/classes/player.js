const scoreToSteal = 1000;
class Player {
    constructor(name, color, textColor) {
        this.#name = name;
        this.#color = color;
        this.#textColor = textColor;
    }
    #score = 0;
    #name;
    #color;
    #textColor;
    #questions = [];

    addQuestion(question) {
        this.#questions.push(question);
        question.assignToTable(this);
    }

    #dom = null;
    #domTable = null;
    #domBox = null;

    getScore() {
        return this.#score;
    }

    addScore(plus) {
        this.#score += plus;
    }

    isStealingEnabled() {
        return this.#score > scoreToSteal;
    }

    renderPlayer(id) {
        let x1 = document.createElement("div");
        x1.classList.add("col")
        x1.classList.add("player-card")
        x1.dataset.id = id.toString()
        let x = document.createElement("div");
        x.classList.add("border")
        x.classList.add("my-3")
        x.style.backgroundColor = this.#color;
        x.style.color = this.#textColor;
        let y = document.createElement("h4");
        let z = document.createTextNode(this.#name);
        y.appendChild(z);
        x.appendChild(y);
        y = document.createElement("h5");
        x.appendChild(y);
        x1.appendChild(x);
        this.#dom = y;
        this.#domBox = x1;
        this.redrawPlayer();
        return x1;
    }

    redrawPlayer() {
        let x = document.createTextNode(this.#score.toString());
        this.#dom.innerHTML = "";
        this.#dom.appendChild(x);
    }

    renderTable(id) {
        let d = document.createElement("div");
        d.classList.add("py-2")
        d.classList.add("row")
        d.classList.add("player-table")
        d.dataset.id = id.toString();
        d.style.backgroundColor = this.#color;
        d.style.display = "none";
        let h = document.createElement("h2");
        h.style.color = this.#textColor;
        let n = document.createTextNode(this.#name);
        h.appendChild(n);
        d.appendChild(h);
        let i = 0;
        for (const q of this.#questions) {
            d.appendChild(q.renderBox(id, i));
            i++
        }
        this.#domTable = d;
        return d;
    }

    renderQuestions(g) {
        for (const q of this.#questions) {
            g.appendChild(q.renderQuestion());
        }
    }

    getDomOfTable() {
        return this.#domTable;
    }

    getDomOfBox() {
        return this.#domBox;
    }

    getQuestion(id) {
        return this.#questions[id];
    }
}