import {Day,days} from './workouts';
export type EntryExercise={id:string;name:string;sets:number;min?:number;max?:number;core?:boolean;amrap?:boolean;targets?:{min:number;max:number;unit:string;intensity?:number;intensityUnit?:string}[]};
export const comeback:Record<Day,EntryExercise[]>={Push:[{id:'pushup',name:'Push-Up',sets:3,min:8,max:12},{id:'ohp',name:'Overhead Press',sets:3,min:8,max:12},{id:'dip',name:'Dip',sets:2,min:8,max:12},{id:'lateral',name:'Dumbbell Lateral Raise',sets:2,min:12,max:20}],Pull:[{id:'pullup',name:'Pull-Up',sets:3,min:6,max:10},{id:'barbell-row',name:'Barbell Row',sets:3,min:8,max:12},{id:'barbell-curl',name:'Barbell Bicep Curl',sets:2,min:10,max:15},{id:'face-pull',name:'Face Pull',sets:2,min:15,max:20}],Legs:[{id:'barbell-squat',name:'Barbell Squat',sets:3,min:8,max:12},{id:'rdl',name:'Romanian Deadlift',sets:3,min:8,max:12},{id:'barbell-lunge',name:'Barbell Lunge',sets:2,min:10,max:15},{id:'calf',name:'Standing Calf Raise',sets:2,min:12,max:20},{id:'core',name:'Plank OR Ab Wheel',sets:2,core:true}]};
export type EntrySet={weight:number;reps:number;rir:number|null;goodForm:boolean;done:boolean};
export type EntryLog={programId?:string;week:number;slot:number;day:Day|'Full Body A'|'Full Body B';unit:'lb'|'kg';startedAt:string;finishedAt:string|null;exercises:{id:string;name:string;sets:EntrySet[]}[]};
export type ProgramWeek={week:number;sourceWeek?:number;title:string;days:{day:Day|'Full Body A'|'Full Body B';exercises:EntryExercise[]}[]};
export const reentryWeeks:ProgramWeek[]=[1,2].map(week=>({week,title:'Re-entry',days:days.map(day=>({day,exercises:structuredClone(comeback[day])}))}));
export function prependReentry(laterWeeks:Omit<ProgramWeek,'week'>[]):ProgramWeek[]{return [...reentryWeeks,...laterWeeks.map((week,index)=>({...week,week:index+3}))];}
export function suggestProgress(ex:EntryExercise,previous?:EntryLog['exercises'][number]){
 if(!previous||ex.core)return null;
 const all=previous.sets.length===ex.sets&&previous.sets.every(s=>s.done&&s.reps>=(ex.max??Infinity)&&s.goodForm&&s.rir!==null&&s.rir>=3);
 return all?'Top of the range on every set, good form, and at least 3 RIR. Consider a small weight increase if you can keep 3–4 RIR. Adjust the weight yourself.':'Keep the same weight and try to add reps while keeping 3–4 RIR.';
}
export type Plate={weight:number;pairs:number};
export function calculatePlates(target:number,bar:number,plates:Plate[]){
 if(!Number.isFinite(target)||!Number.isFinite(bar)||target<bar||bar<0||target>2000)throw new Error('Target weight must be at least the bar weight and no more than 2,000.');
 const scale=100,goal=Math.round((target-bar)*scale/2),usable=plates.filter(p=>p.weight>0&&p.pairs>0).sort((a,b)=>b.weight-a.weight);
 let states=new Map<number,number[]>([[0,Array(usable.length).fill(0)]]);
 usable.forEach((p,i)=>{const next=new Map(states),v=Math.round(p.weight*scale);for(const [sum,counts] of states)for(let n=1;n<=p.pairs&&sum+n*v<=goal;n++){const total=sum+n*v,c=[...counts];c[i]=n;const old=next.get(total);if(!old||c.reduce((a,b)=>a+b,0)<old.reduce((a,b)=>a+b,0))next.set(total,c);}states=next;});
 let best=0;for(const n of states.keys())if(n>best)best=n;const counts=states.get(best)!;
 return {exact:best===goal,loaded:bar+2*best/scale,perSide:usable.map((p,i)=>({weight:p.weight,count:counts[i]})).filter(p=>p.count>0)};
}
