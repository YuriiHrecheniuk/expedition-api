import { Chance } from 'chance'
import { initializeRepositories } from "../db";
import { Activity, Participant, Team, User } from "../db/entities";
import { hashPassword } from "./common/hasher";
import { postRequestHandler } from "./common/http-request-handlers";

const chance = new Chance()

export const initializeRelations = postRequestHandler(async () => {
    const {
        participantsRepository,
        activitiesRepository,
        teamsRepository,
        usersRepository
    } = await initializeRepositories()

    const [yurii, vlad, dima, joe, volodymyr] = await initializeUsers()
    const [yuriiTeam, vladTeam, joeTeam, volodymyrTeam] = await initializeTeams(yurii, vlad, joe, volodymyr)
    await initializeActivities(yuriiTeam, vladTeam, joeTeam, volodymyrTeam, yurii, vlad)
    await initializeParticipants(yuriiTeam, vladTeam)

    return {
        statusCode: 200,
        body: JSON.stringify("Relations initialized")
    }

    function initializeUsers(): Promise<[User, User, User, User, User]> {
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

        const joe = new User({
            firstName: "Joe",
            lastName: "Biden",
            username: "joe",
            password: hashPassword("joe1234")
        })

        const volodymyr = new User({
            firstName: "Volodymyr",
            lastName: "Zelenskyi",
            username: "zelenskyi",
            password: hashPassword("volodymyr1234")
        })

        return usersRepository.save([yurii, vlad, dima, joe, volodymyr]) as Promise<[User, User, User, User, User]>
    }

    function initializeTeams(yurii: User, vlad: User, joe: User, volodymyr: User): Promise<[Team, Team, Team, Team]> {
        const yuriiTeam = new Team({
            name: "Yurii's team",
            instructor: yurii,
        })

        const vladTeam = new Team({
            name: "Vlad's team",
            instructor: vlad
        })

        const joeTeam = new Team({
            name: "Joe's team",
            instructor: joe
        })

        const volodymyrTeam = new Team({
            name: "Volodymyr's team",
            instructor: volodymyr
        })

        return teamsRepository.save([yuriiTeam, vladTeam, joeTeam, volodymyrTeam]) as Promise<[Team, Team, Team, Team]>
    }

    function initializeActivities(yuriiTeam: Team, vladTeam: Team, joeTeam: Team, volodymyrTeam: Team, yurii: User, vlad: User): Promise<[Activity, Activity]> {
        const vladActivities = [
            new Activity({
                name: "Boating",
                team: yuriiTeam,
                instructor: vlad,
                startDate: new Date(),
                endDate: new Date()
            }),
            new Activity({
                name: "Archery",
                team: joeTeam,
                instructor: vlad,
                startDate: new Date(),
                endDate: new Date()
            }),
        ]

        const yuriiActivities = [
            new Activity({
                name: "Swimming",
                team: vladTeam,
                instructor: yurii,
                startDate: new Date(),
                endDate: new Date()
            }),
            new Activity({
                name: "Climbing",
                team: volodymyrTeam,
                instructor: yurii,
                startDate: new Date(),
                endDate: new Date()
            }),
        ]

        return activitiesRepository.save([...yuriiActivities, ...vladActivities]) as Promise<[Activity, Activity]>
    }

    async function initializeParticipants(yuriiTeam: Team, vladTeam: Team) {
        const yuriiParticipants = Array.from(new Array(15), () => {
            return new Participant({
                firstName: chance.name(),
                lastName: chance.last(),
                team: yuriiTeam,
                birthDate: chance.birthday()
            })
        })

        const vladParticipants = Array.from(new Array(15), () => {
            return new Participant({
                firstName: chance.name(),
                lastName: chance.last(),
                team: vladTeam,
                birthDate: chance.birthday()
            })
        })

        await participantsRepository.save([...yuriiParticipants, ...vladParticipants])
    }
})
