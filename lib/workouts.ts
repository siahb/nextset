export type Day='Push'|'Pull'|'Legs';
export type Exercise={id:string;name:string;sets:number;reps:string};
export type Routines=Record<Day,Exercise[]>;
export type LoggedSet={weight:number;reps:number;done:boolean};
export type Session={id:string;day:Day;date:string;duration:number;unit:'lb'|'kg';exercises:{id:string;name:string;sets:LoggedSet[]}[]};
export const days:Day[]=['Push','Pull','Legs'];
export const defaults:Routines={Push:[{id:'press',name:'Dumbbell bench press',sets:3,reps:'8–12'},{id:'shoulder',name:'Shoulder press',sets:3,reps:'8–12'},{id:'lateral',name:'Lateral raise',sets:3,reps:'12–15'},{id:'triceps',name:'Triceps extension',sets:3,reps:'10–15'}],Pull:[{id:'row',name:'Dumbbell row',sets:3,reps:'8–12'},{id:'pullup',name:'Pull-up or assisted pull-up',sets:3,reps:'6–10'},{id:'rear',name:'Rear delt fly',sets:3,reps:'12–15'},{id:'curl',name:'Dumbbell curl',sets:3,reps:'10–15'}],Legs:[{id:'squat',name:'Goblet squat',sets:3,reps:'8–12'},{id:'rdl',name:'Romanian deadlift',sets:3,reps:'8–12'},{id:'lunge',name:'Reverse lunge',sets:3,reps:'8–12'},{id:'calf',name:'Calf raise',sets:3,reps:'12–20'}]};
export const volume=(s:Session)=>s.exercises.reduce((a,e)=>a+e.sets.filter(x=>x.done).reduce((b,x)=>b+x.weight*x.reps,0),0);
