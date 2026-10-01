import {getTrainingUser} from '../../training-user';
import {database} from '../../../db/raw';
import {customDefinition,customId} from '../../../lib/custom-program';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){try{
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to load your programs.'},401);
 const rows=await database().prepare('SELECT program_id,definition FROM custom_programs WHERE user_id = ? ORDER BY updated_at DESC').bind(user.userId).all<{program_id:string;definition:string}>();
 return json({programs:rows.results.map(r=>({...JSON.parse(r.definition),id:r.program_id}))});
}catch{return json({error:'Could not load your custom programs.'},503);}}
export async function PUT(request:Request){try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to save a program.'},401);
 const text=await request.text();if(text.length>100000)return json({error:'Program is too large.'},400);
 const raw=JSON.parse(text),parsed=customDefinition.safeParse(raw);if(!parsed.success)return json({error:parsed.error.issues[0]?.message??'Check your program.'},400);
 const id=raw.id??'custom-'+crypto.randomUUID();if(!customId.safeParse(id).success)return json({error:'Invalid program ID.'},400);
 const existing=await database().prepare('SELECT 1 AS found FROM custom_programs WHERE user_id = ? AND program_id = ?').bind(user.userId,id).first();
 if(raw.id&&!existing)return json({error:'Program not found.'},404);
 if(existing){const logs=await database().prepare('SELECT 1 AS found FROM program_workout_logs WHERE user_id = ? AND program_id = ? LIMIT 1').bind(user.userId,id).first();if(logs)return json({error:'This program already has training logs. Duplicate it to change the schedule and preserve your history.'},409);}
 else{const count=await database().prepare('SELECT COUNT(*) AS count FROM custom_programs WHERE user_id = ?').bind(user.userId).first<{count:number}>();if((count?.count??0)>=20)return json({error:'You can save up to 20 custom programs.'},400);}
 await database().prepare('INSERT INTO custom_programs (user_id,program_id,definition,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,program_id) DO UPDATE SET definition=excluded.definition,updated_at=excluded.updated_at').bind(user.userId,id,JSON.stringify(parsed.data),new Date().toISOString()).run();
 return json({program:{...parsed.data,id}});
}catch(e){if(e instanceof SyntaxError)return json({error:'Invalid program data.'},400);return json({error:'Could not save your program. Check the fields and retry.'},503);}}
