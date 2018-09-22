var data;
var level = 'easy';
var currentDeck = new Array;
var matches = new Array;
var cardsEvent = document.getElementById('playingBoard');

// Start game by getting data
readTextFile("https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json", function(response){
  data = JSON.parse(response);
    // make sure the deck is build before we start updating the DOM
    currentDeck = buildCards('easy', data);
    // once deck is built update the DOM with the correct card stack
    updateDOM();
});

// DOM event listeners after all css animations finish
setTimeout(() => {
  cardsEvent.addEventListener('click', function (event) {
    var cardItemElement =  event.target.classList.contains('card') ? event.target.querySelector('p') : event.target;
    cardItemElement.classList.remove('hidden');
    cardItemElement.classList.remove('hide');

    if(matches.length === 0){
      matches.push({
        content: cardItemElement.innerHTML,
        id: cardItemElement.id
      });
    } else if (matches[0].content === cardItemElement.innerHTML){
      cardItemElement.parentNode.style.background = 'rgba(0,0,0,.3)';
      document.getElementById(matches[0].id).parentNode.style.background = 'rgba(0,0,0,.3)';
      matches.length = 0;
    } else {
      setTimeout(() => {
        cardItemElement.classList.add('hide');
        document.getElementById(matches[0].id).classList.add('hide');
        matches.length = 0;
      }, 300);
    }
  });
  startTimer();
}, 10000);


// game functions
function startTimer(){
  var minutesLabel = document.getElementById("minutes");
  var secondsLabel = document.getElementById("seconds");
  var totalSeconds = 45;
  setInterval(setTime, 1000);
  
  function setTime() {
    --totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
  
  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
};
function updateDOM(){
  var playingBoard = document.getElementById('playingBoard');
  currentDeck.forEach(card => {
    var newCard = document.createElement('div')
    newCard.className = 'card';
    newCard.innerHTML =`<p class="cardType hidden" id="${card.id}">${card.content}</p>`
    playingBoard.appendChild(newCard);
  });
}

function changeLevel(level){
  setLevel = level;
  currentDeck.length = 0;
  var cardWrapperNode = document.getElementById('playingBoard');
  while (cardWrapperNode.firstChild) {
    cardWrapperNode.removeChild(cardWrapperNode.firstChild);
  }
  updateDOM(buildCards(level, data));

}

function buildCards(setLevel, cardData){
  cardData.levels.forEach(set => {
    if(set.difficulty === setLevel){
      var localCardVar = set.cards.reduce(function (res, current, index, array) {
        return res.concat([{
            id: (randNumb(1000000000) + randNumb(1000000000)).toString(),
            content: current
          }, {
            id: (randNumb(1000000000) + randNumb(1000000000)).toString(),
            content: current
          }]);
      }, [])
      // double shuffle for EXTRA RANDOM!
      currentDeck = shuffle(shuffle(currentDeck.concat(localCardVar)));
    }
  });
  return currentDeck;
}

// helper functions
function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}

function randNumb(max){
  return Math.floor(Math.random() * Math.floor(max));
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}