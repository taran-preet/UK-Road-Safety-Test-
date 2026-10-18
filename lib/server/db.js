import { MongoClient } from 'mongodb';

export default function getClientPromise() {
  if (globalThis._mongoClientPromise) return globalThis._mongoClientPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  globalThis._mongoClientPromise = new MongoClient(uri).connect();
  return globalThis._mongoClientPromise;
}
