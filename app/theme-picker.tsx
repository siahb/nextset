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
 return <label className="appearance-picker"><span>Appearance</span><select aria-label="Appearance" value={value} onChange={event=>{
  const choice=event.target.value as Appearance;
  const theme=(window as unknown as {SiahverseTheme:{set:(value:Appearance)=>void}}).SiahverseTheme;
  theme.set(choice);setValue(choice);
 }}><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
