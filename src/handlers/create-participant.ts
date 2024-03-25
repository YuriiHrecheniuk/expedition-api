import { postRequestHandler } from "./common/http-request-handlers";
import { z } from "zod";
import { initializeDatabase } from "../db";
import { Participant, Team } from "../db/entities";
import { NotFound } from 'http-errors'
import { Repository } from "typeorm";

export const createParticipant = postRequestHandler(async (event) => {
    const body = bodySchema.parse(JSON.parse(event.body!))

    const db = await initializeDatabase()
    const participantRepository = db.getRepository(Participant)
    const teamsRepository = db.getRepository(Team)

    const team = await getTeam(teamsRepository, body.teamId)

    const participant = buildParticipant(body, team)

    const record = await participantRepository.save(participant)

    return {
        statusCode: 200,
        body: JSON.stringify(record)
    }
})

const bodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.coerce.date().nullish().default(null),
    teamId: z.string().uuid().nullish().default(null)
})

const buildParticipant = (body: z.infer<typeof bodySchema>, team: Team | null = null): Participant =>
    new Participant(
        body.firstName,
        body.lastName,
        body.birthDate,
        team
    )

const getTeam = async (teamsRepository: Repository<Team>, id: string | null): Promise<Team | null> =>
    id
        ? await teamsRepository.findOneByOrFail({ id })
            .catch(() => Promise.reject(NotFound(`Team with id ${id} not found`)))
        : null
