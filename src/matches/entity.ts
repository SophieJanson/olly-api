import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable
} from "typeorm";
import User from "../users/entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
import FollowUp from "../followups/entity";

@Entity()
export default class Match extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("text") categories: string[];

  @Column("text") activities: string[];

  //@Column("text") status: string;

  @ManyToMany(_ => User, user => user.matches)
  //@Column({ type: "integer", array: true })
  @JoinTable()
  users: User[];

  @OneToMany(_ => WeeklyUpdate, weeklyUpdate => weeklyUpdate.match)
  weeklyUpdate: number[];

  @OneToMany(_ => FollowUp, followUp => followUp.match)
  followUps: number[];
}
