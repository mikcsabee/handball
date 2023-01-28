import { Match, MatchPlayerTeam, Player, POSITIONS, Team } from "../entity";

export interface KeyValuePair {
  key: number;
  value: number;
}

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

export function assignPlayersToPosition(
  keyValues: KeyValuePair[],
  players: Player[],
  match: Match,
  team: Team
): MatchPlayerTeam[] {
  const result: MatchPlayerTeam[] = [];
  let positions = [...POSITIONS];
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
