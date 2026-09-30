import {prependReentry,ProgramWeek} from "./reentry";
import later from "./hulkerz.json";
export const program=prependReentry(later as Omit<ProgramWeek,"week">[]);
export function getProgramWeek(week:number):ProgramWeek {
 if(!Number.isSafeInteger(week)||week<1)throw new Error('Choose a positive training week.');
 return program[week-1]??{...program[program.length-1],week,title:'Ongoing PPLPPL'};
}
export const sourceUrl="https://www.boostcamp.app/users/ImldmW-hulkerz-ppl";
