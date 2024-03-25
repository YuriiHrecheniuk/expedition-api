import { initializeDatabase } from "../db";
import { Activity } from "../db/entities";
import { APIGatewayEvent } from "aws-lambda";

export const getActivities = async (event: APIGatewayEvent) => {
    if (event.httpMethod !== "GET") {
        throw new Error('Unhandled HTTP method')
    }

    const db = await initializeDatabase()
    const activityRepo = db.getRepository(Activity)

    const result = await activityRepo.findBy({
    })
}