import { APIGatewayProxyEvent } from "aws-lambda";
import z, { ZodType } from "zod";

export const validateBody = <T extends ZodType>(event: APIGatewayProxyEvent, schema: T): z.infer<T> =>
    schema.parse(JSON.parse(event.body!))