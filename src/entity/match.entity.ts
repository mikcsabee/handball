import {
  Entity,
  Check,
  Column,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { MatchPlayerTeam, Team } from ".";

@Entity()
export class Match {
  public static MIN_NUMBER_OF_PLAYERS = 6;
  public static MAX_NUMBER_OF_PLAYERS = 14;

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: "bigint" })
  createdAt: number;

  @Column()
  finalized: boolean;

  @Column({ type: "int" })
  @Check(
    `"numberOfPlayers" >= ${Match.MIN_NUMBER_OF_PLAYERS} AND "numberOfPlayers" <= ${Match.MAX_NUMBER_OF_PLAYERS}`
  )
  numberOfPlayers: number;

  @OneToMany(() => Team, (team) => team.match)
  teams?: Team[];

  @OneToMany(() => MatchPlayerTeam, (players) => players.match)
  players?: MatchPlayerTeam[];
}
