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

    renderPlayer() {
        let x1 = document.createElement("div");
        x1.classList.add("col")
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

    renderTable() {
        let d = document.createElement("div");
        d.classList.add("py-2")
        d.classList.add("row")
        d.style.backgroundColor = this.#color;
        d.style.display = "none";
        for (const q of this.#questions) {
            d.appendChild(q.renderBox());
        }
        this.#domTable = d;
        return d;
    }

    getDomOfTable() {
        return this.#domTable;
    }

    getDomOfBox() {
        return this.#domBox;
    }
}