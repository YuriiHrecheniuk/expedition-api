import { initializeRepositories } from "../db";
import { Participant, Score } from "../db/entities";
import { getRequestHandler } from "./common/http-request-handlers";

export const getActivities = getRequestHandler(async (event) => {
    const { activitiesRepository } = await initializeRepositories()

    const activities = await activitiesRepository
        .createQueryBuilder("activity")
        .leftJoin(Score, "score", "activity.id = score.activityId")
        .leftJoin(Participant, "participant", "score.participantId = participant.id")
        .groupBy("activity.id")
        .addGroupBy("activity.teamId")
        .having("COUNT(DISTINCT score.id) != COUNT(DISTINCT participant.id)")
        .getMany();


    return {
        statusCode: 200,
        body: JSON.stringify(activities)
    }
})