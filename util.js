const BASE_NBA_LIVEDATA_URL = 'https://cdn.nba.com/static/json/liveData';

// Get today's scoreboard
async function fetchTodaysScoreboard() {
  const res = await fetch(
    `${BASE_NBA_LIVEDATA_URL}/scoreboard/todaysScoreboard_00.json`);

  const data = await res.json();
  return data.scoreboard;
}

// Get the game id for the game a team is playing today
function getTodaysGameId(todaysScoreboard, teamId) {
  const validGames = todaysScoreboard.games
    .filter(game => {
      return game.homeTeam.teamId == teamId || game.awayTeam.teamId == teamId;
    })
    .filter(game => game.gameStatus > 1)
    .map(game => game.gameId);

  if (validGames.length < 1) {
    return -1;
  }

  return validGames[0];
}

// Fetch the boxscore for the current game
async function fetchBoxScore(gameId) {
  const res = await fetch(
    `${BASE_NBA_LIVEDATA_URL}/boxscore/boxscore_${gameId}.json`);

  const data = await res.json();
  return data.game;
}

// Check if the player is on the floor
function verifyPlayerOnFloor(boxScore, playerId) {
  const allPlayers = [
    ...boxScore.homeTeam.players,
    ...boxScore.awayTeam.players
  ];
  const matchingOnCourtPlayers = allPlayers
    .filter(player => player.personId == playerId)
    .filter(player => player.oncourt == "1");

  return matchingOnCourtPlayers.length > 0;
}

async function checkIfPlayerForTeamIsOnFloor(options) {
  const { playerId, teamId } = options;

  const todaysScoreboard = await fetchTodaysScoreboard();
  const todaysGameId = getTodaysGameId(todaysScoreboard, teamId);

  if (todaysGameId == -1) {
    return false;
  }

  const currentBoxScore = await fetchBoxScore(todaysGameId);
  const playerOnFloor = verifyPlayerOnFloor(currentBoxScore, playerId);

  return playerOnFloor;
}

export { checkIfPlayerForTeamIsOnFloor };

