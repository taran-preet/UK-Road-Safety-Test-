import { MongoClient } from 'mongodb';
const URI = process.env.MONGODB_URI;
const DB = 'hazard_admin', COL = 'test_results';
let client;
async function getCol() {
  if (!client) { client = new MongoClient(URI); await client.connect(); }
  return client.db(DB).collection(COL);
}
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hms = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export async function readAll() {
  try {
    const col = await getCol();
    const docs = await col.find({}).sort({ completedAt: -1 }).toArray();
    const records = docs.map(d => ({
      sessionId: d.sessionId, name: d.name, date: d.date,
      startTime: d.startTime, completionTime: d.completionTime,
      duration: d.duration, score: d.score, hits: d.hits,
      misses: d.misses, total: d.total, pct: d.pct,
      status: d.status || 'Completed',
      startedAt: d.startedAt || null, completedAt: d.completedAt || null,
    }));
    return { records, malformed: 0 };
  } catch { return { records: [], malformed: 0 }; }
}

export async function appendResult(r) {
  const col = await getCol();
  const exists = await col.findOne({ sessionId: r.sessionId });
  if (exists) return { duplicate: true };
  const s = new Date(r.startedAt), c = new Date(r.completedAt);
  await col.insertOne({
    sessionId: r.sessionId, name: r.name, date: ymd(c),
    startTime: hms(s), completionTime: hms(c), duration: r.duration,
    score: r.score, hits: r.hits, misses: r.misses, total: r.total,
    pct: r.pct, status: 'Completed',
    startedAt: c.toISOString(), completedAt: c.toISOString(),
    createdAt: new Date(),
  });
  return { duplicate: false };
}
