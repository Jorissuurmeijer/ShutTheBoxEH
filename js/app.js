"use strict";

$(document).ready(function() {
  // Useful variables
  var $numDiv = $(".col-1");
  var numbersPlayed = [];
  var $recordDiceRolls = $(".record-dice-rolls");
  var $yellowBkgnd = $(".yellow-bkgnd");

  // Start of game constant for the sum of selected numbers on Number Line
  var sumSelectedNumbers = 0;

  var $dice1 = $("#dice-1");
  var $dice2 = $("#dice-2");
  var $dice = $(".dice");

  // Dice background image classes array
  var diceImageClasses = ["dice-1", "dice-2", "dice-3", "dice-4", "dice-5", "dice-6"];

  // 2 variables to hold the index number for the dye background image class
  var dice1Index;
  var dice2Index;

  // variable to hold the sum of the dice for comparison to player selections on Number Line
  var diceSum = 0;

  // Constant to keep track of the number of times the user rolls the dice in each game
  var diceRolls = 0;

  // Constant for the fewest rolls of the dice to win the game
  var recordDiceRolls = 0;

  // Number of games played & won
  var gamesPlayed = 0;
  var gamesWon = 0;
  var $gamesPlayed = $(".games-played");
  var $gamesWon = $(".games-won");

  // functions to give you a number between and including 0 & 5 for the index of dice background image classes
  var dice1Bkgnd;
  var dice2Bkgnd;
  var getDice1Bkgnd = function() {
    dice1Index = Math.floor(Math.random() * 6);
    dice1Bkgnd = diceImageClasses[dice1Index];
  };
  var getDice2Bkgnd = function() {
    dice2Index = Math.floor(Math.random() * 6);
    dice2Bkgnd = diceImageClasses[dice2Index];
  };

  // Popup Event listeners & functionality
  var $winCover = $(".win-cover");
  var $winPopup = $("#win-popup");

  // Event listener to flip title
  $("h1").on("click", function() {
    $(this).toggleClass("vertical-flip");
  });

  // Event Listener to display Instructions Popup
  $("#instructions").on("click", function() {
    $("#how-to-popup").fadeIn(1000);
  });
  // Event Listener to hide Instructions popup
  $("#lets-play, #close-popup, .popup-cover").on("click", function() {
    $(".popup-cover").fadeOut(1000);
  });

  // function to display a popup when the incorrect numbers are selected
  var incorrectPopup = function() {
    $("#incorrect-play").fadeIn(1000);
  };

  // Popup window that displays if you win the game
  var winGamePopup = function() {
    $winCover.fadeIn(1000);
    $winPopup.fadeIn(1000);
    crowdCheering();
  };

  // SOUND EFFECTS
  var rollDicemp3 = function() {
    $("#dice-mp3")[0].play();
  };

  var numberSelect = function() {
    $("#number-select")[0].play();
  };

  var crowdCheeringAudio = $("#crowd-cheering")[0];
  var crowdCheering = function() {
    crowdCheeringAudio.play();
  };

  var crowdCheeringStop = function() {
    crowdCheeringAudio.pause();
    crowdCheeringAudio.currentTime = 0.0;
  };

  // Function that spins dice
  var spinDice = function() {
    setTimeout(function() {
      $dice.addClass("roll-dice-1");
    }, 20);
    setTimeout(function() {
      $dice.removeClass("roll-dice-1").addClass("roll-dice-2");
    }, 600);
    setTimeout(function() {
      $dice.removeClass("roll-dice-2");
    }, 1200);
  };

  var setNumbers = function() {
    for (let i = 1; i <= 10; i++) {
      $(`#num-${i}`).text(i);
    }

    // remove dice background class
    $dice1.removeClass(dice1Bkgnd);
    $dice2.removeClass(dice2Bkgnd);

    // update dice1Bkgnd & dice2Bkgnd
    getDice1Bkgnd();
    getDice2Bkgnd();

    // update variable diceSum with new sum of rolled dice
    diceSum = (dice1Index + 1) + (dice2Index + 1);

    // add new dice background class to update dice background image
    $dice1.addClass(dice1Bkgnd);
    $dice2.addClass(dice2Bkgnd);
    diceRolls = 0;
  };

  // Function that checks to see if you have won the game
  var winGame = function() {
    if (numbersPlayed.length === 10) {
      winGamePopup();
      gamesWon += 1;
      $gamesWon.text(gamesWon);
      gamesPlayed += 1;
      $gamesPlayed.text(gamesPlayed);
      $numDiv.removeClass("selected played");
      compareDiceRolls();
    } else {
      return;
    }
  };

  // function to black out numbers that have already been played successfully
  var playedNumbers = function() {
    for (let i = 0; i < $(".selected").length; i++) {
      numbersPlayed.push($(".selected")[i]);
    }
    $(".selected").addClass("played");
    $(".selected").text("");
    $numDiv.removeClass("selected");
  };

  // update the current number of dice rolls
  var diceRollCount = function() {
    diceRolls++;
    $(".current-dice-rolls").text(diceRolls);
  };

  var rollTheDice = function() {
    // check to see if user has won game
    winGame();

    // play roll dice sound
    rollDicemp3();

    // Dice animation
    spinDice();

    // remove dice background class
    $dice1.removeClass(dice1Bkgnd);
    $dice2.removeClass(dice2Bkgnd);

    // update dice1Bkgnd & dice2Bkgnd
    getDice1Bkgnd();
    getDice2Bkgnd();

    // update variable diceSum with new sum of rolled dice
    diceSum = (dice1Index + 1) + (dice2Index + 1);

    // add new dice background class to update dice background image
    $dice1.addClass(dice1Bkgnd);
    $dice2.addClass(dice2Bkgnd);

    // update the dice roll count variable
    diceRollCount();
  };

  // Function that toggles the class "selected" on the numbers when clicked on
  $numDiv.on("click", function() {
    $(this).toggleClass("selected");
    numberSelect();
  });

  // Function to COMPARE sum of dice to sum of selected numbers
  var rollDiceCompleteTurn = function() {
    sumSelectedNumbers = 0;
    var selectedNumbersArray = document.querySelectorAll(".selected");
    for (let i = 0; i < selectedNumbersArray.length; i++) {
      sumSelectedNumbers += parseInt(selectedNumbersArray[i].innerHTML);
    }
    if (sumSelectedNumbers === 0) {
      rollTheDice();
    } else if (sumSelectedNumbers !== diceSum) {
      incorrectPopup();
      $numDiv.removeClass("selected");
    } else {
      playedNumbers();
      rollTheDice();
    }
  };

  // Event listener on Roll Dice button and individual Dice to roll the dice and check selected numbers
  $("#roll-dice, .dice").on("click", function() {
    rollDiceCompleteTurn();
  });

  // Update record dice rolls with current number
  var compareDiceRolls = function() {
    if (recordDiceRolls === 0) {
      recordDiceRolls = diceRolls;
      $recordDiceRolls.text(recordDiceRolls);
    } else if (recordDiceRolls < diceRolls) {
      $recordDiceRolls.text(diceRolls);
    } else {
      return;
    }
  };

  // Function to calculate the sum of unselected boxes
  var calculateUnselectedSum = function() {
    var unselectedSum = 0;
    $(".col-1").each(function() {
      if (!$(this).hasClass("played")) {
        unselectedSum += parseInt($(this).text());
      }
    });
    return unselectedSum;
  };

  // Function to handle the "Give Up" action
  var giveUp = function() {
    var unselectedSum = calculateUnselectedSum();
    // Show give up popup and display the sum of unselected boxes
    $("#unselected-sum").text(unselectedSum);
    $("#give-up-popup").fadeIn(1000);
  };

  // Add event listener to the "Give Up" button
  $("#give-up-button").on("click", function() {
    giveUp();
  });

  // Event Listener for closing the "Give Up" popup and resetting the game
  $("#close-give-up-popup, #go-home").on("click", function() {
    $("#give-up-popup").fadeOut(1000);
    // Reset the game and go back to the home screen
    setNumbers();
    numbersPlayed = [];
    diceRolls = 0;
    $(".current-dice-rolls").text(diceRolls);
    crowdCheeringStop();
    // Hide the game space and go back to the start screen
    $("#game-space").hide();
    $("#welcome-scoreboard").show();
  });

  // Event Listener to close win popup window and reset the game
  $("#close-win-popup, #play-again, .win-cover").on("click", function() {
    $winCover.fadeOut(1000);
    $winPopup.fadeOut(1000);
    setNumbers();
    diceRolls = 0;
    diceRollCount();
    numbersPlayed = [];
    sumSelectedNumbers = 0;
    crowdCheeringStop();
  });

  setNumbers();
  rollDicemp3();
  spinDice();
  rollTheDice();
});
