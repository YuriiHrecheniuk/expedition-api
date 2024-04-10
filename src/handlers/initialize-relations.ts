import { initializeRepositories } from "../db";
import { Activity, Participant, Team, User } from "../db/entities";
import { postRequestHandler } from "./common/http-request-handlers";

export const initializeRelations = postRequestHandler(async () => {
    const {
        participantsRepository,
        activitiesRepository,
        teamsRepository,
        usersRepository
    } = await initializeRepositories()

    const [yurii, vlad, dima] = await initializeUsers()
    const [yuriiTeam, vladTeam] = await initializeTeams(yurii, vlad)
    await initializeActivities(yuriiTeam, vladTeam)
    await initializeParticipants(yuriiTeam, vladTeam)

    return {
        statusCode: 200,
        body: JSON.stringify("Relations initialized")
    }

    function initializeUsers(): Promise<[User, User, User]> {
        const yurii = new User({
            firstName: "Yurii",
            lastName: "Hrecheniuk"
        })

        const vlad = new User({
            firstName: "Vlad",
            lastName: "Kot"
        })

        const dima = new User({
            firstName: "Dima",
            lastName: "Marshalok"
        })

        return usersRepository.save([yurii, vlad, dima]) as Promise<[User, User, User]>
    }

    function initializeTeams(yurii: User, vlad: User): Promise<[Team, Team]> {
        const yuriiTeam = new Team({
            name: "Yurii's team",
            instructor: yurii,
        })

        const vladTeam = new Team({
            name: "Vlad's team",
            instructor: vlad
        })

        return teamsRepository.save([yuriiTeam, vladTeam]) as Promise<[Team, Team]>
    }

    function initializeActivities(yuriiTeam: Team, vladTeam: Team): Promise<[Activity, Activity]> {
        const yuriiActivity = new Activity({
            name: "Yurii's activity",
            team: yuriiTeam,
            startDate: new Date(),
            endDate: new Date()
        })

        const vladActivity = new Activity({
            name: "Vlad's activity",
            team: vladTeam,
            startDate: new Date(),
            endDate: new Date()
        })

        return activitiesRepository.save([yuriiActivity, vladActivity]) as Promise<[Activity, Activity]>
    }

    async function initializeParticipants(yuriiTeam: Team, vladTeam: Team) {
        const zahor = new Participant({
            firstName: "Yurii",
            lastName: "Zahoruirko",
            team: yuriiTeam,
            birthDate: new Date("2003-01-01")
        })

        const stas = new Participant({
            firstName: "Stas",
            lastName: "Hut",
            team: vladTeam,
            birthDate: new Date("2002-06-17")
        })

        await participantsRepository.save([zahor, stas])
    }
})
