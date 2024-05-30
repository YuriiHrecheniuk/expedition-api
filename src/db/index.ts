import "reflect-metadata"
import { DataSource } from "typeorm"
import { Activity, Participant, Score, Team, User } from './entities'

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT!,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Team, Participant, Score, User, Activity],
    synchronize: true,
    logging: true,
})

export const initializeRepositories = async () => {
    const db = await initializeDatabase()

    const participantsRepository = db.getRepository(Participant)
    const teamsRepository = db.getRepository(Team)
    const usersRepository = db.getRepository(User)
    const activitiesRepository = db.getRepository(Activity)
    const scoresRepository = db.getRepository(Score)

    return {
        participantsRepository,
        teamsRepository,
        usersRepository,
        activitiesRepository,
        scoresRepository
    } as const
}

const initializeDatabase = async (): Promise<DataSource> => {
    if (AppDataSource.isInitialized)
        return AppDataSource

    return await AppDataSource.initialize()
}
