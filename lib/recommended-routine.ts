import type {EntryExercise,ProgramWeek} from './reentry';
const variants=(names:string[],min=5,max=8,unit='reps')=>names.map(name=>({name,min,max,unit}));
const exercise=(id:string,choices:ReturnType<typeof variants>,group:string,restSeconds:number):EntryExercise=>({id,name:choices[0].name,sets:3,min:choices[0].min,max:choices[0].max,variants:choices,group,restSeconds,targets:Array.from({length:3},()=>({...choices[0]}))});
export function recommendedWeek(week:number):ProgramWeek{
 const exercises=[
  exercise('rr-pull',variants(['Scapular Pull','Negative Pull-Up','Pull-Up','Weighted Pull-Up']),'Pair 1',90),
  exercise('rr-squat',variants(['Assisted Squat','Bodyweight Squat','Split Squat','Bulgarian Split Squat','Beginner Shrimp Squat','Intermediate Shrimp Squat','Advanced Shrimp Squat','Weighted Shrimp Squat']),'Pair 1',90),
  exercise('rr-dip',[...variants(['Parallel Bar Support Hold'],10,60,'seconds'),...variants(['Negative Dip','Parallel Bar Dip','Weighted Dip'])],'Pair 2',90),
  exercise('rr-hinge',variants(['Bodyweight Romanian Deadlift','Single-Leg Deadlift','Banded Nordic Curl Negative','Banded Nordic Curl','Nordic Curl']),'Pair 2',90),
  exercise('rr-row',variants(['Vertical Row','Incline Row','Horizontal Row','Wide Row','Weighted Inverted Row']),'Pair 3',90),
  exercise('rr-push',variants(['Wall Push-Up','Incline Push-Up','Push-Up','Diamond Push-Up','Pseudo Planche Push-Up']),'Pair 3',90),
  exercise('rr-extension',[...variants(['Plank'],10,30,'seconds'),...variants(['Ring Ab Rollout','Kneeling Ab Wheel','Standing Ab Wheel'],8,12)],'Core triplet',60),
  exercise('rr-rotation',variants(['Banded Pallof Press'],8,12),'Core triplet',60),
  exercise('rr-back',variants(['Reverse Hyperextension','Arch Raise'],8,12),'Core triplet',60)
 ];
 return {week,title:'Recommended Routine',days:Array.from({length:3},()=>({day:'Full Body',exercises:structuredClone(exercises)}))};
}
