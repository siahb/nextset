'use client';
import type {SupabaseClient} from '@supabase/supabase-js';
import './shared-account';
export function emailClient(){return (window as unknown as {SiahverseAccount:{auth:SupabaseClient['auth']}}).SiahverseAccount;}
export async function trainingFetch(url:string,init:RequestInit={}){
 const {data:{session},error}=await emailClient().auth.getSession();
 if(error)throw error;
 const headers=new Headers(init.headers);if(session)headers.set('Authorization',`Bearer ${session.access_token}`);
 return fetch(url,{...init,headers,cache:'no-store'});
}
