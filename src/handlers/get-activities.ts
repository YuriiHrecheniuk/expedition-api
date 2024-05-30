import { initializeRepositories } from "../db";
import { Participant, Score } from "../db/entities";
import { authorize } from "./common/authorizer";
import { getRequestHandler } from "./common/http-request-handlers";

export const getActivities = getRequestHandler(async (event) => {
    const { activitiesRepository, usersRepository } = await initializeRepositories()

    const user = await authorize(event, usersRepository)

    const activities = await activitiesRepository
        .createQueryBuilder("activity")
        .leftJoinAndSelect("activity.instructors", "instructors")
        .leftJoinAndSelect("activity.team", "team")
        .leftJoin(Participant, "participant", "activity.teamId = participant.teamId")
        .leftJoin(Score, "score", "activity.id = score.activityId")
        .groupBy("activity.id")
        .addGroupBy("activity.teamId")
        .having("COUNT(DISTINCT score.id) != COUNT(DISTINCT participant.id)")
        .getMany();


    return {
        statusCode: 200,
        body: JSON.stringify(activities)
    }
})