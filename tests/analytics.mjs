import {build} from 'esbuild';import assert from 'node:assert/strict';
const result=await build({entryPoints:['lib/analytics.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {trainingSummary}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const log=(date,weight,unit='kg',name='Barbell Squat')=>({week:1,slot:0,day:'Legs',unit,startedAt:date,finishedAt:date,exercises:[{id:'squat',name,sets:[{weight,reps:10,done:true,rir:3,goodForm:true}]}]});
const now=new Date(2026,8,30,12),s=trainingSummary([log(new Date(2026,8,23,12).toISOString(),40),log(new Date(2026,8,29,12).toISOString(),50,'kg','Squat (Barbell)')],now);
assert.equal(s.thisWeek.length,1);assert.equal(s.volumeKg,500);assert.equal(s.weekPRs.length,1);assert.equal(s.streak,2);assert.equal(s.muscles.Quads,1);
const baseline=trainingSummary([log(new Date(2026,8,29,12).toISOString(),100,'lb')],now);assert.equal(baseline.weekPRs.length,0);assert.ok(Math.abs(baseline.volumeKg-453.59237)<.001);
const draft={...log(new Date(2026,8,29,12).toISOString(),100),finishedAt:null};assert.equal(trainingSummary([draft],now).thisWeek.length,0);
assert.equal(trainingSummary([],now).streak,0);assert.equal(trainingSummary([log(new Date(2026,8,20,12).toISOString(),10)],now).streak,0);
console.log('Analytics passed: calendar weeks, streak gaps, normalized PRs, baseline exclusion, drafts, lb/kg volume');

const hold={programId:"custom-test",week:1,slot:0,day:"Core",unit:"kg",startedAt:"2026-09-30T10:00:00Z",finishedAt:"2026-09-30T10:01:00Z",exercises:[{id:"hold",name:"Side Plank",measurement:"seconds",sets:[{weight:99,reps:30,done:true,rir:null,goodForm:true}]}]};assert.equal(trainingSummary([hold],new Date("2026-09-30T12:00:00Z")).volumeKg,0);
