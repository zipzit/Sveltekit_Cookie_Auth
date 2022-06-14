import stringHash from 'string-hash';
import * as cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '$lib/db';

export const post = async({ request }) => {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    body = await request.json()

    const user = await db.collection('testUsers').findOne({ email: body.email });

    if (!user) {
        return {
            status: 401,
            body: {
                message: 'Incorrect email or password'
            }
        };
    }

    if (user.password !== stringHash(body.password)) {
        return {
            status: 401,
            body: {
                message: 'Unauthorized'
            }
        };
    }

    const cookieId = uuidv4();

    // Look for existing email to avoid duplicate entries
    const duplicateUser = await db.collection('cookies').findOne({ email: body.email });

    // If there is user with cookie, update the cookie, otherwise create a new DB entry
    if (duplicateUser) {
        await db.collection('cookies').updateOne({ email: body.email }, { $set: { cookieId } });
    } else {
        await db.collection('cookies').insertOne({
            cookieId,
            email: body.email
        });
    }

    // Set cookie
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