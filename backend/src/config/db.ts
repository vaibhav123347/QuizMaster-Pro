import dns from 'node:dns';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let listenersAttached = false;
let memoryServer: MongoMemoryServer | null = null;

export const isValidMongoUri = (uri: string): boolean => {
  return /^mongodb(\+srv)?:\/\/.+/.test(uri.trim());
};

export const connectDatabase = async (uriOverride?: string): Promise<typeof mongoose> => {
  let uri = (uriOverride ?? env.mongodbUri).trim();

  if (!uri && env.nodeEnv !== 'production') {
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('[MongoDB] Starting an isolated local development database.');
  }

  if (!isValidMongoUri(uri)) {
    if (!uri) {
      throw new Error('MongoDB connection string (MONGODB_URI) is empty.');
    }
    throw new Error(
      'Invalid MONGODB_URI format. Expected a connection string starting with mongodb:// or mongodb+srv://.'
    );
  }

  if (!listenersAttached) {
    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      if (env.nodeEnv !== 'test') {
        console.warn('[MongoDB] Disconnected from database.');
      }
    });
    listenersAttached = true;
  }

  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);

const conn = await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});
    return conn;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown connection error';
    throw new Error(`Failed to connect to MongoDB Atlas: ${message}`);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
