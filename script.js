
// script.js
let playerScore = 0;
let botScore = 0;
let maxScore = 5;

const winVoices = [
  "sounds/bot-win-1.mp3",
  "sounds/bot-win-2.mp3",
  "sounds/bot-win-3.mp3",
  "sounds/bot-win-4.mp3",
  "sounds/bot-win-5.mp3"
];

const loseVoices = [
  "sounds/bot-lose-1.mp3",
  "sounds/bot-lose-2.mp3",
  "sounds/bot-lose-3.mp3",
  "sounds/bot-lose-4.mp3",
  "sounds/bot-lose-5.mp3"
];

const tieVoice = "sounds/bot-tie.mp3";

let lastVoice = null;
let voiceEnabled = true;

function playRandomVoice(path) {
  if (!voiceEnabled) return;
  const audio = new Audio(path);
  audio.volume = 1;
  audio.play();
}

function getMatchingVoice(quote, voiceList, quoteList) {
  const index = quoteList.indexOf(quote);
  if (index === -1) return voiceList[Math.floor(Math.random() * voiceList.length)];
  return voiceList[index % voiceList.length];
}

const botQuotes = {
  win: [
    "Bots always win.",
    "I knew you'd pick that!",
    "Too easy!",
    "Predictable human!",
    "That was fun! For me."
  ],
  lose: [
    "That won’t happen again.",
    "This isn't over.",
    "Huh?! That was luck!",
    "Beginner's luck.",
    "Next round’s mine!"
  ]
};

function play(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const botChoice = choices[Math.floor(Math.random() * 3)];

  const handIcons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  document.getElementById('player-hand').innerText = handIcons[playerChoice];
  document.getElementById('bot-hand').innerText = handIcons[botChoice];

  const resultText = getResult(playerChoice, botChoice);
  document.getElementById('result').innerText = resultText;

  if (lastVoice) playRandomVoice(lastVoice);

  document.getElementById('player-score').innerText = playerScore;
  document.getElementById('bot-score').innerText = botScore;
  updateBotExpression(resultText);
  updateProgressBar();

  if (playerScore >= maxScore || botScore >= maxScore) {
    showPopup();
  }
}

function getResult(player, bot) {
  if (player === bot) {
    lastVoice = tieVoice;
    return "It's a tie!";
  }

  if (
    (player === 'rock' && bot === 'scissors') ||
    (player === 'paper' && bot === 'rock') ||
    (player === 'scissors' && bot === 'paper')
  ) {
    playerScore++;
    const quote = getRandom(botQuotes.lose);
    lastVoice = getMatchingVoice(quote, loseVoices, botQuotes.lose);
    return "You win this round! " + quote;
  } else {
    botScore++;
    const quote = getRandom(botQuotes.win);
    lastVoice = getMatchingVoice(quote, winVoices, botQuotes.win);
    return "Bot wins this round! " + quote;
  }
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showPopup() {
  const popup = document.getElementById('popup');
  const result = document.getElementById('popup-result');
  const message = document.getElementById('popup-message');
  const avatar = document.getElementById('bot-avatar');

  if (playerScore > botScore) {
    result.innerText = "🎉 You Win!";
    message.innerText = "Well played! Wanna try again?";
    if (avatar) avatar.src = "images/bot-sad.png";
  } else {
    result.innerText = "💀 Bot Wins!";
    message.innerText = getRandom(botQuotes.win);
    if (avatar) avatar.src = "images/bot-happy.png";
  }

  popup.classList.remove('hidden');
}

function restartGame() {
  playerScore = 0;
  botScore = 0;
  document.getElementById('player-hand').innerText = '❔';
  document.getElementById('bot-hand').innerText = '❔';
  document.getElementById('player-score').innerText = '0';
  document.getElementById('bot-score').innerText = '0';
  document.getElementById('result').innerText = 'Make your move!';
  const avatar = document.getElementById('bot-avatar');
  if (avatar) avatar.src = "images/bot-neutral.png";
  document.getElementById('popup').classList.add('hidden');
  updateProgressBar();
}

function updateBotExpression(resultText) {
  const avatar = document.getElementById('bot-avatar');
  if (!avatar) return;

  if (resultText.includes("Bot wins")) {
    avatar.src = "images/bot-happy.png";
  } else if (resultText.includes("You win")) {
    avatar.src = "images/bot-sad.png";
  } else if (resultText.includes("tie")) {
    avatar.src = "images/bot-neutral.png";
  }
}

function updateProgressBar() {
  const playerBar = document.getElementById('player-bar');
  const botBar = document.getElementById('bot-bar');
  if (playerBar) playerBar.style.width = `${(playerScore / maxScore) * 100}%`;
  if (botBar) botBar.style.width = `${(botScore / maxScore) * 100}%`;
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const btn = document.getElementById('voice-toggle');
  btn.innerText = voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off";
}

function updateMatchLength(val) {
  maxScore = parseInt(val);
  restartGame();
}

window.speechSynthesis.onvoiceschanged = () => {
  console.log(speechSynthesis.getVoices());
};
