const express = require('express');
const Player = require('./model');

const router = express.Router();

router.post('/api/players', async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.rating ||
    !req.body.handedness
  ) {
    return res.status(409).json({ error: 'first_name, last_name, and email must exist' });
  }

  await Player.create({ ...req.body, created_by: req.user.id })
    .then(player => {
      res.status(201).json({
        success: true,
        player
      });
    })
    .catch(e => {
      res.status(409).json({ error: e.message });
    });
});

router.delete('/api/players/:playerId', async (req, res) => {
  await Player.findById(req.params.playerId)
    .then(player => {
      if (player.created_by !== `${req.user.id}`) {
        throw new Error('player does not exist');
      }

      return Player.deleteById(player.id);
    })
    .then(player => res.status(200).json({ success: true, player }))
    .catch(e => res.status(404).json({ error: e.message }));
});

router.get('/api/players', async (req, res) => {
  await Player.findAll()
    .then(players => players.filter(e => e.created_by === `${req.user.id}`))
    .then(players => res.status(200).json({ success: true, players }))
    .catch(e => res.status(403).json({ error: e.message }));
});

module.exports = router;