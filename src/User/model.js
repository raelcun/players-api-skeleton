const users = [];

let nextUserId = 1;

module.exports = {
  remove: () => users.length = 0,
  create: user => new Promise((resolve, reject) => {
    if (users.find(e => e.email === user.email) !== undefined) {
      return reject(new Error('user already exists'));
    }

    const userWithId = { id: `${nextUserId++}`, ...user };

    users.push(userWithId);
    resolve(userWithId);
  }),
  validateLogin: (email, password) => new Promise((resolve, reject) => {
    const foundUser = users.find(e => e.email === email && e.password === password);
    if (foundUser === undefined) return reject('invalid username or password');
    resolve(foundUser);
  }),
  update: (id, { first_name, last_name }) => new Promise((resolve, reject) => {
    const userIndex = users.findIndex(e => e.id === id);
    if (userIndex < 0) return reject('user does not exist');
    users[userIndex] = Object.assign({}, users[userIndex], { first_name, last_name });
    resolve(users[userIndex]);
  })
};