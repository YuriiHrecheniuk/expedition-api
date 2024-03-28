import { z } from "zod";
import { initializeRepositories } from "../db";
import { Team, User } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createTeam = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { teamsRepository } = await initializeRepositories()

    const instructor = new User({ id: body.instructorId })

    const team = new Team({
        name: body.name,
        instructor
    })

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