/*-- Jeff Chernenko | A00745858 | COMP 2132 */

/*
General Requirements:

- Styled with CSS to present a high-quality user experience.
- There must be at least 6 images used.
- All paths used in HTML, CSS and Javascript files must be relative paths.
- HTML, CSS and Javascript files must be free of serious errors (warnings are ok).
- Code must be well tabbed and use descriptive variable names.
- Javascript code must include atleast one Function and one Object.
- Must include at least one Javascript animation (for example, a fade in effect).
- jQuery may be used if desired.
- CSS should be compiled from SASS. SASS file(s) should demonstrate the use of SASS 
variables and at least one SASS mixin. Both .css and .scss files should be included with
the project submission. 
- Project must be published to a public repository on Github.com


Dice Game Requirements:

Create a dice game where a user plays against the computer. The user and the computer each roll a pair of dice 3 times. After the third roll of the dice the player with highest score wins.

The scoring for the game works as follows: 

(See Scoring Rules in calculateScore Function)

The game should provide a text or graphical output showing the following:

- The current rolled dice values for the player and the computer. 
- The score for this round for the player and the computer.
- The accumulated total score for the player and computer.

The game should provide a button that will do the following: 

- Roll a pair dice for the player and another pair of dice for the computer, calculate the score for each of the player’s then update the browser display to reflect the state of the game.

After three rolls of the dice the game should total up the scores and display a message
displaying who the winner was.  

The game should provide a button that will reset the game and start a new game.
*/


// Player Object
class Player {

    constructor() {
        this.score = 0;
        this.rolls = [];
    }
}


// Computer Object
class Computer {

    constructor() {
        this.score = 0;
        this.rolls = [];
    }
}


let player = new Player();
let computer = new Computer();
let round = 0;
let history = [];


// Function - Randomize Dice Roll
// Returns - Two Dice with Random Ints
function randomDice() {

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return [dice1, dice2];
}


// Function - Calculate Score Based On Radomized Roll
// Parameter - dice
// Returns - Dice Values Based on Scoring Rules
function calculateScore(dice) {
  
    // If any of the players two dice comes up as a 1 then the score for that round for the player is 0. eg: if the player rolls a 6 and 1, they get a score of 0.
    if (dice[0] === 1 || dice[1] === 1) {
        return 0;

    // If the player rolls a pair of the same numbers then the players score is the total of the two dice times 2. eg: if he player rolls 5 and 5, they get a score of (5+5)*2=20.
    } else if (dice[0] === dice[1]) {
        return (dice[0] + dice[1]) * 2;

    // If the player rolls any other combination of dice other than the ones mentioned above then the players score is the total value of the two dice, eg: player rolls a 3 and 2, player gets a score of 3+2=5.
    } else {
        return dice[0] + dice[1];
    }
}


// Function - Roll Dice
function rollDice() {

    round++;

    // Checks current round and returns if final round already played
    if (round > 3) {
        displayResult();
        return;
    }

    // Calls randomDice() and stores values
    const playerDice = randomDice();
    const computerDice = randomDice();

    // Joins values to make a pair
    const playerRoll = playerDice.join(' + ');
    const computerRoll = computerDice.join(' + ');

    // Calls diceImage() to generate dice face images
    diceImage(playerDice, 'player-dice');
    diceImage(computerDice, 'computer-dice');

    // Calls calculateScore() based on dice roll and stores each score
    const playerRoundScore = calculateScore(playerDice);
    const computerRoundScore = calculateScore(computerDice);

    // Accumulates score after each round
    player.score += playerRoundScore;
    computer.score += computerRoundScore;

    // Displays scoring information
    document.getElementById('player-score').innerText = playerRoundScore;
    document.getElementById('computer-score').innerText = computerRoundScore;
    document.getElementById('player-total').innerText = player.score;
    document.getElementById('computer-total').innerText = computer.score;

    // Calls displayResult() after completion of 3rd round
    if (round === 3) {
        displayResult();
    }
}


// Function - Display Dice Face Images
// Parameters - dice, containerID
function diceImage(dice, containerId) {

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Creates img element, source dice face image and append
    dice.forEach((value) => {
        const img = document.createElement('img');
        img.classList.add('dice-image');
        img.src = `images/dice${value}.png`;
        container.appendChild(img);
    });
}


// Function - Display Results
function displayResult() {

    const popupContainer = document.getElementById('popup-container');
    const popupMessage = document.getElementById('popup-message');
    const gifImage = document.createElement('img');
    gifImage.classList.add('gif-image');
    let message = '';

    // If player wins, update message and source 'win' GIF
    if (player.score > computer.score) {
        message = `Congratulations! You won ${player.score} - ${computer.score}!`;
        gifImage.src = 'images/win.gif';

    // If player loses, update message and source 'lose' GIF
    } else if (player.score < computer.score) {
        message = `Sorry! You lost ${player.score} - ${computer.score}!`;
        gifImage.src = 'images/lose.gif';

    // If result ends in a tie, update message and source 'tie' GIF
    } else {
        message = `It's a tie? ${player.score} - ${computer.score}`;
        gifImage.src = 'images/tie.gif';
    }

    //Overlay will dim the page behind the pop-up
    const overlay = document.getElementById('overlay');

    // Add a delay before showing the overlay and pop-up
    setTimeout(() => {
        overlay.style.display = 'block';

        // Add a delay before fading in the overlay and pop-up
        setTimeout(() => {
            popupContainer.style.display = 'flex';
            overlay.classList.add('fade-in');
            popupContainer.classList.add('fade-in');
        }, 0);

    }, 1000); 

    popupMessage.innerText = message;
    popupMessage.appendChild(gifImage);

    // Removes pop-up and overlay when user clicks the screen
    overlay.addEventListener('click', closePopup);
}


// Function - Close Pop-Up
function closePopup() {

    const popupContainer = document.getElementById('popup-container');
    const overlay = document.getElementById('overlay');

    // Remove classes to hide the overlay and popup
    overlay.classList.remove('fade-in');
    popupContainer.classList.remove('fade-in');

    // Wait for the fade-out animation to complete before hiding the elements
    setTimeout(() => {
        overlay.style.display = 'none';
        popupContainer.style.display = 'none';
    }, 500);
}


// Function - Reset Game
function resetGame() {

    // Resets Gane Data
    player = new Player();
    computer = new Computer();
    round = 0;
    history = [];
    document.getElementById('player-score').innerText = '';
    document.getElementById('computer-score').innerText = '';
    document.getElementById('player-total').innerText = '';
    document.getElementById('computer-total').innerText = '';

    // Resets Dice Images
    const playerDiceContainer = document.getElementById('player-dice');
    const computerDiceContainer = document.getElementById('computer-dice');
    playerDiceContainer.innerHTML = '<img class="dice-image" src="images/dice0.png" alt="blank dice">';
    playerDiceContainer.innerHTML += '<img class="dice-image" src="images/dice0.png" alt="blank dice">';
    computerDiceContainer.innerHTML = '<img class="dice-image" src="images/dice0.png" alt="blank dice">';
    computerDiceContainer.innerHTML += '<img class="dice-image" src="images/dice0.png" alt="blank dice">';

    // Resets Pop-Up
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
    popupContainer.classList.remove('fade-in', 'fade-out');
  }