import type {EntryExercise,ProgramWeek} from './reentry';

type Variation=NonNullable<EntryExercise['variants']>[number];
const reps=(name:string,min:number,max:number):Variation=>({name,min,max,unit:'reps'});
const exercise=(id:string,choices:Variation[],sets:number,restSeconds:number,instructions:string):EntryExercise=>({
 id,name:choices[0].name,sets,min:choices[0].min,max:choices[0].max,
 variants:choices,restSeconds,instructions,targets:Array.from({length:sets},()=>({...choices[0]})),
});

export function bodyweightWeek(week:number):ProgramWeek{
 const mainSets=week<=2?2:3;
 const exercises=[
  exercise('bw-push',[reps('Push-Up',6,12),reps('Knee Push-Up',6,12),reps('Wall Push-Up',8,15),reps('Close-Grip Push-Up',6,12)],mainSets,90,'Keep a straight trunk and lower under control. Choose knee or wall push-ups if you cannot keep 3–4 reps in reserve.'),
  exercise('bw-squat',[reps('Bodyweight Squat',8,15),reps('Split Squat',6,12)],mainSets,90,'Use a comfortable depth with heels grounded. For split squats, do both sides; enter reps per side once, using the lower count.'),
  exercise('bw-pull',[reps('Pull-Up',3,6),reps('Chin-Up',3,6),reps('Scapular Pull',5,8)],mainSets,120,'Use a securely mounted bar. No swinging. Scapular pulls are shoulder-blade practice with straight arms, not full pull-up repetitions; choose them if full pulls are currently too difficult.'),
  exercise('bw-bridge',[reps('Glute Bridge',10,20),reps('Single-Leg Glute Bridge',8,12)],2,60,'Press through your heels without arching your lower back. For single-leg bridges, do both sides and log reps per side once.'),
  exercise('bw-calf',[reps('Bodyweight Calf Raise',12,20),reps('Single-Leg Calf Raise',8,15)],2,60,'Raise and lower your heels slowly on flat ground. Lightly touch a wall for balance if needed. For single-leg reps, train both sides and log the lower count once.'),
  exercise('bw-core',[reps('Dead Bug',6,10),{name:'Knee Plank',min:15,max:30,unit:'seconds'},{name:'Plank',min:15,max:30,unit:'seconds'}],2,60,'For dead bugs, alternate sides while keeping your lower back steady; log reps per side once. For planks, enter seconds and stop before your position breaks down.'),
 ];
 return {week,title:week<=2?'Bodyweight re-entry':'Full-body bodyweight',days:Array.from({length:3},()=>({day:'Full Body',exercises:structuredClone(exercises)}))};
}
