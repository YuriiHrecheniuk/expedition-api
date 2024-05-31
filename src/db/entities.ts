import "reflect-metadata"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", { length: 256 })
    name: string

    @ManyToOne(() => Team)
    team: Team

    @ManyToOne(() => User)
    instructor: User

    @Column("datetime")
    startDate: Date

    @Column("datetime")
    endDate: Date

    constructor({
                    id,
                    name,
                    team,
                    instructor,
                    startDate,
                    endDate
                }: Partial<Activity> = {}) {
        this.id = id!
        this.name = name!
        this.team = team!
        this.instructor = instructor!
        this.startDate = startDate!
        this.endDate = endDate!
    }
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", { length: 256 })
    firstName: string

    @Column("varchar", { length: 256 })
    lastName: string

    @Column("varchar", { length: 256 })
    username: string

    @Column("varchar", { length: 256 })
    password: string

    constructor({
                    id,
                    firstName,
                    lastName,
                    username,
                    password
                }: Partial<User> = {}) {
        this.id = id!
        this.firstName = firstName!
        this.lastName = lastName!
        this.username = username!
        this.password = password!
    }
}

@Entity()
export class Participant {
    @PrimaryGeneratedColumn("uuid")
    readonly id: string

    @Column("varchar", { length: 256 })
    readonly firstName: string

    @Column("varchar", { length: 256 })
    readonly lastName: string

    @Column("date", { nullable: true })
    readonly birthDate: Date | null

    @ManyToOne(() => Team, { nullable: true })
    readonly team: Team | null

    @OneToMany(() => Score, score => score.participant)
    readonly scores: Score[]

    constructor({
                    id,
                    firstName,
                    lastName,
                    birthDate,
                    team,
                    scores
                }: Partial<Participant> = {}) {
        this.id = id!
        this.firstName = firstName!
        this.lastName = lastName!
        this.birthDate = birthDate!
        this.team = team!
        this.scores = scores!
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

    @Column("varchar", { nullable: true })
    description!: string | null;

    @ManyToOne(() => User, { nullable: true })
    createdBy!: User | null

    @CreateDateColumn()
    createdAt!: Date;

    constructor({
                    id,
                    activity,
                    participant,
                    score,
                    description,
                    createdBy,
                }: Partial<Score> = {}) {
        this.id = id!;
        this.activity = activity!;
        this.participant = participant!;
        this.score = score!;
        this.description = description!;
        this.createdBy = createdBy!;
    }
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", { length: 256, nullable: true })
    name: string | null

    @OneToOne(() => User)
    @JoinColumn()
    instructor: User

    constructor({
                    id,
                    name,
                    instructor
                }: Partial<Team> = {}) {
        this.id = id!
        this.name = name!
        this.instructor = instructor!
    }
}
