require('dotenv').config();

const { checkIfPlayerForTeamIsOnFloor } = require('./util');

(async () => {
  const res = await checkIfPlayerForTeamIsOnFloor(process.env.PLAYER_ID, process.env.TEAM_ID);
  console.log(res);
})();

