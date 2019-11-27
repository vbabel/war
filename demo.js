#!/usr/bin/env node

require('colors');

const War = require('./js/war');
const Card = require('./js/card');

const args = process.argv.slice(2);

if (args.length < 3) {
  process.stderr.write(
    'Please supply the number of suits, ranks and players, ie "npm run demo 4 13 2"\n'.red
  );
  process.exit(1);
}

args.forEach((arg) => {
  if (isNaN(arg)) {
    process.stderr.write('Suits, ranks and players must be numbers\n'.red);
    process.exit(1);
  }
});

let war;
try {
  war = new War(...args);
} catch (error) {
  process.stderr.write(`${error.message.red}\n`);
  process.exit(1);
}

const playerNames = war.players.map((player) => {
  return player.shortName.length === 2 ?
    `${player.shortName} ` :
    player.shortName;
});
let data = `MOVE     ${playerNames.join('  ')}    WINNER\n`.green;

const result = war.play();

const getCardsForMove = (move, property = 'card') => {
  return move.plays.map((play) => {
    const card = play && play[property];
    if (card) {
      const cardString = card.rank === Card.RANKS.TEN ?
        card.toString(true) :
        `${card.toString(true)} `;
      return property === 'card' ?
        cardString :
        cardString.grey;
    }

    return '---';
  }).join('  ');
};


result.moves.forEach((move, index) => {
  let moveData = `${index + 1}${(new Array(10 - (index + 1).toString().length)).join(' ')}`;

  moveData += getCardsForMove(move);

  if (move.warMoves.length) {
    moveData += `\n         ${getCardsForMove(move, 'hiddenCard')}`;

    while(move.warMoves.length) {
      const warMove = move.warMoves.shift();
      moveData += `\n         ${getCardsForMove(warMove)}`;

      if(move.warMoves.length) {
        moveData += `\n         ${getCardsForMove(warMove, 'hiddenCard')}`;
      }
    }
  }

  const winner = move.winner ?
    move.winner.shortName :
    'STALEMATE';

  moveData += `    ${winner}\n`;
  data += moveData;
});

data += result.winner ?
  `\n${result.winner.name} won the game!\n`.green :
  '\nThe game resulted in a stalemate!\n'.red;

process.stdout.write(data);

