import { initializeRepositories } from "../db";
import { authorize } from "./common/authorizer";
import { getRequestHandler } from "./common/http-request-handlers";

export const getTopTeams = getRequestHandler(async (event) => {
    const { usersRepository, scoresRepository, participantsRepository } = await initializeRepositories()

    await authorize(event, usersRepository)

    const participantsWithScores = await participantsRepository
        .createQueryBuilder("participant")
        .leftJoin("participant.scores", "scores")
        .innerJoin("participant.team", "team")
        .groupBy("team.id")
        .select(["IFNULL(SUM(scores.score), 0) as score", "team.name as name"])
        .orderBy("score", "DESC")
        .execute()

    return {
        statusCode: 200,
        body: JSON.stringify(participantsWithScores)
    }
})