import {getChatGPTUser} from '../../../chatgpt-auth';
import {getEmailUser} from '../../../email-auth';
import {database} from '../../../../db/raw';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Invalid request origin.'},403);
 try{
  const email=await getEmailUser(request),legacy=await getChatGPTUser();
  if(!email||!legacy)return json({error:'Sign in to your email account and your previous NextSet account to import.'},401);
  if(email.email.toLowerCase()!==legacy.email.toLowerCase())return json({error:'Use the same verified email as your previous account.'},403);
  await database().prepare('INSERT OR IGNORE INTO workout_logs (user_id,week,slot,payload,updated_at) SELECT ?,week,slot,payload,updated_at FROM workout_logs WHERE user_id = ?').bind(email.userId,legacy.userId).run();
  return json({imported:true});
 }catch{return json({error:'Could not import your previous workouts. Please retry.'},503);}
}
