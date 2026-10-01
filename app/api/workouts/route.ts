import {customId,CustomProgram} from '../../../lib/custom-program';
import {isProgramId,programIds} from '../../../lib/catalog';
import {getTrainingUser as userFor} from '../../training-user';
import {database} from '../../../db/raw';
import {getProgramWeek} from '../../../lib/program';
import {z} from 'zod';
export const dynamic='force-dynamic';
const logSchema=z.object({programId:z.string().max(80).default('at-home-ppl'),week:z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),slot:z.number().int().min(0).max(6),day:z.string().trim().min(1).max(50),unit:z.enum(['lb','kg']),startedAt:z.string().datetime(),finishedAt:z.string().datetime().nullable(),exercises:z.array(z.object({id:z.string().max(80),name:z.string().max(100),measurement:z.enum(['reps','seconds']).optional(),sets:z.array(z.object({weight:z.number().finite().min(0).max(2000),reps:z.number().int().min(0).max(3600),rir:z.number().int().min(0).max(10).nullable(),goodForm:z.boolean(),done:z.boolean()})).min(1).max(10)})).min(1).max(20)});
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 try{const programId=new URL(request.url).searchParams.get('programId')??'at-home-ppl';if(!isProgramId(programId)&&!customId.safeParse(programId).success)return json({error:'Unknown program.'},400);const user=await userFor(request);if(!user)return json({error:'Sign in to save your training.'},401);if(!isProgramId(programId)){const own=await database().prepare('SELECT 1 AS found FROM custom_programs WHERE user_id = ? AND program_id = ?').bind(user.userId,programId).first();if(!own)return json({error:'Program not found.'},404);}const rows=programId==='at-home-ppl'?await database().prepare('SELECT payload FROM workout_logs WHERE user_id = ? ORDER BY week, slot').bind(user.userId).all<{payload:string}>():await database().prepare('SELECT payload FROM program_workout_logs WHERE user_id = ? AND program_id = ? ORDER BY week, slot').bind(user.userId,programId).all<{payload:string}>();return json({logs:rows.results.map(r=>JSON.parse(r.payload)),name:user.fullName??'Your training'});}catch(e){console.error('Load workouts failed',e);return json({error:'Could not load your workouts. Please retry.'},503);}
}
export async function PUT(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 try{
 const user=await userFor(request);if(!user)return json({error:'Sign in to save your training.'},401);
 const parsed=logSchema.safeParse(await request.json());if(!parsed.success)return json({error:'Check your sets, weights, reps, and RIR.'},400);
 const log=parsed.data;let custom:CustomProgram[]=[];
 if(!isProgramId(log.programId)){const own=await database().prepare('SELECT definition FROM custom_programs WHERE user_id = ? AND program_id = ?').bind(user.userId,log.programId).first<{definition:string}>();if(!own)return json({error:'Program not found.'},404);custom=[{...JSON.parse(own.definition),id:log.programId}];}
 const workout=getProgramWeek(log.week,log.programId,custom).days[log.slot],expected=workout?.exercises;
 if(!expected||workout.day!==log.day||log.exercises.length!==expected.length||expected.some((e,i)=>log.exercises[i].id!==e.id||log.exercises[i].sets.length!==e.sets||(!e.core&&!e.variants&&log.exercises[i].name!==e.name)||(e.variants&&!e.variants.some(v=>v.name===log.exercises[i].name))||(e.core&&!['Plank','Ab Wheel'].includes(log.exercises[i].name))))return json({error:'The workout must match your program.'},400);
 for(const [i,e] of log.exercises.entries()){const plan=expected[i];const variant=plan.variants?.find(v=>v.name===e.name);e.measurement=(e.name==='Plank'||(variant?.unit??plan.targets?.[0]?.unit)==='seconds')?'seconds':'reps';}
 if(log.finishedAt&&!log.exercises.every(e=>e.sets.every(s=>s.done&&s.reps>0&&(log.programId!=='at-home-ppl'||log.week>2||s.rir!==null))))return json({error:'Complete every set and record RIR before finishing, or save your progress.'},400);
 if(log.programId!=='at-home-ppl'){await database().prepare('INSERT INTO program_workout_logs (user_id,program_id,week,slot,payload,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(user_id,program_id,week,slot) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at').bind(user.userId,log.programId,log.week,log.slot,JSON.stringify(log),new Date().toISOString()).run();return json({saved:true});}
 await database().prepare('INSERT INTO workout_logs (user_id, week, slot, payload, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, week, slot) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at').bind(user.userId,log.week,log.slot,JSON.stringify(log),new Date().toISOString()).run();return json({saved:true});
 }catch(e){if(e instanceof SyntaxError)return json({error:'Invalid workout data.'},400);console.error('Save workouts failed',e);return json({error:'Could not save. Your entries are still here; please retry.'},503);}
}
