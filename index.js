import { config } from 'dotenv';
config();

import express from 'express';
import { handleRequest, router } from 'express-flare';

const { checkIfPlayerForTeamIsOnFloor } = require('./util');

const app = router();

app.use(express.static('public'));

app.get('/api/isOnFloor/:playerId/:teamId', async (req, res) => {
  console.log('Receiving request for isPlaying');
  const { playerId, teamId } = req.params;

  var isOnFloor = false;

  isOnFloor = await checkIfPlayerForTeamIsOnFloor({
    playerId,
    teamId,
  });

  res.status(200).send(isOnFloor ? "Yes" : "No");
});

export default {
  async fetch(request, env, context) {
    return handleRequest({
      request,
      env,
      context,
      router: app,
    })
  }
};

