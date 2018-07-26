import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from "typeorm";
import User from "./entity";

@Entity()
export default class Match extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;
  @ManyToMany(_ => User, user => user.id)
  @Column("integer")
  users: number[];

  @Column("array") categories: string[];

  @Column("array") activities: string[];

  @Column("string") status: string;
}
