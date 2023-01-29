import { Match, Player, POSITIONS, Team } from "../entity";
import {
  assignPlayersToPosition,
  assignPlayersToTeams,
  createSortedKeyValuePairs,
  KeyValuePair,
  splitArray
} from "./array";

describe("array utils", () => {
  it("createSortedKeyValuePairs", () => {
    const players: Player[] = [
      {
        id: 1,
        name: "Arthur Dent",
        active: true
      },
      {
        id: 4,
        name: "Ford Prefect",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 3,
            playerId: 4
          },
          {
            position: POSITIONS[1],
            point: 2,
            playerId: 4
          }
        ]
      },
      {
        id: 5,
        name: "Zaphod Beeblebrox",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 10,
            playerId: 1
          }
        ]
      },
      {
        id: 7,
        name: "Marvin",
        active: true,
        scores: [
          {
            position: POSITIONS[1],
            point: 4,
            playerId: 5
          }
        ]
      }
    ];

    const pairs = createSortedKeyValuePairs(players);
    expect(pairs).toStrictEqual([
      { key: 5, value: 10 },
      { key: 4, value: 5 },
      { key: 7, value: 4 },
      { key: 1, value: 0 }
    ]);
  });

  describe("splitArray", () => {
    it("scenario 1: standard numbers - even", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 10 },
        { key: 2, value: 9 },
        { key: 3, value: 8 },
        { key: 4, value: 7 },
        { key: 5, value: 6 },
        { key: 6, value: 5 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 10 },
          { key: 4, value: 7 },
          { key: 5, value: 6 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 2, value: 9 },
          { key: 3, value: 8 },
          { key: 6, value: 5 }
        ])
      );
    });

    it("scenario 2: one player with high numbers - even", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 10 },
        { key: 2, value: 2 },
        { key: 3, value: 1 },
        { key: 4, value: 0 },
        { key: 5, value: 0 },
        { key: 6, value: 0 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 10 },
          { key: 5, value: 0 },
          { key: 6, value: 0 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 2, value: 2 },
          { key: 3, value: 1 },
          { key: 4, value: 0 }
        ])
      );
    });

    it("scenario 3: unintialitzed database: even", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 0 },
        { key: 2, value: 0 },
        { key: 3, value: 0 },
        { key: 4, value: 0 },
        { key: 5, value: 0 },
        { key: 6, value: 0 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 0 },
          { key: 2, value: 0 },
          { key: 3, value: 0 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 4, value: 0 },
          { key: 5, value: 0 },
          { key: 6, value: 0 }
        ])
      );
    });

    it("scenario 4: standard numbers - odd", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 10 },
        { key: 2, value: 9 },
        { key: 3, value: 8 },
        { key: 4, value: 7 },
        { key: 5, value: 6 },
        { key: 6, value: 5 },
        { key: 7, value: 4 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 10 },
          { key: 4, value: 7 },
          { key: 5, value: 6 },
          { key: 7, value: 4 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 2, value: 9 },
          { key: 3, value: 8 },
          { key: 6, value: 5 }
        ])
      );
    });

    it("scenario 5: one player with high numbers - odd", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 10 },
        { key: 2, value: 2 },
        { key: 3, value: 1 },
        { key: 4, value: 0 },
        { key: 5, value: 0 },
        { key: 6, value: 0 },
        { key: 7, value: 0 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 10 },
          { key: 5, value: 0 },
          { key: 6, value: 0 },
          { key: 7, value: 0 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 2, value: 2 },
          { key: 3, value: 1 },
          { key: 4, value: 0 }
        ])
      );
    });

    it("scenario 6: unintialitzed database: odd", () => {
      const pairs: KeyValuePair[] = [
        { key: 1, value: 0 },
        { key: 2, value: 0 },
        { key: 3, value: 0 },
        { key: 4, value: 0 },
        { key: 5, value: 0 },
        { key: 6, value: 0 },
        { key: 7, value: 0 }
      ];

      const [teamAids, teamBids] = splitArray(pairs);

      expect(teamAids).toEqual(
        expect.arrayContaining([
          { key: 1, value: 0 },
          { key: 2, value: 0 },
          { key: 3, value: 0 },
          { key: 4, value: 0 }
        ])
      );
      expect(teamBids).toEqual(
        expect.arrayContaining([
          { key: 5, value: 0 },
          { key: 6, value: 0 },
          { key: 7, value: 0 }
        ])
      );
    });
  });

  it("assignPlayersToPosition", () => {
    const pairs = [
      { key: 1, value: 10 },
      { key: 4, value: 7 },
      { key: 5, value: 6 },
      { key: 7, value: 0 }
    ];
    const players: Player[] = [
      {
        id: 1,
        name: "Arthur Dent",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 10,
            playerId: 1
          }
        ]
      },
      {
        id: 4,
        name: "Ford Prefect",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 3,
            playerId: 4
          },
          {
            position: POSITIONS[1],
            point: 2,
            playerId: 4
          }
        ]
      },
      {
        id: 5,
        name: "Zaphod Beeblebrox",
        active: true,
        scores: [
          {
            position: POSITIONS[1],
            point: 4,
            playerId: 5
          }
        ]
      },
      {
        id: 7,
        name: "Marvin",
        active: true
      }
    ];

    const match: Match = {
      id: 1,
      name: "The Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 6
    };

    const team: Team = {
      id: 1,
      name: "TeamA",
      point: 0,
      type: "TeamA",
      matchId: 1
    };

    const matchPlayerTeams = assignPlayersToPosition(
      pairs,
      players,
      match,
      team
    );

    expect(matchPlayerTeams[0]).toEqual(
      expect.objectContaining({
        playerId: 1,
        position: POSITIONS[0]
      })
    );

    expect(matchPlayerTeams[1]).toEqual(
      expect.objectContaining({
        playerId: 4,
        position: POSITIONS[1]
      })
    );

    expect(matchPlayerTeams[2]).toEqual(
      expect.objectContaining({
        playerId: 5,
        position: POSITIONS[2]
      })
    );

    expect(matchPlayerTeams[3]).toEqual(
      expect.objectContaining({
        playerId: 7,
        position: POSITIONS[3]
      })
    );
  });

  it("assignPlayersToTeams", () => {
    const players: Player[] = [
      {
        id: 1,
        name: "Arthur Dent",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 10,
            playerId: 1
          }
        ]
      },
      {
        id: 2,
        name: "Ford Prefect",
        active: true,
        scores: [
          {
            position: POSITIONS[0],
            point: 3,
            playerId: 4
          },
          {
            position: POSITIONS[1],
            point: 2,
            playerId: 4
          }
        ]
      },
      {
        id: 3,
        name: "Zaphod Beeblebrox",
        active: true,
        scores: [
          {
            position: POSITIONS[1],
            point: 4,
            playerId: 5
          }
        ]
      },
      {
        id: 4,
        name: "Marvin",
        active: true
      }
    ];

    const match: Match = {
      id: 1,
      name: "The Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 6
    };

    const teamA: Team = {
      id: 1,
      name: "TeamA",
      point: 0,
      type: "TeamA",
      matchId: 1
    };

    const teamB: Team = {
      id: 2,
      name: "TeamB",
      point: 0,
      type: "TeamB",
      matchId: 1
    };

    // Act
    const { team1, team2 } = assignPlayersToTeams(players, match, teamA, teamB);

    // Assert
    expect(team1).toEqual([
      expect.objectContaining({
        matchId: 1,
        playerId: 1,
        position: "GOALKEEPER",
        teamId: 1
      }),
      expect.objectContaining({
        matchId: 1,
        playerId: 4,
        position: "LEFT_BACK",
        teamId: 1
      })
    ]);
    expect(team2).toEqual([
      expect.objectContaining({
        matchId: 1,
        playerId: 2,
        position: "GOALKEEPER",
        teamId: 2
      }),
      expect.objectContaining({
        matchId: 1,
        playerId: 3,
        position: "LEFT_BACK",
        teamId: 2
      })
    ]);
  });
});
