import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchPlayerTeam, PlayerScore } from ".";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  active: boolean;

  @OneToMany(() => PlayerScore, (playerScore) => playerScore.player)
  scores?: PlayerScore[];

  @OneToMany(() => MatchPlayerTeam, (matces) => matces.player)
  matches?: MatchPlayerTeam[];
}
