import {NextResponse} from 'next/server';
import {isAdmin} from '../../../../lib/server/adminAuth';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({authenticated:await isAdmin()})}
