const express = require('express');
const { secret } = require('../secret');
const User = require('./model');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/api/login', async (req, res) => {
  await User.validateLogin(req.body.email, req.body.password)
    .then(user => {
      res.status(200).json({
        success: true,
        user,
        token: 'no tests?'
      });
    }).catch(e => {
      res.status(401).json({ error: e.message });
    });
});

router.post('/api/user', async (req, res) => {
  if (!req.body.first_name || !req.body.last_name || !req.body.email) {
    return res.status(409).json({ error: 'first_name, last_name, and email must exist' });
  }

  if (req.body.password !== req.body.confirm_password) {
    return res.status(409).json({ error: 'passwords do not match' });
  }

  await User.create(req.body)
    .then(user => {
      res.status(201).json({
        success: true,
        user,
        token: jwt.sign({ id: user.id }, secret)
      });
    })
    .catch(e => {
      res.status(409).json({ error: e.message });
    });
});

router.put('/api/user/:userId', async (req, res) => {
  await User.update(
    req.params.userId,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  ).then(user => {
    res.status(200).json({ success: true, user });
  }).catch(e => {
    res.status(401).json({ error: e.message });
  });
});

module.exports = router;