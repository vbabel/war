const map = require('lodash.map');
const shuffleArray = require('shuffle-array');

const Card = require('./card');

/**
 * Class representing a deck of cards
 * @property {Array<Card>} cards The cards in the deck.
 */
class Deck {
  /**
   * Creates a deck.
   * @param {number} [numSuits=Deck.MAX_SUITS] The number of suits.
   * @param {number} [numRanks=Deck.MAX_RANKS] The number of ranks.
   * @throws Deck.ERRORS.INVALID_NUM_SUITS
   * @throws Deck.ERRORS.INVALID_NUM_RANKS
   */
  constructor(numSuits = Deck.MAX_SUITS, numRanks = Deck.MAX_RANKS) {
    if (numSuits < 1 || numSuits > Deck.MAX_SUITS) {
      throw Deck.ERRORS.INVALID_NUM_SUITS;
    } else if (numRanks < 1 || numRanks > Deck.MAX_RANKS) {
      throw Deck.ERRORS.INVALID_NUM_RANKS;
    }

    const ranks = map(Card.RANKS).slice(0, numRanks);
    const suits = map(Card.SUITS).slice(0, numSuits);

    this.cards = [];

    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        this.cards.push(new Card(rank, suit));
      });
    });
  }

  /**
   * Shuffles the deck using
   * [shuffle-array]{@link https://github.com/pazguille/shuffle-array#readme}.
   * @returns {void}
   */
  shuffle() {
    shuffleArray(this.cards);
  }

  /**
   * Deals a card from the deck.
   * @returns {Card} The dealt card.
   */
  deal() {
    return this.cards.pop();
  }
}

/** The max number of suits a Deck can have. */
Deck.MAX_SUITS = Object.keys(Card.SUITS).length;
/** The max number of ranks a Deck can have. */
Deck.MAX_RANKS = Object.keys(Card.RANKS).length;

/**
 * Deck errors.
 * @readonly
 * @enum {error}
 */
Deck.ERRORS = {
  /** An invalid number of suits has been passed. */
  INVALID_NUM_SUITS: new Error(
    `Invalid number of Suits, valid range: 1-${Deck.MAX_SUITS}`
  ),
  /** An invalid number of ranks has been passed. */
  INVALID_NUM_RANKS: new Error(
    `Invalid number of Ranks, valid range: 1-${Deck.MAX_RANKS}`
  )
};

module.exports = Deck;
