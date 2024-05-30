import { BadRequest } from "http-errors";
import jwt from 'jsonwebtoken';
import z from 'zod';
import { initializeRepositories } from "../db";
import { validateBody } from "./common/event-validations";
import { hashPassword } from "./common/hasher";
import { postRequestHandler } from "./common/http-request-handlers";

export const signIn = postRequestHandler(async (event) => {
    const { username, password } = validateBody(event, bodySchema)

    const { usersRepository } = await initializeRepositories()

    const user = await usersRepository.findOneBy({ username, password: hashPassword(password) })

    if (!user)
        throw BadRequest('Invalid credentials')

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!)

    return {
        statusCode: 200,
        body: JSON.stringify(token)
    }
})

const bodySchema = z.object({
    username: z.string(),
    password: z.string()
})