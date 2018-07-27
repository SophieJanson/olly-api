import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany
} from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail } from "class-validator";
import * as bcrypt from "bcrypt";
import WeeklyUpdate from "../weeklyUpdates/entity";
import Match from "../matches/entity";
import FollowUp from "../followups/entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @IsString()
  @MinLength(2)
  @Column("text", { nullable: true })
  firstName: string;

  @IsString()
  @MinLength(2)
  @Column("text", { nullable: true })
  lastName: string;

  @IsString()
  @Column("text", { nullable: true })
  department: string;

  @IsString()
  @Column("text", { nullable: true })
  role: string;

  @IsString()
  @Column("text", { nullable: true })
  funFacts: string;

  @IsString()
  @Column("text", { nullable: true })
  interests: string;

  @IsEmail()
  @Column("text", { nullable: true })
  email: string;

  @IsString()
  @MinLength(8)
  @Column("text")
  @Exclude({ toPlainOnly: true })
  password: string;

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }

  @OneToMany(_ => WeeklyUpdate, WeeklyUpdate => WeeklyUpdate.user)
  weeklyUpdate: number[];

  @OneToMany(_ => FollowUp, followUp => followUp.user)
  followUps: number[];

  @ManyToMany(_ => Match, match => match.users)
  matches: Match[];
}
