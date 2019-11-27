const shuffleArray = require('shuffle-array');

const Deck = require('./deck');

/**
 * Class representing a game of War.
 * @property {Array<War~Player>} players The players in the game.
 * @property {Array<War~Move>} moves The moves in the game.
 */
class War {
  /**
   * Create a game of War.
   * @param {number} [numSuits=Deck.MAX_SUITS] The number of suits in the deck used.
   * @param {number} [numRanks=Deck.MAX_RANKS] The number of ranks in the deck used.
   * @param {number} [numPlayers=2] The number of players in the game.
   * @throws War.ERRORS.NUM_PLAYERS_MIN when less than 2 players are specified.
   * @throws War.ERRORS.NUM_PLAYERS_MIN when the number of players specified is more than 1/2 of
   * the number of cards in the deck.
   */
  constructor(numSuits = Deck.MAX_SUITS, numRanks = Deck.MAX_RANKS, numPlayers = 2) {
    if (numPlayers < 2) {
      throw War.ERRORS.NUM_PLAYERS_MIN;
    } else if (numPlayers > numSuits * numRanks / 2) {
      throw War.ERRORS.NUM_PLAYERS_MAX;
    }

    const deck = new Deck(numSuits, numRanks);
    deck.shuffle();

    this.players = [];

    for (let i = 0; i < numPlayers; i++) {
      this.players.push({
        name: `Player ${i + 1}`,
        shortName: `P${i + 1}`,
        cards: []
      });
    }

    let playerIndex = Math.floor(Math.random() * 100);
    let card;
    while(card = deck.deal()) {
      const player = this.players[playerIndex % numPlayers];
      player.cards.push(card);
      playerIndex++;
    }

    this.moves = [];
  }

  getPlayersWithCards(players = this.players) {
    let playersWithCards = [];

    players.forEach((player) => {
      if (player.cards.length) {
        playersWithCards.push(player);
      }
    });

    return playersWithCards;
  }

  getWinner() {
    const playersWithCards = this.getPlayersWithCards();
    return playersWithCards.length === 1 && playersWithCards[0];
  }

  isStalemate(players) {
    return this.getPlayersWithCards(players).length === 0;
  }

  distributeSpoils(spoils) {
    const players = this.getPlayersWithCards();

    if (players.length) {
      const numPlayers = players.length;

      let card;
      let playerIndex = Math.floor(Math.random() * 100);

      while (card = spoils.pop()) {
        const player = players[playerIndex % numPlayers];
        player.cards.unshift(card);
        playerIndex++;
      }
    }
  }

  playNextMove(players = this.players, spoils = [], move) {
    let currentMove = {
      plays: new Array(this.players.length)
    };

    if (move) {
      move.warMoves.push(currentMove);
    } else {
      currentMove.warMoves = [];
    }

    let bestCardValue = 0;
    let bestPlayers = [];
    this.players.forEach((player) => {
      if (player.cards.length === 0 || players.indexOf(player) < 0) {
        currentMove.plays[this.players.indexOf(player)] = null;
        return;
      }

      const card = player.cards.pop();
      currentMove.plays[this.players.indexOf(player)] = {
        card
      };
      spoils.push(card);

      if (card.rank.value > bestCardValue) {
        bestPlayers = [player];
        bestCardValue = card.rank.value;
      } else if (card.rank.value === bestCardValue) {
        bestPlayers.push(player);
      }
    });

    if (bestPlayers.length === 1) {
      const result = move || currentMove;
      result.winner = bestPlayers[0];

      bestPlayers[0].cards = shuffleArray(spoils).concat(bestPlayers[0].cards);

      return result;
    }

    if (this.isStalemate(bestPlayers)) {
      this.distributeSpoils(spoils);

      const result = move || currentMove;
      result.winner = false;
      return result;
    }

    bestPlayers.forEach((player) => {
      if (player.cards.length === 0) {
        return;
      }

      const hiddenCard = player.cards.pop();
      currentMove.plays[this.players.indexOf(player)].hiddenCard = hiddenCard;
      spoils.push(hiddenCard);
    });

    return this.playNextMove(bestPlayers, spoils, move || currentMove, true);
  }

  /**
   * Play the game.
   * @returns {War~Result} The result of the game.
   */
  play() {
    while(!this.getWinner()) {
      if (this.isStalemate()) {
        return {
          moves: this.moves,
          winner: false
        };
      }

      this.moves.push(this.playNextMove());
    }

    return {
      moves: this.moves,
      winner: this.getWinner()
    };
  }
}

/**
 * A representation of a war player
 * @typedef {Object} War~Player
 * @property {string} name The name of the player.
 * @property {string} shortName The short name of the player.
 * @property {Array<Card>} cards The player's cards.
 */

/**
 * A representation of a move in a game of war.
 * @typedef {Object} War~Move
 * @property {Array<War~Play>} plays The plays of each player in this move.
 * @property {?Array<War~Move>} warMoves Additional moves that occur because of one or more wars.
 * These moves will not define their own `warMoves`.
 * @property {War~Player} winner The winner of this move, when false the move was a stalemate.
 */

/**
 * A representation of a single players play in a move.
 * @typedef {Object} War~Play
 * @property {Card} card The card played.
 * @property {Card} hiddenCard The card added to the spoils when a war occurs.
 */

/**
 * A representation of the result of a game of war.
 * @typedef {Object} War~Result
 * @property {Array<War~Move>} moves The moves that occured in the game.
 * @property {War~Player} winner The winner of the game.
 */

/**
 * War errors.
 * @readonly
 * @enum {error}
 */
War.ERRORS = {
  /** Less than two players has been specified */
  NUM_PLAYERS_MIN: new Error('Too few players, 2 or more players are required'),
  /** Too many players has been specified */
  NUM_PLAYERS_MAX: new Error(
    'Too many players, number of players must be less than or equal to half the number of cards.'
  )
};

module.exports = War;
