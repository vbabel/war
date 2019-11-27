const Deck = require('./deck');

describe('constructor', () => {
  test('builds a deck with the max number of suits and ranks by default', () => {
    const deck = new Deck();

    expect(deck.cards).toMatchSnapshot();
  });

  test('builds a deck with the supplied number of suits and ranks', () => {
    const deck = new Deck(2, 6);

    expect(deck.cards.length).toBe(12);
    expect(deck.cards).toMatchSnapshot();
  });

  test('throws an error when 0 suits are passed', () => {
    expect(() => new Deck(0)).toThrow(Deck.ERRORS.INVALID_NUM_SUITS);
  });

  test('throws an error when more than the max number of suits are passed', () => {
    expect(() => new Deck(Deck.MAX_SUITS + 1)).toThrow(Deck.ERRORS.INVALID_NUM_SUITS);
  });

  test('throws an error when 0 ranks are passed', () => {
    expect(() => new Deck(1, 0)).toThrow(Deck.ERRORS.INVALID_NUM_RANKS);
  });

  test('throws an error when more than the max number of ranks are passed', () => {
    expect(() => new Deck(1, Deck.MAX_RANKS + 1)).toThrow(Deck.ERRORS.INVALID_NUM_RANKS);
  });
});

describe('shuffle', () => {
  //This test has a very slight probability of failing
  test('shuffles the deck', () => {
    const deck = new Deck();
    const oldCards = deck.cards.slice(0);

    deck.shuffle();
    expect(deck.cards).not.toEqual(oldCards);
  });
});

describe('deal', () => {
  test('pops and returns the top card of the deck', () => {
    const deck = new Deck();
    deck.shuffle();

    const topCard = deck.cards[deck.cards.length - 1];

    expect(deck.deal()).toEqual(topCard);
  });

  test('returns undefined when the deck is empty', () => {
    const deck = new Deck(1, 1);
    deck.deal();

    expect(deck.deal()).toBeUndefined();
  });
});
