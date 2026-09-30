'use client';
import {createClient} from '@supabase/supabase-js';
import {accountUrl,accountKey} from './email-config';
let client:ReturnType<typeof createClient>|undefined;
export function emailClient(){return client??=createClient(accountUrl,accountKey,{auth:{storageKey:'nextset-email-account',flowType:'implicit'}});}
export async function trainingFetch(url:string,init:RequestInit={}){
 const {data:{session}}=await emailClient().auth.getSession();
 const headers=new Headers(init.headers);if(session)headers.set('Authorization',`Bearer ${session.access_token}`);
 return fetch(url,{...init,headers,cache:'no-store'});
}
