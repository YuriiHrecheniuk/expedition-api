import { APIGatewayProxyEvent } from "aws-lambda";
import { BadRequest } from "http-errors";
import z, { ZodType } from "zod";

export const validateBody = <T extends ZodType>(event: APIGatewayProxyEvent, schema: T): z.infer<T> => {
    try {
        return schema.parse(JSON.parse(event.body!))
    } catch {
        throw BadRequest('Invalid request body')
    }
}