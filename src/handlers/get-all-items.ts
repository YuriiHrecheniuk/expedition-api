import { initializeDatabase } from "../db";
import { Activity, Team, User } from "../db/entities";

export const getAllItemsHandler = async (event: any) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);

    try {
        const db = await initializeDatabase()
        const userRepository = db.getRepository(User)
        const teamRepository = db.getRepository(Team)
        const activityRepository = db.getRepository(Activity)

        // const user = new User()
        // user.firstName = "Yurii"
        // user.lastName = "Hrecheniuk"
        //
        // const team = new Team()
        // team.instructor = user
        // team.name = "Yurii's team"
        //
        // const activity = new Activity()
        // activity.date = new Date()
        // activity.instructors = [user]
        // activity.name = "Super activity"
        // activity.team = team
        //
        // await Promise.all([
        //     userRepository.save(user),
        //     teamRepository.save(team),
        //     activityRepository.save(activity)
        // ])

        const results = await teamRepository.find({
            relations: {
                instructor: true
            },
            where: {
                instructor: {
                    id: "6df0ac42-e266-4caa-9735-1dbc126862e8"
                }
            }
        })

        console.log(results); // results contains rows returned by server
    } catch (err) {
        console.log(err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify([])
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
