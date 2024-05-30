import { APIGatewayProxyEvent } from "aws-lambda";
import { Unauthorized } from "http-errors";
import jwt from 'jsonwebtoken'
import { Repository } from "typeorm";
import { User } from "../../db/entities";

export const authorize = async (event: APIGatewayProxyEvent, usersRepository: Repository<User>): Promise<User> => {
    try {
        const token = event.headers['Authorization']?.split("Bearer ")[1]!;

        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        return await usersRepository.findOneByOrFail({ id })
    } catch {
        throw Unauthorized()
    }
}