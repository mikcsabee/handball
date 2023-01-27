import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm";
import { Match } from "./match.entity";
import { MatchPlayerTeam } from "./matchPlayerTeam.entity";
import { TeamType } from "./team.type";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: "int" })
  point: number;

  @Column()
  matchId: number;

  @ManyToOne(() => Match, (match) => match.teams)
  match?: Match;

  @OneToMany(() => MatchPlayerTeam, (players) => players.match)
  players?: MatchPlayerTeam[];

  @Column({
    type: "enum",
    enum: ["TeamA", "TeamB"],
    enumName: "TeamType"
  })
  type: TeamType;
}
