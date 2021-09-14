import stringHash from 'string-hash';
import * as cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '$lib/db';

export const post = async({ body }) => {
    // Connecting to DB
    // All database code can only run inside async functions as it uses await
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    // Is there a user with such an email?
    const user = await db.collection('testUsers').findOne({ email: body.email });

    // If there is, either send status 409 Conflict and inform the user that their email is already taken
    // or send status 202 or 204 and tell them to double-check on their credentials and try again - it is considered more secure
    if (user) {
        return {
            status: 409,
            body: {
                message: 'User with that email already exists'
            }
        };
    }

    // Add user to DB
    // All database code can only run inside async functions as it uses await
    await db.collection('testUsers').insertOne({
        name: body.name,
        email: body.email,
        password: stringHash(body.password)
    });

    // Add cookie with user's email to DB
    // All database code can only run inside async functions as it uses await
    const cookieId = uuidv4();
    await db.collection('cookies').insertOne({
        cookieId,
        email: body.email
    });

    // Set cookie
    // If you want cookies to be passed alongside user when they redirect to another website using a link, change sameSite to 'lax'
    // If you don't want cookies to be valid everywhere in your app, modify the path property accordingly
    const headers = {
        'Set-Cookie': cookie.serialize('session_id', cookieId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'strict',
            path: '/'
        })
    };

    return {
        status: 200,
        headers,
        body: {
            message: 'Success'
        }
    };
};