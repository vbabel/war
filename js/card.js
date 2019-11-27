const map = require('lodash.map');

/**
 * Class representing a card.
 * @property {Card~Rank} rank The card's rank.
 * @property {Card~Suit} suit The card's suit.
 */
class Card {
  /**
   * Create a card.
   * @param {!Card~Rank} rank The rank to use.
   * @param {!Card~Suit} suit The suit to use.
   * @throws Card.ERRORS.INVALID_RANK
   * @throws Card.ERRORS.INVALID_SUIT
   */
  constructor(rank, suit) {
    if (!map(Card.RANKS).includes(rank)) {
      throw Card.ERRORS.INVALID_RANK;
    }

    if (!map(Card.SUITS).includes(suit)) {
      throw Card.ERRORS.INVALID_SUIT;
    }

    this.rank = rank;
    this.suit = suit;
  }

  /**
   * @param {bool} short Returns a shorter version when true.
   * @returns {string} A string representing the card.
   */
  toString(short) {
    return short ?
      `${this.rank.shortName}${this.suit.shortName}` :
      `${this.rank.name} of ${this.suit.name}`;
  }
}

/**
 * The rank of a card.
 * @typedef {Object} Card~Rank
 * @property {string} name The name of the rank.
 * @property {string} shortName The short name of the rank.
 * @property {number} value The value of the rank.
 */

/**
 * Available card ranks.
 * @readonly
 * @enum {Card~Rank}
 */
Card.RANKS = {
  TWO: {
    name: 'Two',
    shortName: '2',
    value: 2
  },
  THREE: {
    name: 'Three',
    shortName: '3',
    value: 3
  },
  FOUR: {
    name: 'Four',
    shortName: '4',
    value: 4
  },
  FIVE: {
    name: 'Five',
    shortName: '5',
    value: 5
  },
  SIX: {
    name: 'Six',
    shortName: '6',
    value: 6
  },
  SEVEN: {
    name: 'Seven',
    shortName: '7',
    value: 7
  },
  EIGHT: {
    name: 'Eight',
    shortName: '8',
    value: 8
  },
  NINE: {
    name: 'Nine',
    shortName: '9',
    value: 9
  },
  TEN: {
    name: 'Ten',
    shortName: '10',
    value: 10
  },
  JACK: {
    name: 'Jack',
    shortName: 'J',
    value: 11
  },
  QUEEN: {
    name: 'Queen',
    shortName: 'Q',
    value: 12
  },
  KING: {
    name: 'King',
    shortName: 'K',
    value: 13
  },
  ACE: {
    name: 'Ace',
    shortName: 'A',
    value: 14
  }
};

/**
 * The suit of a card.
 * @typedef {Object} Card~Suit
 * @property {string} name The name of the suit.
 * @property {string} shortName The short name of the suit.
 */

/**
 * Available card suits.
 * @readonly
 * @enum {Card~Suit}
 */
Card.SUITS = {
  /** ♧ */
  CLUBS: {
    name: 'Clubs',
    shortName: '♧'
  },
  /** ♢ */
  DIAMONDS: {
    name: 'Diamonds',
    shortName: '♢'
  },
  /** ♡ */
  HEARTS: {
    name: 'Hearts',
    shortName: '♡'
  },
  /** ♤ */
  SPADES: {
    name: 'Spades',
    shortName: '♤'
  }
};

/**
 * Card errors.
 * @readonly
 * @enum {error}
 */
Card.ERRORS = {
  /** An invalid rank has been passed */
  INVALID_RANK: new Error('Invalid Rank'),
  /** An invalid suit has been passed */
  INVALID_SUIT: new Error('Invalid Suit')
};

module.exports = Card;
