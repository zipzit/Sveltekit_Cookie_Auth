import * as cookie from 'cookie';
import { connectToDatabase } from '$lib/db';

// This function runs every time SvelteKit receives a request — whether that happens 
// while the app is running, or during prerendering — and determines the response. 
// It receives the request object and a function called resolve, which invokes 
// SvelteKit's router and generates a response (rendering a page, or invoking an 
// endpoint) accordingly. 
// Sets context in endpoints
// Try console logging context in your endpoints' HTTP methods to understand the structure
export const handle = async({ event, resolve }) => {
    // Connecting to DB
    // All database code can only run inside async functions as it uses await
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    // Getting cookies from request headers - all requests have cookies on them
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    event.locals.user = cookies;
    console.log("handle - Cookies: ", cookies);

    // If there are no cookies, the user is not authenticated
    if (!cookies.session_id) {
        event.locals.user.authenticated = false;
    }

    // Searching DB for the user with the right cookie
    // All database code can only run inside async functions as it uses await
    const userSession = await db.collection('cookies').findOne({ cookieId: cookies.session_id });
    // console.log("userSession: ", userSession);

    // If there is that user, authenticate him and pass his email to context
    if (userSession) {
        event.locals.user.authenticated = true;
        event.locals.user.email = userSession.email;
    } else {
        event.locals.user.authenticated = false;
    }

    const response = await resolve(event);

    return response
};


// This function takes the request object and returns a session object that is accessible 
// on the client and therefore must be safe to expose to users. It runs whenever 
// SvelteKit server-renders a page.
// Sets session on client-side
// try console logging session in routes' load({ session }) functions
export const getSession = async(event) => {
    // Pass cookie with authenticated & email properties to session
    return event.locals.user ? {
        user: {
            authenticated: true,
            email: event.locals.user.email
        }
    } : {};
};