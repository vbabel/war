const Card = require('./card');

describe('constructor', () => {
  test('constructs a card with the passed rank and suit', () => {
    const card = new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS);

    expect(card.rank).toBe(Card.RANKS.TWO);
    expect(card.suit).toBe(Card.SUITS.DIAMONDS);
  });

  test('throws an error when an invalid rank is passed', () => {
    expect(() => new Card(null, Card.SUITS.CLUBS)).toThrow(Card.ERRORS.INVALID_RANK);
  });

  test('throws an error when an invalid suit is passed', () => {
    expect(() => new Card(Card.RANKS.TWO, null)).toThrow(Card.ERRORS.INVALID_SUIT);
  });
});

describe('toString', () => {
  test('returns a string representation', () => {
    const card = new Card(Card.RANKS.TEN, Card.SUITS.HEARTS);

    expect(card.toString()).toBe(`${Card.RANKS.TEN.name} of ${Card.SUITS.HEARTS.name}`);
  });

  test('returns a short string when short is true', () => {
    const card = new Card(Card.RANKS.NINE, Card.SUITS.DIAMONDS);

    expect(card.toString(true)).toBe(
      `${Card.RANKS.NINE.shortName}${Card.SUITS.DIAMONDS.shortName}`
    );
  });
});

