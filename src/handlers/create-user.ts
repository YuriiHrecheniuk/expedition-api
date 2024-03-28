import { z } from "zod";
import { initializeRepositories } from "../db";
import { User } from "../db/entities";
import { validateBody } from "./common/event-validations";
import { postRequestHandler } from "./common/http-request-handlers";

export const createUser = postRequestHandler(async (event) => {
    const body: Body = validateBody(event, bodySchema)

    const { usersRepository } = await initializeRepositories()

    const user = new User(body)

    const record = await usersRepository.save(user)

    return {
        statusCode: 200,
        body: JSON.stringify(record)
    }
})

type Body = z.infer<typeof bodySchema>

const bodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
})