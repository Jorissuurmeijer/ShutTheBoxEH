
"use strict";

$(document).ready(function () {
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

  var dice1Index;
  var dice2Index;
  var diceSum = 0;
  var diceRolls = 0;
  var recordDiceRolls = 0;
  var gamesPlayed = 0;
  var gamesWon = 0;
  var $gamesPlayed = $(".games-played");
  var $gamesWon = $(".games-won");

  // Get dice background
  var dice1Bkgnd;
  var dice2Bkgnd;
  var getDice1Bkgnd = function () {
    dice1Index = Math.floor(Math.random() * 6);
    dice1Bkgnd = diceImageClasses[dice1Index];
  };
  var getDice2Bkgnd = function () {
    dice2Index = Math.floor(Math.random() * 6);
    dice2Bkgnd = diceImageClasses[dice2Index];
  };

  // Display incorrect number selection
  var incorrectPopup = function () {
    $("#incorrect-play").fadeIn(1000); // Show the incorrect play popup
  };

  var winGamePopup = function () {
    $(".win-cover").fadeIn(1000);
    $("#win-popup").fadeIn(1000);
    crowdCheering();
  };

  var rollDicemp3 = function () {
    $("#dice-mp3")[0].play();
  };

  var numberSelect = function () {
    $("#number-select")[0].play();
  };

  var crowdCheeringAudio = $("#crowd-cheering")[0];
  var crowdCheering = function () {
    crowdCheeringAudio.play();
  };

  var crowdCheeringStop = function () {
    crowdCheeringAudio.pause();
    crowdCheeringAudio.currentTime = 0.0;
  };

  // Dice animation
  var spinDice = function () {
    setTimeout(function () {
      $dice.addClass("roll-dice-1");
    }, 20);
    setTimeout(function () {
      $dice.removeClass("roll-dice-1").addClass("roll-dice-2");
    }, 600);
    setTimeout(function () {
      $dice.removeClass("roll-dice-2");
    }, 1200);
  };

  var setNumbers = function () {
    for (let i = 1; i <= 10; i++) {
      $(`#num-${i}`).text(i);
    }

    $dice1.removeClass(dice1Bkgnd);
    $dice2.removeClass(dice2Bkgnd);
    getDice1Bkgnd();
    getDice2Bkgnd();
    diceSum = (dice1Index + 1) + (dice2Index + 1);
    $dice1.addClass(dice1Bkgnd);
    $dice2.addClass(dice2Bkgnd);
    diceRolls = 0;
  };

  // Check if the player won
  var winGame = function () {
    if (numbersPlayed.length === 10) {
      winGamePopup();
      gamesWon += 1;
      $gamesWon.text(gamesWon);
      gamesPlayed += 1;
      $gamesPlayed.text(gamesPlayed);
      $numDiv.removeClass("selected played");
      compareDiceRolls();
    }
  };

  var playedNumbers = function () {
    $(".selected").each(function () {
      numbersPlayed.push($(this).text());
    });
    $(".selected").addClass("played").text("");
    $numDiv.removeClass("selected");
  };

  var diceRollCount = function () {
    diceRolls++;
    $(".current-dice-rolls").text(diceRolls);
  };

  var rollTheDice = function () {
    winGame();
    rollDicemp3();
    spinDice();
    setNumbers();
    diceRollCount();
  };

  $numDiv.on("click", function () {
    $(this).toggleClass("selected");
    numberSelect();
  });

  var rollDiceCompleteTurn = function () {
    sumSelectedNumbers = 0;
    var selectedNumbersArray = document.querySelectorAll(".selected");
    for (let i = 0; i < selectedNumbersArray.length; i++) {
      sumSelectedNumbers += parseInt(selectedNumbersArray[i].innerHTML);
    }
    if (sumSelectedNumbers === 0) {
      alert("Please select at least one number.");
    } else if (sumSelectedNumbers !== diceSum) {
      incorrectPopup();
      $numDiv.removeClass("selected");
    } else {
      playedNumbers();
      rollTheDice();
    }
  };

  // Roll dice and check selected numbers
  $("#roll-dice, .dice").on("click", function () {
    rollDiceCompleteTurn();
  });

  var compareDiceRolls = function () {
    if (recordDiceRolls === 0) {
      recordDiceRolls = diceRolls;
      $recordDiceRolls.text(recordDiceRolls);
    } else if (recordDiceRolls < diceRolls) {
      $recordDiceRolls.text(diceRolls);
    }
  };

  // Function to handle the "Give Up" action
  var giveUp = function () {
    alert("You have given up! Game over.");
    setNumbers();
    numbersPlayed = [];
    diceRolls = 0;
    sumSelectedNumbers = 0;
    $(".current-dice-rolls").text(diceRolls);
    crowdCheeringStop();
    // Remove the "selected" class from any selected number boxes
    $numDiv.removeClass("selected");
  };


  // Add event listener to the "Give Up" button
  $("#give-up-button").on("click", function () {
    giveUp();
  });

  // Close win popup and reset game
  $("#close-win-popup, #play-again, .win-cover").on("click", function () {
    $(".win-cover").fadeOut(1000);
    $("#win-popup").fadeOut(1000);
    setNumbers();
    diceRolls = 0;
    diceRollCount();
    numbersPlayed = [];
    sumSelectedNumbers = 0;
    crowdCheeringStop();
  });

  // Event listener for Start Game button
  $("#start-game").on("click", function () {
    $("#start-button-row").hide(); // Hide start button
    $("#dice-row").fadeIn(); // Show dice row
    $("#roll-dice-row").fadeIn(); // Show roll dice button
    $("#1-player-scoreboard").fadeIn(); // Show the scoreboard
    $("#give-up-button").fadeIn(); // Show the "Give Up" button
    setNumbers(); // Initialize the game
  });

  // Event listener for "Back to the Game" and "Close" buttons in the incorrect popup
  $("#lets-play, #close-popup").on("click", function () {
    $("#incorrect-play").fadeOut(1000); // Close the incorrect popup
  });

  setNumbers();
  rollDicemp3();
  spinDice();
});
