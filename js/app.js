/*
 * shuffle() function provided by Udacity's starter code
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/*
 * Following code added by Chris Pereira.
 */

var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game state variables
var openg = [];
var matchedcard = 0;
var CounterMove = 0;
var countStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

// Difficulty settings (max number of moves for each star)
var hard = 15;
var medium = 20;

var modal = $("#win-modal");

/*
 * Support functions used by main event callback functions.
 */

// Interval function to be called every second, increments timer and updates HTML
var timerBegine = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

// Resets timer state and restarts timer
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(timerBegine, 1000);
};

// Randomizes cards on board and updates card HTML
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    resetTimer();
};

// Toggles win modal on
function showModal() {
    modal.css("display", "block");
};

// Removes last start from remaining stars, updates modal HTML
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    countStars--;
    $(".num-stars").text(String(countStars));
};

// Restores star icons to 3 stars, updates modal HTML
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    countStars = 3;
    $(".num-stars").text(String(countStars));
};

// Updates number of moves in the HTML, removes star is necessary based on difficulty variables
function updateMoveCounter() {
    $(".moves").text(CounterMove);

    if (CounterMove === hard || CounterMove === medium) {
        removeStar();
    }
};

// Checks if card is a valid move (if it not currently matched or open)
function isValid(card) {
    return !(card.hasClass("openg") || card.hasClass("match"));
};

// Returns whether or not currently open cards match
function checkMatch() {
    if (openg[0].children().attr("class")===openg[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

// Returns win condition
function hasWon() {
    if (matchedcard === 16) {
        return true;
    } else {
        return false;
    }
};

// Sets currently open cards to the match state, checks win condition
var setMatch = function() {
    openg.forEach(function(card) {
        card.addClass("match");
    });
    openg = [];
    matchedcard += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// Sets currently open cards back to default state
var resetOpen = function() {
    openg.forEach(function(card) {
        card.toggleClass("openg");
        card.toggleClass("show");
    });
    openg = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("openg")) {
        card.addClass("openg");
        card.addClass("show");
        openg.push(card);
    }
};

/*
 * Event callback functions
 */

// Resets all game state variables and resets all required HTML to default state
var resetGame = function() {
    openg = [];
    matchedcard = 0;
    Countermove = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

// Handles primary game logic of game
var onClick = function() {
    if (isValid( $(this) )) {

        if (openg.length === 0) {
            openCard( $(this) );

        } else if (openg.length === 1) {
            openCard( $(this) );
            CounterMove++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

// Resets game state and toggles win modal display off
var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};

/*
 * Initalize event listeners
 */

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

// Provides a randomized game board on page load
$(updateCards);
