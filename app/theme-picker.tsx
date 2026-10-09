'use client';
import {useEffect,useState} from 'react';
type Appearance='light'|'dark';
export default function ThemePicker(){
 const [value,setValue]=useState<Appearance>('light');
 useEffect(()=>{
  const sync=()=>setValue(document.documentElement.dataset.theme==='dark'?'dark':'light');
  sync();const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  return()=>observer.disconnect();
 },[]);
 return <button type="button" className="sv-theme-control" aria-label={value==='dark'?'Switch to light mode':'Switch to dark mode'} aria-pressed={value==='dark'} onClick={()=>{
  const choice:Appearance=value==='dark'?'light':'dark';
  (window as unknown as {SiahverseTheme:{set:(value:Appearance)=>void}}).SiahverseTheme.set(choice);setValue(choice);
 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{marginRight:6}}>{value==='dark'?<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>:<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>}</svg>{value==='dark'?'Dark':'Light'}</button>;
}
