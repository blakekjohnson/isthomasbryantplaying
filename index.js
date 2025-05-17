import { config } from 'dotenv';
config();

import express from 'express';
import { handleRequest, router } from 'express-flare';
import TTLCache from '@isaacs/ttlcache';


let playerOnFloorCache = new TTLCache({
  max: 5,
  ttl: 300000,
});

const { checkIfPlayerForTeamIsOnFloor } = require('./util');

const app = router();

app.use(express.static('public'));

app.get('/api/isOnFloor/:playerId/:teamId', async (req, res) => {
  console.log('Receiving request for isPlaying');
  const { playerId, teamId } = req.params;
  const { ignoreCache = false } = req.query;
  const key = `${playerId}~${teamId}`;

  var isOnFloor = false;

  if (playerOnFloorCache.has(key) && !ignoreCache) {
    isOnFloor = playerOnFloorCache.get(key);
  } else {
    isOnFloor = await checkIfPlayerForTeamIsOnFloor({
      playerId,
      teamId,
    });
    playerOnFloorCache.set(key, isOnFloor);

    console.log(`${key} has been updated in cache`);
  }

  res.status(200).send(isOnFloor ? "Yes" : "No");
});

export default {
  async fetch(request, env, context) {
    handleRequest({
      request,
      env,
      context,
      router: app,
    })
  }
};

