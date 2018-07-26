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

  @Column("text") categories: string[];

  @Column("text") activities: string[];

  @Column("text") status: string;
}
