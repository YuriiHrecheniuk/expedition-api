import { initializeRepositories } from "../db";
import { Activity, Score } from "../db/entities";
import { getRequestHandler } from "./common/http-request-handlers";

export const getUnevaluatedParticipants = getRequestHandler(async (event) => {
    const activityId = event.queryStringParameters!.activityId!;

    const { participantsRepository } = await initializeRepositories()

    const participants = await participantsRepository
        .createQueryBuilder("participant")
        .innerJoin(Activity, "activity", "participant.teamId = activity.teamId")
        .leftJoin(Score, "score", "participant.id = score.participantId")
        .where(`activity.id = :activityId`, { activityId })
        .andWhere("score.id IS NULL")
        .getMany()

    return {
        statusCode: 200,
        body: JSON.stringify(participants)
    }
})