var deck = []
var hands = {d: [], p: []}
var score = {d: 0, p: 0}
var cardNo = 0
var suits = ['hearts', 'diams', 'clubs', 'spades']
var cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
var values = {'A': 11, 'hiA': 11, 'loA': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10}
var gameEnd = new CustomEvent('gameEnd', {
    detail: {},
    bubbles: true,
    cancelable: true
})

createDeck(cards, suits)

deal()

document.querySelector('.hit').addEventListener('click', function() {
    if (deck.length === 0) {
        document.querySelector('.cardsRemaining').textContent = 'Not enough cards left in deck, please stand'
        return 0
    }
    dealOne('p', cardNo)
    cardNo++
})

document.querySelector('.stand').addEventListener('click', function() {
    document.querySelector('body').dispatchEvent(gameEnd)
})

document.querySelectorAll('.deal').forEach(function(button) {
    button.addEventListener('click', function() {
        if (button.id === 'new') {
            deck = []
            createDeck(cards, suits)
        } else if (deck.length < 4) {
            document.querySelector('.cardsRemaining').textContent = 'Not enough cards left in deck, please deal from new deck'
            return 0
        }
        document.querySelectorAll('.card').forEach(function(card) {
            card.parentNode.removeChild(card)
        })
        document.querySelector('.score').innerHTML = ''
        document.querySelector('.result').textContent = ''
        hands = {d: [], p: []}
        cardNo = 0
        document.querySelector('.gameButtons').style.display = 'block'
        document.querySelector('.endButtons').style.display = 'none'
        deal()
    })
})


document.querySelector('body').addEventListener('gameEnd', function () {
    document.querySelector('.score').innerHTML = 'Dealer: ' + scoreTally('d', hands, score, values) +
        '<br>Player: ' + scoreTally('p', hands, score, values)
    document.querySelector('.result').textContent = result(score)
    document.querySelector('.gameButtons').style.display = 'none'
    document.querySelector('.endButtons').style.display = 'initial'
    document.querySelector('.d[data-cardno="0"]').style.display = 'initial'
})

function createDeck(cards, suits) {
    suits.forEach(function(suit) {
        cards.forEach(function(card) {
            deck.push({
                'card': card,
                'suit': suit
            })
        })
    })
}

function deal() {
    dealOne('d', 0)
    dealOne('d', 1)
    dealOne('p', cardNo)
    cardNo++
    dealOne('p', cardNo)
    cardNo++
}

function dealOne(person, cardNo) {
    var newCard
    document.querySelector('.' + person + 'Hand').innerHTML +=
        '<div class="' + person + ' card" data-cardno="' + cardNo + '" style="left: ' + 30 * cardNo + 'px">\n' +
        '   <span class="value"></span>\n' +
        '   <span class="suit"></span>\n' +
        '   <span class="suit centreImage"></span>\n' +
        '</div>'
    newCard = document.querySelector('.' + person + '[data-cardno="' + cardNo + '"]')
    cardIntoHand(newCard, person, hands)
    scoreTally(person, hands, score, values)
    if (score[person] >= 21) {
        document.querySelector('body').dispatchEvent(gameEnd)
    }
    addAceToggles()
}

function addAceToggles() {
    document.querySelectorAll('.A.p').forEach(function (card) {
        card.addEventListener('click', function () {
            if (document.querySelector('.gameButtons').style.display !== 'none') {
                var cardPosition = card.dataset.cardno
                console.log(card.dataset)
                if (card.style.background === 'rgb(0, 255, 0)') {
                    card.style.background = '#ffffff'
                    hands.p[cardPosition] = 'loA'
                } else {
                    card.style.background = '#00ff00'
                    hands.p[cardPosition] = 'hiA'
                }
                if (scoreTally('p', hands, score, values) >= 21) {
                    document.querySelector('body').dispatchEvent(gameEnd)
                }
            }
        })
    })
}

function drawACard() {
    var keys = Object.keys(deck)
    var randomPick = keys.length * Math.random() << 0
    return deck.splice(randomPick, 1)[0]
}

function cardIntoHand(card, person, hands) {
    var drawnCard = drawACard(deck)
    document.querySelector('.cardsRemaining').textContent = 'Cards left in deck: ' + deck.length
    hands[person].push(drawnCard.card)
    card.className += ' ' + drawnCard.suit + ' ' + drawnCard.card
    card.querySelector('.value').textContent = drawnCard.card
    card.querySelectorAll('.suit').forEach(function(suit) {
        suit.innerHTML = '&' + drawnCard.suit + ';'
    })
}

function scoreTally(person, hands, score, values) {
    var countA = 0
    score[person] = 0
    hands[person].forEach(function (card) {
        score[person] += values[card]
        if (person === 'd') {
            if (card === 'A') {
                countA += 1
            }
            if (countA && score[person] > 21) {
                score[person] -= 10
                countA -= 1
            }
        } else {
            if (card === 'A') {
                score[person] -= 10
            }
            document.querySelector('.currentScore').textContent = 'Current player score: ' + score[person]
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