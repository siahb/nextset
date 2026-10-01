import {programIds} from '../../../lib/catalog';
import {getTrainingUser} from '../../training-user';
import {database} from '../../../db/raw';
import {z} from 'zod';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const schema=z.object({agreement:z.string().optional(),programIds:z.array(z.string().max(80)).max(24).refine(ids=>new Set(ids).size===ids.length)});
export async function GET(request:Request){try{
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to commit to a program.'},401);
 const row=await database().prepare('SELECT program_ids FROM training_profiles WHERE user_id = ?').bind(user.userId).first<{program_ids:string}>();
 const existing=await database().prepare('SELECT 1 AS found FROM workout_logs WHERE user_id = ? LIMIT 1').bind(user.userId).first();
 const customs=await database().prepare('SELECT program_id,definition FROM custom_programs WHERE user_id = ? ORDER BY updated_at DESC').bind(user.userId).all<{program_id:string;definition:string}>();
 return json({programIds:row?JSON.parse(row.program_ids):existing?['at-home-ppl']:[],customPrograms:customs.results.map(r=>({...JSON.parse(r.definition),id:r.program_id}))});
}catch{return json({error:'Could not load your programs. Please retry.'},503);}}
export async function PUT(request:Request){try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 const user=await getTrainingUser(request);if(!user)return json({error:'Sign in to commit to a program.'},401);
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return json({error:'Choose an available program.'},400);
 const customs=await database().prepare('SELECT program_id FROM custom_programs WHERE user_id = ?').bind(user.userId).all<{program_id:string}>();
 const available=new Set<string>([...programIds,...customs.results.map(p=>p.program_id)]);
 if(parsed.data.programIds.some(id=>!available.has(id)))return json({error:'Choose one of your available programs.'},400);
 const previous=await database().prepare('SELECT program_ids FROM training_profiles WHERE user_id = ?').bind(user.userId).first<{program_ids:string}>();
 const existing=await database().prepare('SELECT 1 AS found FROM workout_logs WHERE user_id = ? LIMIT 1').bind(user.userId).first();
 const oldIds:string[]=previous?JSON.parse(previous.program_ids):existing?['at-home-ppl']:[];
 if(parsed.data.programIds.some(id=>!oldIds.includes(id))&&parsed.data.agreement?.trim().toLowerCase()!=='i agree')return json({error:'Read the commitment and type I agree.'},400);
 await database().prepare('INSERT INTO training_profiles (user_id,program_ids,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET program_ids=excluded.program_ids,updated_at=excluded.updated_at').bind(user.userId,JSON.stringify(parsed.data.programIds),new Date().toISOString()).run();return json({saved:true});
}catch{return json({error:'Could not save your programs. Please retry.'},503);}}
