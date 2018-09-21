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

// DOM event listeners
cardsEvent.addEventListener('click', function (event) {
  var cardItemElement =  event.target.classList.contains('card') ? event.target.querySelector('p') : event.target;
  cardItemElement.classList.remove('hidden');

  if(matches.length === 0){
    matches.push({
      content: cardItemElement.innerHTML,
      id: cardItemElement.id
    });
  } else {
    var isMatch;
    matches.forEach(function(match, i) {
  
      if(match.content === cardItemElement.innerHTML){
        matches.splice(i, 1);
        // var randHEX = `${randNumb(255)}, ${randNumb(255)},${randNumb(255)},${randNumb(255)},${randNumb(255)},${randNumb(255)},`;
        cardItemElement.parentNode.style.background = 'rgba(0,0,0,.3)';
        document.getElementById(match.id).parentNode.style.background = 'rgba(0,0,0,.3)';
        isMatch = true;
      } else {
          isMatch = false;
      }
    });
    if (!isMatch){
      matches.push({
        content: cardItemElement.innerHTML,
        id: cardItemElement.id
      });
    }
  };
});

// game functions
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
        var randID = (randNumb(1000000000) + randNumb(1000000000)).toString();
        return res.concat([{
            id: randID,
            content: current
          }, {
            id: randID,
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