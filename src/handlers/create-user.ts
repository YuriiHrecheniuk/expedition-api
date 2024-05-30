import { Conflict } from "http-errors";
import { z } from "zod";
import { initializeRepositories } from "../db";
import { User } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { hashPassword } from "./common/hasher";
import { postRequestHandler } from "./common/http-request-handlers";

export const createUser = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { usersRepository } = await initializeRepositories()

    await checkExistingUser()

    const user = new User({ ...body, password: hashPassword(body.password) })

    const record = await usersRepository.save(user)

    return {
        statusCode: 200,
        body: JSON.stringify(record.id)
    }

    async function checkExistingUser() {
        const existingUser = await usersRepository.findOneBy({ username: body.username })

        if (existingUser)
            throw Conflict('User already exists')
    }
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    password: z.string().min(8),
})