import "reflect-metadata"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar", { length: 256 })
    name!: string

    @ManyToOne(() => Team)
    team!: Team

    @ManyToMany(() => User)
    @JoinTable()
    instructors!: User[]

    @Column("date")
    date!: Date
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar", { length: 256 })
    firstName!: string

    @Column("varchar", { length: 256 })
    lastName!: string
}

@Entity()
export class Participant {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar", { length: 256 })
    firstName!: string

    @Column("varchar", { length: 256 })
    lastName!: string

    @Column("date")
    birthDate!: Date

    @ManyToOne(() => Team)
    team!: Team
}

@Entity()
export class Score {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @ManyToOne(() => Activity)
    activity!: Activity

    @ManyToOne(() => Participant)
    participant!: Participant

    @Column("int", {unsigned: true})
    score!: number;

    @Column("varchar")
    description!: string;

    @ManyToOne(() => User)
    createdBy!: User

    @Column("datetime")
    createdAt!: Date
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @Column("varchar", {length: 256})
    name!: string

    @OneToOne(() => User)
    instructor!: User
}
