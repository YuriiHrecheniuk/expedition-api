import { z } from "zod";
import { initializeRepositories } from "../db";
import { Activity, Participant, Score } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const submitScores = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)
    console.log(body)

    const { scoresRepository } = await initializeRepositories()

    const scores = body.map(payload =>
        new Score({
            activity: new Activity({ id: payload.activityId }),
            participant: new Participant({ id: payload.participantId }),
            score: payload.score,
            description: payload.description,
        })
    )

    const records = await scoresRepository.save(scores)

    return {
        statusCode: 200,
        body: JSON.stringify(records)
    }
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.array(z.object({
    activityId: z.string().uuid(),
    participantId: z.string().uuid(),
    score: z.number().int().positive(),
    description: z.string().nullish().default(null)
}))