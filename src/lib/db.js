import { MongoClient } from 'mongodb';
import config from 'config';

export const MONGODB_URI = config.get('mongoURI');
export const MONGODB_DB = config.get('mongoDB');

if (!MONGODB_URI) {
    throw new Error('Please define the mongoURI property inside config/default.json');
}

if (!MONGODB_DB) {
    throw new Error('Please define the mongoDB property inside config/default.json');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}

export const connectToDatabase = async() => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
            return {
                client,
                db: client.db(MONGODB_DB)
            };
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}