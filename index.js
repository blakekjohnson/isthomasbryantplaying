const express = require('express');
require('dotenv').config();

const { checkIfPlayerForTeamIsOnFloor } = require('./util');

const app = express();

app.use(express.static('public'));

app.get('/api/isPlaying/:playerId/:teamId', async (req, res) => {
  console.log('Receiving request for isPlaying');
  const isPlaying = await checkIfPlayerForTeamIsOnFloor(
    req.params.playerId,
    req.params.teamId);

  res.status(200).send(isPlaying ? "Yes" : "No");
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening for requests on port ${process.env.PORT}`);
});

