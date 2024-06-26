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
        const instructor = new User({ id: payload.instructorId })

        return new Activity({
            name: payload.name,
            team,
            instructor,
            startDate: payload.startDate,
            endDate: payload.endDate
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
    instructorId: z.string().uuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.array(activityPayloadSchema)