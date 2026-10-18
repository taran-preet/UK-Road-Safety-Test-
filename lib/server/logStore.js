import clientPromise from './db.js';

async function col() {
  const client = await clientPromise;
  return client.db('hazard').collection('test_results');
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
  const exists = await c.findOne({ sessionId: r.sessionId });
  if (exists) return { duplicate: true };
  await c.insertOne({
    ...r,
    status: 'Completed',
    createdAt: new Date(),
  });
  return { duplicate: false };
}
