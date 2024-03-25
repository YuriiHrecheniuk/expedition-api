import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export const submitScores = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "POST") {
        throw new Error('Unhandled HTTP method')
    }

    const body = bodySchema.parse(JSON.parse(event.body!))

    return {
        statusCode: 200,
        body: JSON.stringify(body)
    }
}

const bodySchema = z.array(
    z.object({
        activityId: z.string().uuid().optional(),
        score: z.number().int().positive(),
        participantId: z.string().uuid(),
        description: z.string().optional(),
    })
)