import { initializeRepositories } from "../db";
import { Activity, Participant, Team, User } from "../db/entities";
import { hashPassword } from "./common/hasher";
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
    await initializeActivities(yuriiTeam, vladTeam, yurii, vlad)
    await initializeParticipants(yuriiTeam, vladTeam)

    return {
        statusCode: 200,
        body: JSON.stringify("Relations initialized")
    }

    function initializeUsers(): Promise<[User, User, User]> {
        const yurii = new User({
            firstName: "Yurii",
            lastName: "Hrecheniuk",
            username: "yurii",
            password: hashPassword("yurii1234")
        })

        const vlad = new User({
            firstName: "Vlad",
            lastName: "Kot",
            username: "clout",
            password: hashPassword("clout1234")
        })

        const dima = new User({
            firstName: "Dima",
            lastName: "Marshalok",
            username: "dima",
            password: hashPassword("dima1234")
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

    function initializeActivities(yuriiTeam: Team, vladTeam: Team, yurii: User, vlad: User): Promise<[Activity, Activity]> {
        const yuriiActivity = new Activity({
            name: "Boating",
            team: yuriiTeam,
            instructor: vlad,
            startDate: new Date(),
            endDate: new Date()
        })

        const vladActivity = new Activity({
            name: "Swimming",
            team: vladTeam,
            instructor: yurii,
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
