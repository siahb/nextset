import type {CustomProgram} from './custom-program';
import {communityWeek,ProgramId} from './catalog';
import {prependReentry,ProgramWeek,EntryLog} from "./reentry";
import later from "./hulkerz.json";
import {recommendedWeek} from './recommended-routine';
import {bodyweightWeek} from './bodyweight-full-body';
export const program=prependReentry(later as Omit<ProgramWeek,"week">[]);
export function getProgramWeek(week:number,id:ProgramId='at-home-ppl',custom:CustomProgram[]=[]):ProgramWeek {
 if(!Number.isSafeInteger(week)||week<1)throw new Error('Choose a positive training week.');
 if(id==='recommended-routine')return recommendedWeek(week);
 if(id==='bodyweight-full-body')return bodyweightWeek(week);
 const own=custom.find(p=>p.id===id);if(own)return {week,title:own.name,days:own.days.map(d=>({day:d.label,exercises:d.exercises.map(e=>({id:e.id,name:e.name,sets:e.sets,min:e.min,max:e.max,restSeconds:e.restSeconds,targets:Array.from({length:e.sets},()=>({min:e.min,max:e.max,unit:e.unit}))}))}))};
 if(id==='basic-beginner'||id==='dumbbell-stopgap')return communityWeek(week,id);
 if(id!=='at-home-ppl')throw Error('Program not found.');
 return program[week-1]??{...program[program.length-1],week,title:'Ongoing PPLPPL'};
}
export const sourceUrl="https://www.boostcamp.app/users/ImldmW-hulkerz-ppl";
export function nextWorkout(logs:EntryLog[],id:ProgramId='at-home-ppl',custom:CustomProgram[]=[]){
 const draft=logs.filter(l=>!l.finishedAt).sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt))[0];
 if(draft)return {week:draft.week,slot:draft.slot};
 const week=Math.max(1,...logs.map(l=>l.week)),plan=getProgramWeek(week,id,custom);
 const slot=plan.days.findIndex((_,i)=>!logs.some(l=>l.week===week&&l.slot===i&&l.finishedAt));
 return slot<0?{week:week+1,slot:0}:{week,slot};
}
