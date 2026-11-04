'use client';
import { useEffect } from 'react';
export default function MotionPreferences(){
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const connection=navigator.connection;
    const update=()=>document.documentElement.classList.toggle('limited-motion',Boolean(preference.matches||connection?.saveData||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4)));
    const visibility=()=>document.documentElement.classList.toggle('page-hidden',document.hidden);
    update();visibility();preference.addEventListener('change',update);connection?.addEventListener?.('change',update);document.addEventListener('visibilitychange',visibility);
    return()=>{preference.removeEventListener('change',update);connection?.removeEventListener?.('change',update);document.removeEventListener('visibilitychange',visibility);};
  },[]);return null;
}
