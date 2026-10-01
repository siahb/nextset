import {build} from 'esbuild';
import assert from 'node:assert/strict';

const built=await build({entryPoints:['app/training-user.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {getTrainingUser}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const original=globalThis.fetch;
let calls=0;
globalThis.fetch=async()=>{calls++;return Response.json({id:'verified-user',email:'test@example.invalid',email_confirmed_at:'2026-10-01T00:00:00Z'});};
try {
 assert.equal(await getTrainingUser(new Request('https://nextset.test',{headers:{'oai-authenticated-user-id':'forged','oai-authenticated-user-email':'owner@example.invalid'}})),null);
 assert.equal(calls,0);
 assert.equal((await getTrainingUser(new Request('https://nextset.test',{headers:{authorization:'Bearer test-token'}}))).userId,'email:verified-user');
 globalThis.fetch=async()=>Response.json({error:'Invalid token'},{status:401});
 assert.equal(await getTrainingUser(new Request('https://nextset.test',{headers:{authorization:'Bearer invalid'}})),null);
 globalThis.fetch=async()=>Response.json({id:'unconfirmed',email:'test@example.invalid'});
 assert.equal(await getTrainingUser(new Request('https://nextset.test',{headers:{authorization:'Bearer unconfirmed'}})),null);
 console.log('Authentication passed: forged Sites headers denied, verified email identity required.');
} finally {globalThis.fetch=original;}
