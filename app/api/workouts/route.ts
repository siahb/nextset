import {getChatGPTUser} from '../../chatgpt-auth';
import {database} from '../../../db/raw';
import {getProgramWeek} from '../../../lib/program';
import {z} from 'zod';
export const dynamic='force-dynamic';
const logSchema=z.object({week:z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),slot:z.number().int().min(0).max(5),day:z.enum(['Push','Pull','Legs']),unit:z.enum(['lb','kg']),startedAt:z.string().datetime(),finishedAt:z.string().datetime().nullable(),exercises:z.array(z.object({id:z.string().max(80),name:z.string().max(100),sets:z.array(z.object({weight:z.number().finite().min(0).max(2000),reps:z.number().int().min(0).max(3600),rir:z.number().int().min(0).max(10).nullable(),goodForm:z.boolean(),done:z.boolean()})).min(1).max(10)})).min(1).max(20)});
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 const user=await getChatGPTUser();if(!user)return json({error:'Sign in to save your training.'},401);
 try{const rows=await database().prepare('SELECT payload FROM workout_logs WHERE user_id = ? ORDER BY week, slot').bind(user.userId).all<{payload:string}>();return json({logs:rows.results.map(r=>JSON.parse(r.payload)),name:user.fullName??'Your training'});}catch(e){console.error('Load workouts failed',e);return json({error:'Could not load your workouts. Please retry.'},503);}
}
export async function PUT(request:Request){
 const user=await getChatGPTUser();if(!user)return json({error:'Sign in to save your training.'},401);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 try{
 const parsed=logSchema.safeParse(await request.json());if(!parsed.success)return json({error:'Check your sets, weights, reps, and RIR.'},400);
 const log=parsed.data,workout=getProgramWeek(log.week).days[log.slot],expected=workout?.exercises;
 if(!expected||workout.day!==log.day||log.exercises.length!==expected.length||expected.some((e,i)=>log.exercises[i].id!==e.id||log.exercises[i].sets.length!==e.sets||(!e.core&&log.exercises[i].name!==e.name)||(e.core&&!['Plank','Ab Wheel'].includes(log.exercises[i].name))))return json({error:'The workout must match your program.'},400);
 if(log.finishedAt&&!log.exercises.every(e=>e.sets.every(s=>s.done&&s.reps>0&&(log.week>2||s.rir!==null))))return json({error:'Complete every set and record RIR before finishing, or save your progress.'},400);
 await database().prepare('INSERT INTO workout_logs (user_id, week, slot, payload, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, week, slot) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at').bind(user.userId,log.week,log.slot,JSON.stringify(log),new Date().toISOString()).run();return json({saved:true});
 }catch(e){if(e instanceof SyntaxError)return json({error:'Invalid workout data.'},400);console.error('Save workouts failed',e);return json({error:'Could not save. Your entries are still here; please retry.'},503);}
}
