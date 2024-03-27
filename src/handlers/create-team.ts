import { NotFound } from "http-errors";
import { Repository } from "typeorm";
import { z } from "zod";
import { initializeRepositories } from "../db";
import { Team, User } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createTeam = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { teamsRepository, usersRepository } = await initializeRepositories()

    const instructor = await getUser(usersRepository, body.instructorId)

    const team = buildTeam(body, instructor)

    const record = await teamsRepository.save(team)

    return {
        statusCode: 200,
        body: JSON.stringify(record)
    }
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.object({
    name: z.string().nullish().default(null),
    instructorId: z.string().uuid(),
})

const getUser = async (usersRepository: Repository<User>, id: string): Promise<User> =>
    await usersRepository.findOneByOrFail({ id }).catch(
        () => Promise.reject(NotFound(`User with id ${id} not found`))
    )

const buildTeam = (body: Body, instructor: User): Team =>
    new Team(
        instructor,
        body.name
    )