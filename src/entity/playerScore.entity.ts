import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Player } from ".";

@Entity()
export class PlayerScore {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  position: string;

  @Column({ type: "int" })
  point: number;

  @Column()
  playerId: number;

  @ManyToOne(() => Player, (player) => player.scores)
  player?: Player;
}
