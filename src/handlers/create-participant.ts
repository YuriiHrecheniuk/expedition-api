import { z } from "zod";
import { initializeRepositories } from "../db";
import { Participant, Team } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createParticipant = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { participantsRepository } = await initializeRepositories()

    const team = body.teamId ? new Team({ id: body.teamId }) : null

    const participant = new Participant({
        firstName: body.firstName,
        lastName: body.lastName,
        birthDate: body.birthDate,
        team
    })

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
