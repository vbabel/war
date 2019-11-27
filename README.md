# War

This is a sample project which plays the game of war in JavaScript.

### Assumptions

The game operates as described on [Wikipedia](https://en.wikipedia.org/wiki/War_(card_game)) with
the following assumptions or rules:

1. When a war occurs players involved must contribute one hidden card.
2. If a player cannot contribute a hidden card or complete a war they lose the game.
3. If all players involved in a war cannot contribute a hidden card or complete the war, the turn 
ends in a stalemate. The spoils are distributed evenly amongst the players that remain in the game, 
starting with a random player.
4. The spoils that a winner of a move receives are placed at the bottom of that player's stack, in a
random order.
5. A game can end in a stalemate when all players drop out of a war at once.
6. The number of players must be less than or equal to half of the number of cards in play.

### Setup

This project uses [npm](https://www.npmjs.com/) and targets [Node.js](https://nodejs.org/en/) version 12.13.0 or greater.

In the root directory run:
```
npm install
```

This installs the project's dependencies.

### Demo

A script is included to demonstrate the game.

To use the script via npm:
```
npm run demo [numSuits] [numRanks] [numPlayers]
```

To demo a game with a full deck and two players:
```
npm run demo 4 13 2
```

### Tests

Tests are written with [Jest](https://jestjs.io/), a JavaScript testing framework.

To run the tests:
```
npm test
```

To run the tests with a coverage report:
```
npm test -- --coverage
```

### Documentation

Documentation is generated from inline comments with [jsdoc](https://jsdoc.app/).

To generate and serve the documentation run:
```
npm run docs
```

Then visit [localhost:8080](http://localhost:8080) in your browser of choice to view the 
documentation.
