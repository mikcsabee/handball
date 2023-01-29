import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Match, Player, Team } from ".";

@Entity()
export class MatchPlayerTeam {
  @PrimaryColumn()
  matchId: number;

  @PrimaryColumn()
  playerId: number;

  @Column()
  teamId: number;

  @ManyToOne(() => Match, (match) => match.players)
  match: Match;

  @ManyToOne(() => Player, (player) => player.matches)
  player: Player;

  @ManyToOne(() => Team, (team) => team.players)
  team: Team;

  @Column()
  position: string;
}
