import {communityWeek,ProgramId} from './catalog';
import {prependReentry,ProgramWeek,EntryLog} from "./reentry";
import later from "./hulkerz.json";
export const program=prependReentry(later as Omit<ProgramWeek,"week">[]);
export function getProgramWeek(week:number,id:ProgramId='at-home-ppl'):ProgramWeek {
 if(!Number.isSafeInteger(week)||week<1)throw new Error('Choose a positive training week.');
 if(id!=='at-home-ppl')return communityWeek(week,id);
 return program[week-1]??{...program[program.length-1],week,title:'Ongoing PPLPPL'};
}
export const sourceUrl="https://www.boostcamp.app/users/ImldmW-hulkerz-ppl";
export function nextWorkout(logs:EntryLog[],id:ProgramId='at-home-ppl'){
 const draft=logs.filter(l=>!l.finishedAt).sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt))[0];
 if(draft)return {week:draft.week,slot:draft.slot};
 const week=Math.max(1,...logs.map(l=>l.week)),plan=getProgramWeek(week,id);
 const slot=plan.days.findIndex((_,i)=>!logs.some(l=>l.week===week&&l.slot===i&&l.finishedAt));
 return slot<0?{week:week+1,slot:0}:{week,slot};
}
