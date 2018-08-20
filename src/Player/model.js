const players = [];

let nextPlayerId = 1;

module.exports = {
  remove: () => players.length = 0,
  create: player => new Promise((resolve, reject) => {
    if (players.find(e => e.first_name === player.first_name && e.last_name === player.last_name) !== undefined) {
      return reject(new Error('player already exists'));
    }

    const enhancedPlayer = { id: `${nextPlayerId++}`, ...player };

    players.push(enhancedPlayer);
    resolve(enhancedPlayer);
  }),
  deleteById: id => new Promise((resolve, reject) => {
    const existingPlayerIndex = players.findIndex(e => e.id === `${id}`);
    const existingPlayer = players[existingPlayerIndex];

    if (existingPlayer === undefined) {
      return reject(new Error('player does not exist'));
    }

    players.splice(existingPlayerIndex, 1);

    resolve(existingPlayer);
  }),
  findById: id => {
    return Promise.resolve(players.find(e => e.id === id));
  },
  findAll: () => Promise.resolve(players.map(e => ({ ...e })))
};