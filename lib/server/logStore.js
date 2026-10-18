import getClientPromise from './db.js';

let indexed = false;
async function col() {
  const client = await getClientPromise();
  const c = client.db('hazard').collection('test_results');
  if (!indexed) {
    await c.createIndex({ sessionId: 1 }, { unique: true }).catch(() => {});
    indexed = true;
  }
  return c;
}

export async function readAll() {
  const c = await col();
  const docs = await c.find({}, { projection: { _id: 0 } }).sort({ completedAt: -1 }).toArray();
  const records = docs.map(r => ({
    ...r,
    pct: typeof r.pct === 'number' ? r.pct : 0,
    status: r.status || 'Completed',
  }));
  return { records, malformed: 0 };
}

export async function appendResult(r) {
  const c = await col();
  try {
    await c.insertOne({ ...r, status: 'Completed', createdAt: new Date() });
    return { duplicate: false };
  } catch (e) {
    if (e.code === 11000) return { duplicate: true }; // unique index violation
    throw e;
  }
}
