{
    var g = new Game();


    // let files = [
    //     "datafile/sample-questions-kitty.json",
    //     "datafile/sample-questions-kitty.json",
    //     "datafile/sample-questions-kitty.json"
    // ];

    let files = [
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/axinel.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/dan.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/jirik.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/maty.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/eliska.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/lenka.json",
        "https://raw.githubusercontent.com/xeren-a6n/quiz-game/master/datafile/vasik.json"
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
	    if(false) {
		g.printAllAnswers();
	} else {
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
		        case "1":
		            g.typedAnswer(0);
		            break;
		        case "2":
		            g.typedAnswer(1);
		            break;
		        case "3":
		            g.typedAnswer(2);
		            break;
		        case "4":
		            g.typedAnswer(3);
		            break;
		        case "/":
		            g.addTime();
		            break;
		        case "6":
		            g.skipTurn();
		            break;
		        case "0":
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
		        case "*":
		            g.showAnswers();
		            break;
		    }
		});	
	}		
    });
}

//TODO abcdtm spsace and -> keyboard actions to nethods

//TODO assign files
