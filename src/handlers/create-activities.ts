import { z } from "zod";
import { initializeRepositories } from "../db";
import { Activity, Team, User } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createActivities = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { activitiesRepository } = await initializeRepositories()

    const activities = body.map(payload => {
        const team = new Team({ id: payload.teamId })
        const instructors = payload.instructors.map(id => new User({ id }))

        return new Activity({
            name: payload.name,
            team,
            instructors,
            date: payload.date
        })
    })

    const records = await activitiesRepository.save(activities)

    return {
        statusCode: 200,
        body: JSON.stringify(records)
    }
})

const activityPayloadSchema = z.object({
    name: z.string(),
    teamId: z.string().uuid(),
    instructors: z.array(z.string().uuid()),
    date: z.coerce.date(),
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.array(activityPayloadSchema)