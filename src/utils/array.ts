import { Match, MatchPlayerTeam, Player, POSITIONS, Team } from "../entity";

export interface KeyValuePair {
  key: number;
  value: number;
}

/**
 * Create a sorted key value pair of user ids and total number of poins like:
 * pairs [
 *   { key: 1, value: 14 },
 *   { key: 2, value: 10 },
 *   { key: 3, value: 6 },
 *   { key: 4, value: 0 }
 * ]
 * @param players array of players
 * @returns array of key-value pairs
 */
export function createSortedKeyValuePairs(players: Player[]): KeyValuePair[] {
  const keyValuePairs: KeyValuePair[] = players
    .map((p) => {
      const totalPoint: number = p.scores
        ? p.scores.reduce((total, current) => total + current.point, 0)
        : 0;
      return {
        key: p.id as number,
        value: totalPoint
      };
    })
    .sort((a, b) => b.value - a.value);
  return keyValuePairs;
}

/**
 * Split the key-value pair into two arrays (for teamA and teamB) like:
 * [
 *   { key: 1, value: 14 },
 *   { key: 4, value: 0 }
 * ],
 * [
 *   { key: 2, value: 10 },
 *   { key: 3, value: 2 }
 * ]
 * @param arr array of key-value pair
 */
export function splitArray(arr: KeyValuePair[]): KeyValuePair[][] {
  const subArray1: KeyValuePair[] = [];
  const subArray2: KeyValuePair[] = [];
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (sum1 <= sum2 && subArray1.length < Math.ceil(arr.length / 2)) {
      subArray1.push(element);
      sum1 += element.value;
    } else if (subArray2.length < Math.floor(arr.length / 2)) {
      subArray2.push(element);
      sum2 += element.value;
    } else {
      subArray1.push(element);
      sum1 += element.value;
    }
  }

  return [subArray1, subArray2];
}

/**
 * Based on previous scores assign a player into an available position
 * @param keyValues the sorted key-value pairs for the team
 * @param players array of players it can be all players or just the players from the keyValues
 * @param match the Match entity
 * @param team the Team entity
 * @returns an array of MatchPlayerTeam that can be inserted into the database
 */
export function assignPlayersToPosition(
  keyValues: KeyValuePair[],
  players: Player[],
  match: Match,
  team: Team
): MatchPlayerTeam[] {
  let positions = [...POSITIONS];
  const result: MatchPlayerTeam[] = [];
  for (const pair of keyValues) {
    const player = players.find((player) => player.id === pair.key);
    if (!player) {
      throw new Error(`Invalid playerId: ${pair.key}`);
    }
    const amounts = player.scores
      ? player.scores.map((score) => score.point)
      : [];
    const highestPoint = Math.max(...amounts);
    const highestScore = player.scores?.find(
      (score) => score.point === highestPoint
    );

    let position: string;
    if (highestScore && positions.includes(highestScore.position)) {
      position = highestScore.position;
      positions = positions.filter((p) => p !== position);
    } else {
      position = positions.shift() as string;
    }

    result.push({
      matchId: match.id as number,
      playerId: player.id as number,
      teamId: team.id as number,
      match: match,
      player: player,
      team: team,
      position
    });
  }

  return result;
}

/**
 * Splits an array of players into two teams
 * @param players the array of players
 * @param match the match
 * @param teamA the Team A
 * @param teamB the Team B
 * @returns two MatchPlayerTeam that can be inserted into the database
 */
export function assignPlayersToTeams(
  players: Player[],
  match: Match,
  teamA: Team,
  teamB: Team
): {
  team1: MatchPlayerTeam[];
  team2: MatchPlayerTeam[];
} {
  /**
   * create a key value pair of user ids and total number of poins like:
   * pairs [
   *   { key: 1, value: 14 },
   *   { key: 2, value: 10 },
   *   { key: 3, value: 6 },
   *   { key: 4, value: 0 }
   * ]
   */
  const pairs = createSortedKeyValuePairs(players);

  /**
   * Split the key-value pair into two arrays (for teamA and teamB) like:
   * [
   *   { key: 1, value: 14 },
   *   { key: 4, value: 0 }
   * ],
   * [
   *   { key: 2, value: 10 },
   *   { key: 3, value: 2 }
   * ]
   */
  const [teamAids, teamBids] = splitArray(pairs);

  /**
   * Create the MatchPlayersTeams records
   */
  const team1 = assignPlayersToPosition(teamAids, players, match, teamA);
  const team2 = assignPlayersToPosition(teamBids, players, match, teamB);

  return { team1, team2 };
}
