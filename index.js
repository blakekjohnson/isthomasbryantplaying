import { config } from 'dotenv';
config();

import express from 'express';
import { handleRequest, router } from 'express-flare';
import { safeMemoryCache } from 'safe-memory-cache';


let playerOnFloorCache = safeMemoryCache({
  limit: 5,
  maxTTL: 300000,
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

  const cachedValue = playerOnFloorCache.get(key);
  if (cachedValue != undefined && !ignoreCache) {
    isOnFloor = cachedValue;
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

