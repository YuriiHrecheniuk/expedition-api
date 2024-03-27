import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpError } from "http-errors"

enum HttpMethod {
    GET = "GET",
    POST = "POST"
}

type HandleFn = (event: APIGatewayProxyEvent) => APIGatewayProxyResult | Promise<APIGatewayProxyResult>;

export const getRequestHandler = (handleFn: HandleFn) => httpRequestHandler(HttpMethod.GET, handleFn)

export const postRequestHandler = (handleFn: HandleFn) => httpRequestHandler(HttpMethod.POST, handleFn)

const httpRequestHandler = (method: HttpMethod,
                            handleFn: HandleFn) =>
    async (event: APIGatewayProxyEvent) => {
        try {
            validateHttpMethod(event, method)

            return await handleFn(event);
        } catch (error) {
            return handleError(error)
        }
    }

const validateHttpMethod = (event: APIGatewayProxyEvent, method: HttpMethod) => {
    if (event.httpMethod !== method) {
        throw new Error(`Unhandled HTTP method: ${event.httpMethod} != ${method}`);
    }
}

const handleError = (error: unknown): APIGatewayProxyResult => {
    if (error instanceof HttpError) {
        return {
            statusCode: error.statusCode,
            body: error.message
        }
    }

    console.error("Unhandled error:", error);
    return { statusCode: 500, body: "Internal server error" };
}