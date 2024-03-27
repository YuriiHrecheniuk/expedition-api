import "reflect-metadata"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

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

    constructor(
        firstName: string,
        lastName: string
    ) {
        this.firstName = firstName
        this.lastName = lastName
    }
}

@Entity()
export class Participant {
    @PrimaryGeneratedColumn("uuid")
    readonly id!: string

    @Column("varchar", { length: 256 })
    readonly firstName: string

    @Column("varchar", { length: 256 })
    readonly lastName: string

    @Column("date", { nullable: true })
    readonly birthDate: Date | null

    @ManyToOne(() => Team, { nullable: true })
    readonly team: Team | null

    constructor(
        firstName: string,
        lastName: string,
        birthDate: Date | null = null,
        team: Team | null = null
    ) {
        this.firstName = firstName
        this.lastName = lastName
        this.birthDate = birthDate
        this.team = team
    }
}

@Entity()
export class Score {
    @PrimaryGeneratedColumn("uuid")
    id!: number

    @ManyToOne(() => Activity)
    activity!: Activity

    @ManyToOne(() => Participant)
    participant!: Participant

    @Column("int", { unsigned: true })
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
    id!: string

    @Column("varchar", { length: 256, nullable: true })
    name!: string | null

    @OneToOne(() => User)
    @JoinColumn()
    instructor!: User

    constructor(instructor: User, name: string | null) {
        this.name = name
        this.instructor = instructor
    }
}
