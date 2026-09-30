import {getTrainingUser} from '../../training-user';
import {database} from '../../../db/raw';
import {z} from 'zod';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const schema=z.object({programIds:z.array(z.literal('at-home-ppl')).max(1)});
export async function GET(request:Request){try{
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to commit to a program.'},401);
 const row=await database().prepare('SELECT program_ids FROM training_profiles WHERE user_id = ?').bind(user.userId).first<{program_ids:string}>();
 const existing=await database().prepare('SELECT 1 AS found FROM workout_logs WHERE user_id = ? LIMIT 1').bind(user.userId).first();
 return json({programIds:row?JSON.parse(row.program_ids):existing?['at-home-ppl']:[]});
}catch{return json({error:'Could not load your programs. Please retry.'},503);}}
export async function PUT(request:Request){try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to commit to a program.'},401);
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return json({error:'Choose an available program.'},400);
 await database().prepare('INSERT INTO training_profiles (user_id,program_ids,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET program_ids=excluded.program_ids,updated_at=excluded.updated_at').bind(user.userId,JSON.stringify(parsed.data.programIds),new Date().toISOString()).run();return json({saved:true});
}catch{return json({error:'Could not save your programs. Please retry.'},503);}}
