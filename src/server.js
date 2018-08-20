const express = require('express');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');
const { secret } = require('./secret');

const app = express();

app.use(bodyParser.json());
app.use(expressJWT({ secret: secret })
  .unless({ path: [/\/api\/login/i, /\/api\/user.*/] }));
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(403).send({message: err.message});
  }
  next();
});

app.use(require('./User/controller'));
app.use(require('./Player/controller').default);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
