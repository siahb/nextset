import {EntryLog} from './reentry';
export function calendarWeek(date:Date){const d=new Date(date);d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function trainingSummary(logs:EntryLog[],now=new Date()){
 const complete=logs.filter(l=>l.finishedAt).sort((a,b)=>Date.parse(a.finishedAt!)-Date.parse(b.finishedAt!));
 const key=calendarWeek(now),thisWeek=complete.filter(l=>calendarWeek(new Date(l.finishedAt!))===key);
 const volumeKg=(l:EntryLog)=>l.exercises.filter(e=>e.name!=='Plank').reduce((a,e)=>a+e.sets.filter(s=>s.done).reduce((b,s)=>b+s.weight*s.reps*(l.unit==='lb'?.45359237:1),0),0);
 const best=new Map<string,{weight:number;reps:number}>(),records:{name:string;weight:number;reps:number;unit:string;date:string}[]=[];
 for(const l of complete)for(const e of l.exercises){if(e.name==='Plank')continue;const id=e.name.toLowerCase().replace(/\([^)]*\)/g,'').replace(/barbell|dumbbell|weighted/g,'').replace(/[^a-z]/g,'');const sets=e.sets.filter(s=>s.done&&s.weight>0);if(!sets.length)continue;const top=sets.reduce((a,b)=>b.weight>a.weight||(b.weight===a.weight&&b.reps>a.reps)?b:a),kg=top.weight*(l.unit==='lb'?.45359237:1),old=best.get(id);if(old&&(kg>old.weight+.001||(Math.abs(kg-old.weight)<.001&&top.reps>old.reps)))records.push({name:e.name,weight:top.weight,reps:top.reps,unit:l.unit,date:l.finishedAt!});if(!old||kg>old.weight||(Math.abs(kg-old.weight)<.001&&top.reps>old.reps))best.set(id,{weight:kg,reps:top.reps});}
 const weeks=new Set(complete.map(l=>calendarWeek(new Date(l.finishedAt!))));let cursor=new Date(now),streak=0;if(!weeks.has(calendarWeek(cursor)))cursor.setDate(cursor.getDate()-7);while(weeks.has(calendarWeek(cursor))){streak++;cursor.setDate(cursor.getDate()-7);}
 const muscles:Record<string,number>={Chest:0,Shoulders:0,Back:0,Arms:0,Quads:0,Hamstrings:0,Calves:0,Core:0};
 for(const l of thisWeek)for(const e of l.exercises){const name=e.name.toLowerCase();const muscle=/plank|ab wheel/.test(name)?'Core':/calf/.test(name)?'Calves':/romanian|deadlift/.test(name)?'Hamstrings':/squat|lunge/.test(name)?'Quads':/curl/.test(name)?'Arms':/overhead|lateral|face pull/.test(name)?'Shoulders':/row|pull.?up|shrug/.test(name)?'Back':'Chest';muscles[muscle]+=e.sets.filter(s=>s.done).length;}
 const previous=new Date(now);previous.setDate(previous.getDate()-7);const lastWeek=complete.filter(l=>calendarWeek(new Date(l.finishedAt!))===calendarWeek(previous));
 return {thisWeek,volumeKg:thisWeek.reduce((n,l)=>n+volumeKg(l),0),records,weekPRs:records.filter(r=>calendarWeek(new Date(r.date))===key),streak,muscles,lastWeekCount:lastWeek.length};
}
