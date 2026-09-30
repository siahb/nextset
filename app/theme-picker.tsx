'use client';
import {useEffect,useState} from 'react';
type Appearance='system'|'light'|'dark';
export default function ThemePicker(){
 const [value,setValue]=useState<Appearance>('system');
 useEffect(()=>{const sync=()=>{const p=document.documentElement.dataset.theme;setValue(p==='light'||p==='dark'?p:'system');};sync();const listener=(event:StorageEvent)=>{if(event.key==='nextset-appearance'){document.documentElement.dataset.theme=event.newValue==='light'||event.newValue==='dark'?event.newValue:'system';sync();}};window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);},[]);
 return <label className="appearance-picker"><span>Appearance</span><select aria-label="Appearance" value={value} onChange={event=>{const p=event.target.value as Appearance;setValue(p);document.documentElement.dataset.theme=p;try{localStorage.setItem('nextset-appearance',p);}catch{}}}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
