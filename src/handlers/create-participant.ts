import { NotFound } from 'http-errors'
import { Repository } from "typeorm";
import { z } from "zod";
import { initializeRepositories } from "../db";
import { Participant, Team } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createParticipant = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { teamsRepository, participantsRepository } = await initializeRepositories()

    const team = await getTeam(teamsRepository, body.teamId)

    const participant = buildParticipant(body, team)

    const record = await participantsRepository.save(participant)

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

type Body = z.infer<typeof bodySchema>

const buildParticipant = (body: Body, team: Team | null = null): Participant =>
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
