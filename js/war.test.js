const War = require('./war');
const Card = require('./card');

describe('constructor', () => {
  test('initializes a game between 2 players with 52 cards by default', () => {
    const war = new War();

    expect.assertions(3);
    expect(war.players.length).toBe(2);
    war.players.forEach((player) => {
      expect(player.cards.length).toBe(26);
    });
  });

  test('initializes a game with the number of suits, ranks, and players passed', () => {
    const war = new War(2, 12, 3);

    expect.assertions(4);
    expect(war.players.length).toBe(3);
    war.players.forEach((player) => {
      expect(player.cards.length).toBe(8);
    });
  });

  test('gives each player names and shortNames', () => {
    const war = new War(1, 12, 3);

    expect.assertions(6);
    war.players.forEach((player, index) => {
      expect(player.name).toBe(`Player ${index + 1}`);
      expect(player.shortName).toBe(`P${index + 1}`);
    });
  });

  test('throws an error when less than two players are specified', () => {
    expect(() => new War(2, 12, 1)).toThrow(War.ERRORS.NUM_PLAYERS_MIN);
  });

  test('throws an error when numPlayers is more than 1/2 the number of cards', () => {
    expect(() => new War(2, 2, 3)).toThrow(War.ERRORS.NUM_PLAYERS_MAX);
  });
});

describe('getPlayersWithCards', () => {
  test('returns the players who have cards', () => {
    const war = new War();
    war.players[0].cards = [];

    expect(war.getPlayersWithCards()).toEqual([war.players[1]]);
  });

  test('returns the passed players who have cards', () => {
    const war = new War(4, 13, 4);
    war.players[0].cards = [];
    war.players[3].cards = [];

    expect(war.getPlayersWithCards([war.players[1], war.players[3]])).toEqual([war.players[1]]);
  });

  test('returns an empty array when no players have cards', () => {
    const war = new War();
    war.players.forEach((player) => player.cards = []);

    expect(war.getPlayersWithCards()).toEqual([]);
  });
});

describe('getWinner', () => {
  test('returns false when there are more than one players with cards', () => {
    const war = new War();

    expect(war.getWinner()).toBe(false);
  });

  test('returns the only player with cards', () => {
    const war = new War();
    war.players[1].cards = [];

    expect(war.getWinner()).toBe(war.players[0]);
  });
});

describe('isStalemate', () => {
  test('returns true when there are no players with cards', () => {
    const war = new War();
    war.players.forEach((player) => player.cards = []);

    expect(war.isStalemate(war.players)).toBe(true);
  });

  test('returns false when some player has cards', () => {
    const war = new War();

    expect(war.isStalemate()).toBe(false);
  });
});

describe('distributeSpoils', () => {
  test('distributes passed cards evenly to players who have cards', () => {
    const war = new War(2, 3, 3);
    const spoils = [war.players[2].cards.pop(), war.players[2].cards.pop()];

    war.distributeSpoils(spoils.slice(0));

    expect.assertions(4);
    war.getPlayersWithCards().forEach((player) => {
      expect(player.cards.length).toBe(3);
      expect(spoils).toContain(player.cards.shift());
    });
  });
});

describe('playNextMove', () => {
  test('handles an ordinary move', () => {
    const war = new War(2, 3, 2);

    const cardOne = new Card(Card.RANKS.TWO, Card.SUITS.CLUBS);
    const cardTwo = new Card(Card.RANKS.THREE, Card.SUITS.CLUBS);

    war.players[0].cards = [cardOne];
    war.players[1].cards = [cardTwo];

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: cardOne
      }, {
        card: cardTwo
      }],
      warMoves: [],
      winner: war.players[1]
    });
    expect(war.players[1].cards).toContain(cardOne);
    expect(war.players[1].cards).toContain(cardTwo);
  });

  test('handles a single war move', () => {
    const war = new War(2, 3, 2);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.TWO, Card.SUITS.HEARTS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.SPADES),
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[2],
        hiddenCard: playerOneCards[1]
      }, {
        card: playerTwoCards[2],
        hiddenCard: playerTwoCards[1]
      }],
      warMoves: [{
        plays: [{
          card: playerOneCards[0]
        }, {
          card: playerTwoCards[0]
        }]
      }],
      winner: war.players[1]
    });
    expect(war.players[1].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards))
    );
  });

  test('handles a war move where one player cannot add a hidden card', () => {
    const war = new War(2, 3, 2);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.TWO, Card.SUITS.HEARTS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[2],
        hiddenCard: playerOneCards[1]
      }, {
        card: playerTwoCards[0]
      }],
      warMoves: [{
        plays: [{
          card: playerOneCards[0]
        },
        null]
      }],
      winner: war.players[0]
    });
    expect(war.players[0].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards))
    );
  });

  test('handles a war move where one player runs out of cards', () => {
    const war = new War(2, 3, 2);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.TWO, Card.SUITS.HEARTS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[2],
        hiddenCard: playerOneCards[1]
      }, {
        card: playerTwoCards[1],
        hiddenCard: playerTwoCards[0]
      }],
      warMoves: [{
        plays: [{
          card: playerOneCards[0]
        },
        null]
      }],
      winner: war.players[0]
    });
    expect(war.players[0].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards))
    );
  });

  test('handles a multi-war move', () => {
    const war = new War(2, 3, 3);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.TWO, Card.SUITS.HEARTS),
      new Card(Card.RANKS.THREE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.FOUR, Card.SUITS.HEARTS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.SPADES),
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES),
      new Card(Card.RANKS.THREE, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.FOUR, Card.SUITS.SPADES)
    ];
    const playerThreeCards = [
      new Card(Card.RANKS.THREE, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);
    war.players[2].cards = playerThreeCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[4],
        hiddenCard: playerOneCards[3]
      }, {
        card: playerTwoCards[4],
        hiddenCard: playerTwoCards[3]
      }, {
        card: playerThreeCards[0]
      }],
      warMoves: [{
        plays: [{
          card: playerOneCards[2],
          hiddenCard: playerOneCards[1]
        }, {
          card: playerTwoCards[2],
          hiddenCard: playerTwoCards[1]
        },
        null]
      }, {
        plays: [{
          card: playerOneCards[0]
        }, {
          card: playerTwoCards[0]
        },
        null]
      }],
      winner: war.players[1]
    });
    expect(war.players[1].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards).concat(playerThreeCards))
    );
  });

  test('distributes the spoils to other players when a war results in a stalemate', () => {
    const war = new War(2, 3, 3);

    const playerOneCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.CLUBS),
      new Card(Card.RANKS.ACE, Card.SUITS.DIAMONDS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.SPADES),
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS)
    ];
    const playerThreeCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES),
      new Card(Card.RANKS.THREE, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);
    war.players[2].cards = playerThreeCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[1],
        hiddenCard: playerOneCards[0]
      }, {
        card: playerTwoCards[1],
        hiddenCard: playerTwoCards[0]
      }, {
        card: playerThreeCards[1]
      }],
      warMoves: [{
        plays: [null, null, null]
      }],
      winner: false
    });

    expect(war.players[2].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards).concat(playerThreeCards))
    );
  });

  test('distributes the spoils to players when warring players cannot provide hiddenCards', () => {
    const war = new War(2, 3, 3);

    const playerOneCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.DIAMONDS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS)
    ];
    const playerThreeCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES),
      new Card(Card.RANKS.THREE, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);
    war.players[2].cards = playerThreeCards.slice(0);

    expect(war.playNextMove()).toEqual({
      plays: [{
        card: playerOneCards[0]
      }, {
        card: playerTwoCards[0]
      }, {
        card: playerThreeCards[1]
      }],
      warMoves: [],
      winner: false
    });

    expect(war.players[2].cards).toEqual(
      expect.arrayContaining(playerOneCards.concat(playerTwoCards).concat(playerThreeCards))
    );
  });
});

describe('play', () => {
  test('correctly reports a stalemate', () => {
    const war = new War(2, 3, 2);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);

    expect(war.play()).toEqual({
      moves: [{
        plays: [{
          card: playerOneCards[1],
          hiddenCard: playerOneCards[0]
        }, {
          card: playerTwoCards[1],
          hiddenCard: playerTwoCards[0]
        }],
        warMoves: [{
          plays: [null, null]
        }],
        winner: false
      }],
      winner: false
    });
  });

  test('correctly reports the winner and moves', () => {
    const war = new War(2, 3, 2);

    const playerOneCards = [
      new Card(Card.RANKS.TWO, Card.SUITS.CLUBS),
      new Card(Card.RANKS.TWO, Card.SUITS.DIAMONDS),
      new Card(Card.RANKS.TWO, Card.SUITS.HEARTS),
      new Card(Card.RANKS.THREE, Card.SUITS.HEARTS)
    ];
    const playerTwoCards = [
      new Card(Card.RANKS.ACE, Card.SUITS.SPADES),
      new Card(Card.RANKS.ACE, Card.SUITS.HEARTS),
      new Card(Card.RANKS.TWO, Card.SUITS.SPADES),
      new Card(Card.RANKS.FOUR, Card.SUITS.HEARTS)
    ];

    war.players[0].cards = playerOneCards.slice(0);
    war.players[1].cards = playerTwoCards.slice(0);

    expect(war.play()).toEqual({
      moves: [{
        plays: [{
          card: playerOneCards[3]
        }, {
          card: playerTwoCards[3]
        }],
        warMoves: [],
        winner: war.players[1]
      }, {
        plays: [{
          card: playerOneCards[2],
          hiddenCard: playerOneCards[1]
        }, {
          card: playerTwoCards[2],
          hiddenCard: playerTwoCards[1]
        }],
        warMoves: [{
          plays: [{
            card: playerOneCards[0]
          }, {
            card: playerTwoCards[0]
          }]
        }],
        winner: war.players[1]
      }],
      winner: war.players[1]
    });
  });
});

