var deck = []
var hands = {d: [], p: []}
var score = {d: 0, p: 0}
var cardNo = 2
var suits = ['hearts', 'diams', 'clubs', 'spades']
var cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
var values = {'A': 11, 'hiA': 11, 'loA': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10}
var gameEnd = new CustomEvent('gameEnd', {
    detail: {},
    bubbles: true,
    cancelable: true
})

suits.forEach(function(suit) {
    cards.forEach(function(card) {
        deck.push({
            'card': card,
            'suit': suit
        })
    })
})

document.querySelectorAll('.card').forEach(function(card) {
    var person = card.className[0]
    cardIntoHand(card, person, hands)
})

document.querySelector('.hit').addEventListener('click', function() {
    document.querySelector('.player').innerHTML +=
        '<div class="p card card' + cardNo + '" style="position: absolute; top: 0; left: ' + 30*cardNo + 'px">\n' +
        '   <span class="value"></span><br>\n' +
        '   <span class="suit"></span>\n' +
        '   <span class="suit centreImage"></span>\n' +
        '</div>'
    newCard = document.querySelector('.card' + cardNo)
    cardIntoHand(newCard, 'p', hands)
    cardNo++
    scoreTally('p', hands, score, values)
    if (score['p'] >= 21) {
        document.querySelector('body').dispatchEvent(gameEnd)
    }
})

document.querySelector('.stand').addEventListener('click', function() {
    document.querySelector('body').dispatchEvent(gameEnd)
})

document.querySelector('body').addEventListener('gameEnd', function () {
    document.querySelector('.score').innerHTML = 'Dealer: ' + scoreTally('d', hands, score, values) +
        '<br>Player: ' + scoreTally('p', hands, score, values)
    document.querySelector('.result').textContent = result(score)
    document.querySelectorAll('button').forEach(function(button) {
        button.parentNode.removeChild(button)
    })
    document.querySelector('.d.card0').style = 'visibility: initial'
})

function addAceToggles() {
    document.querySelectorAll('.A.p').forEach(function (card) {
        card.addEventListener('click', function () {
            var cardPosition = card.className[11]
            if (card.style.background == 'rgb(0, 255, 0)') {
                card.style.background = '#ffffff'
                hands.p[cardPosition] = 'loA'
            } else {
                card.style.background = '#00ff00'
                hands.p[cardPosition] = 'hiA'
            }
            if (scoreTally('p', hands, score, values) >= 21) {
                document.querySelector('body').dispatchEvent(gameEnd)
            }
        })
    })
}

function drawACard(deck) {
    var keys = Object.keys(deck)
    var randomPick = keys.length * Math.random() << 0
    return deck.splice(randomPick, 1)[0]
}

function cardIntoHand(card, person, hands) {
    var drawnCard = drawACard(deck)
    hands[person].push(drawnCard.card)
    card.className += ' ' + drawnCard.suit + ' ' + drawnCard.card
    card.querySelector('.value').textContent = drawnCard.card
    card.querySelectorAll('.suit').forEach(function(suit) {
        suit.innerHTML = '&' + drawnCard.suit + ';'
    })
    addAceToggles()
}

function scoreTally(person, hands, score, values) {
    var countA = 0
    score[person] = 0
    hands[person].forEach(function (card) {
        score[person] += values[card]
        if (person == 'd') {
            if (card === 'A') {
                countA += 1
            }
            if (countA && score[person] > 21) {
                score[person] -= 10
                countA -= 1
            }
        } else {
            if (card === 'A' || card === 'loA') {
                score[person] -= 10
            }
        }
    })
    return score[person]
}

function result(score) {
    if (score.p > 21) {
        return 'Player bust, dealer wins!'
    } else if (score.d > score.p) {
        return 'Dealer wins!'
    } else if (score.d < score.p) {
        return 'Player wins!'
    } else {
        return 'No-one wins!'
    }
}