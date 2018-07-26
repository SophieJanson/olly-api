import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail } from "class-validator";
import * as bcrypt from "bcrypt";
import WeeklyUpdate from "../weeklyUpdates/entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @IsString()
  @MinLength(2)
  @Column("text")
  firstName: string;

  @IsString()
  @MinLength(2)
  @Column("text")
  lastName: string;

  @IsString()
  @Column("text")
  department: string;

  @IsString()
  @Column("text")
  role: string;

  @IsString()
  @Column("text")
  funFacts: string;

  @IsString()
  @Column("text")
  interests: string;

  @IsEmail()
  @Column("text")
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

//   @OneToMany(_ => WeeklyUpdate, weeklyUpdate => weeklyUpdate.users, {
//     eager: false
//   })
//   weeklyUpdates: WeeklyUpdate[];
}
