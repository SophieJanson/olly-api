import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  Index,
  ManyToOne
} from "typeorm";
import User from "./entity";
import WeeklyUpdate from "../weeklyUpdates/entity";
import FollowUp from "../followups/entity";

@Entity()
export default class Match extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("text") categories: string[];

  @Column("text") activities: string[];

  @Column("text") status: string;

  @ManyToMany(_ => User, user => user.id)
  @Column({ type: "integer", array: true })
  users: number[];

  @OneToMany(_ => WeeklyUpdate, weeklyUpdate => weeklyUpdate.match)
  weeklyUpdate: number[];

  @OneToMany(_ => FollowUp, followUp => followUp.match)
  followUps: number[];

  @OneToMany(_ => MatchedUser, matchedUser => matchedUser.match)
  matchedUser: number[];
}

@Entity()
@Index(["match", "user"], { unique: true })
export class MatchedUser extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @ManyToOne(_ => User, user => user.matchedUsers)
  user: User;

  @ManyToOne(_ => Match, match => match.matchedUsers)
  match: Match;

  @Column() userId: number;
}
