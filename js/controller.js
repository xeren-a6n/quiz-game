{
    let g = new Game();


    // let files = [
    //     "datafile/sample-questions-kitty.json",
    //     "datafile/sample-questions-kitty.json",
    //     "datafile/sample-questions-kitty.json"
    // ];
    //
    let files = [
        "datafile/dan.json",
        "datafile/domink.json",
        "datafile/michaela.json",
        "datafile/ondra.json",
        "datafile/pavel.json",
        "datafile/tomas.json",
        "datafile/veru.json"
    ];

    let promises = [];

    for (const file of files) {
        promises.push(
            fetch(file)
                .then(response => response.json())
                .then(json => g.loadPlayer(json))
        );
    }

    Promise.all(promises).then(function() {

        g.startup();

        $(".player-card").click(function () {
            g.chooseTable($(this).data("id"))
        });
        $(".question-box").click(function () {
            g.chooseQuestion($(this).data("table"), $(this).data("id"))
        });

        $(document).keypress(function (e) {
            let k = e.originalEvent.key;
            switch (k) {
                case "a":
                    g.typedAnswer(0);
                    break;
                case "b":
                    g.typedAnswer(1);
                    break;
                case "c":
                    g.typedAnswer(2);
                    break;
                case "d":
                    g.typedAnswer(3);
                    break;
                case "t":
                    g.addTime();
                    break;
                case "s":
                    g.skipTurn();
                    break;
                case " ":
                    g.timerAction();
                    break;
                case "Enter":
                    g.nextPlayer();
                    break;
                case "+":
                    g.goodAnswer();
                    break;
                case "-":
                    g.badAnswer();
                    break;
                case "z":
                    g.showAnswers();
                    break;
            }
        });
    });
}

//TODO abcdtm spsace and -> keyboard actions to nethods

//TODO assign files