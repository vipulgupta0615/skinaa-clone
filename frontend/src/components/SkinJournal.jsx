'use client';
import { useEffect, useState } from 'react';
export default function SkinJournal() {
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem('skinaa-journal') || '[]'); if (Array.isArray(saved)) setEntries(saved.slice(0, 12)); } catch {} }, []);
  function save(event) {
    event.preventDefault();
    const next = [{ date: new Date().toISOString(), note: note.trim() }, ...entries].slice(0, 12);
    try { localStorage.setItem('skinaa-journal', JSON.stringify(next)); setEntries(next); setNote(''); setStatus('Check-in saved on this device.'); } catch { setStatus('Your browser could not save this check-in.'); }
  }
  return <section className="section skin-journal"><div><p className="eyebrow">A LITTLE SPACE TO REFLECT</p><h2>Your skin diary.<br/><em>At your own pace.</em></h2><p className="body-copy">Notice how your routine fits your day. Keep a short note about comfort, texture or consistency, then return to reflect.</p><p className="shop-note">Notes stay in this browser on this device. They are not uploaded or used for recommendations. Avoid adding identifying information on a shared device.</p></div><div><form onSubmit={save}><label htmlFor="skin-check-in">How did your routine feel today?</label><textarea id="skin-check-in" required maxLength={280} value={note} onChange={event=>setNote(event.target.value)} placeholder="A small observation, in your own words…"/><button className="button dark" disabled={!note.trim()}>Save my check-in →</button><p role="status">{status}</p></form><ol>{entries.map((entry,index)=><li key={`${entry.date}-${index}`}><time dateTime={entry.date}>{new Date(entry.date).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}</time><p>{entry.note}</p><button onClick={()=>{ const next=entries.filter((_,i)=>i!==index); try { localStorage.setItem('skinaa-journal',JSON.stringify(next)); setEntries(next);setStatus('Check-in removed.'); } catch {setStatus('Could not remove this check-in.');} }}>Remove check-in</button></li>)}</ol>{!entries.length&&<p>Your first check-in starts your story. Up to 12 recent notes are kept.</p>}</div></section>;
}
