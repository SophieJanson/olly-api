import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne
} from "typeorm";
import { Exclude } from "class-transformer";
import {
  MinLength,
  IsString,
  IsEmail,
  IsArray,
  IsOptional
} from "class-validator";
import * as bcrypt from "bcrypt";
import WeeklyUpdate from "../weeklyUpdates/entity";
import Match from "../matches/entity";
import FollowUp from "../followups/entity";
import Company from "../companies/entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  // @IsOptional()
  // @IsString()
  // @MinLength(2)
  // @Column("text", { nullable: true })
  // firstName?: string;

  // @IsOptional()
  // @IsString()
  // @MinLength(2)
  // @Column("text", { nullable: true })
  // lastName?: string;

  @IsOptional()
  @IsString()
  @Column("text", { nullable: true })
  department?: string;

  @IsOptional()
  @IsString()
  @Column("text", { nullable: true })
  role?: string;

  @IsOptional()
  // funFact should be ONLY ONE fun fact! (for now)
  @IsString()
  @Column("text", { nullable: true })
  funFact?: string;

  @IsOptional()
  @IsArray()
  @Column("text", { nullable: true })
  interests?: string[];

  @IsOptional()
  @IsArray()
  @Column("text", { nullable: true })
  skills?: string[];

  // @IsEmail()
  // @Column("text", { nullable: true })
  // email?: string;

  @IsString()
  @Column('text', {nullable: true})
  slackId: string;

  @ManyToOne(_ => Company, company => company.users, {eager: true})
  company: string;

  // @IsString()
  // @MinLength(8)
  // @Column("text", {nullable: true})
  // @Exclude({ toPlainOnly: true})
  // password?: string;

  // async setPassword(rawPassword: string) {
  //   const hash = await bcrypt.hash(rawPassword, 10);
  //   this.password = hash;
  // }

  // checkPassword(rawPassword: string) {
  //   return this.password ? bcrypt.compare(rawPassword, this.password): null;
  // }

  @OneToMany(_ => WeeklyUpdate, WeeklyUpdate => WeeklyUpdate.user)
  weeklyUpdate: number[];

  @OneToMany(_ => FollowUp, followUp => followUp.user)
  followUps: number[];

  @ManyToMany(_ => Match, match => match.users)
  matches: Match[];
}
