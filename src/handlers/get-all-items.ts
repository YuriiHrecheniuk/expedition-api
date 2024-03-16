import mysql from 'mysql2/promise'

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllItemsHandler = async (event: any) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);

    const connection = await mysql.createConnection({
        host: 'host.docker.internal',
        user: 'root',
        password: 'rr*UWhvUKeR8BL',
        database: 'demo',
    });

    try {
        const [results, fields] = await connection.query(
            'SELECT * FROM demo_table'
        );

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify([])
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
