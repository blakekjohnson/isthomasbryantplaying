require('dotenv').config();

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

// Check if the player is listed as active
function verifyPlayerIsPlaying(boxScore, playerId) {
  const allPlayers = [
    ...boxScore.homeTeam.players,
    ...boxScore.awayTeam.players
  ];
  const matchingOnCourtPlayers = allPlayers
    .filter(player => player.personId == playerId)
    .filter(player => player.oncourt == "1");

  return matchingOnCourtPlayers.length > 0;
}

const teamId = process.env.TEAM_ID;
const playerId = process.env.PLAYER_ID;

(async () => {
  const todaysScoreboard = await fetchTodaysScoreboard();
  const todaysGameId = getTodaysGameId(todaysScoreboard, teamId);

  if (todaysGameId == -1) {
    console.log(`Team with id ${teamId} is not playing today.`);
    return;
  }

  const currentBoxScore = await fetchBoxScore(todaysGameId);
  const playerIsPlaying = verifyPlayerIsPlaying(currentBoxScore, playerId);

  console.log(
    `Player with id ${playerId} is ${playerIsPlaying ? "not " : ""}playing`);
})();

