'use client';

import { useEffect, useState } from 'react';
import { AddToCart } from './Cart';
import { products } from '../lib/products';

const steps = [
  { id: 'cleanser', title: 'Cleanse', slug: 'vitamin-c-face-wash', icon: '◒' },
  { id: 'treat', title: 'Treat', slug: 'ocevia-brightening-cream', icon: '✦' },
  { id: 'moisturize', title: 'Moisturize', slug: 'moisturizing-gel-oily-skin', icon: '◉' },
  { id: 'protect', title: 'Protect', slug: 'aqua-sunscreen-gel-spf-50-pa-3plus', icon: '☀' }
];

export default function StoreRoutineBuilder() {
  const [timeOfDay, setTimeOfDay] = useState('AM');
  const [selected, setSelected] = useState(['cleanser', 'moisturize', 'protect']);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const activeSteps = steps.filter(step => selected.includes(step.id) && (timeOfDay === 'AM' || step.id !== 'protect'));
  const total = activeSteps.reduce((sum, step) => sum + products[step.slug].price, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('skinaa-routine') || 'null');
      if (saved && Array.isArray(saved.steps)) {
        setSelected(saved.steps.filter(id => steps.some(step => step.id === id)));
        if (saved.timeOfDay === 'AM' || saved.timeOfDay === 'PM') setTimeOfDay(saved.timeOfDay);
      }
    } catch {
      setMessage('Your saved routine could not be read. You can still build a new one.');
    } finally {
      setReady(true);
    }
  }, []);

  function toggleStep(id) {
    setSelected(current => current.includes(id) ? current.filter(step => step !== id) : [...current, id]);
    setMessage('');
  }

  function saveRoutine() {
    if (!activeSteps.length) {
      setMessage('Choose at least one step before saving.');
      return;
    }
    try {
      window.localStorage.setItem('skinaa-routine', JSON.stringify({
        timeOfDay,
        steps: activeSteps.map(step => step.id),
        total
      }));
      setMessage('Your routine is saved on this device.');
    } catch {
      setMessage('Your routine could not be saved. Check your browser storage settings.');
    }
  }

  return (
    <section className="store-routine" aria-labelledby="routine-title">
      <div className="routine-selector">
        <p className="eyebrow">YOUR ROUTINE / {timeOfDay}</p>
        <h2 id="routine-title">Choose the steps<br /><em>that feel right.</em></h2>
        <p>Start simple and build at your own pace. Follow each product label for directions and precautions.</p>
        <div className="time-switch" role="group" aria-label="Choose routine time">
          {['AM', 'PM'].map(time => (
            <button key={time} className={timeOfDay === time ? 'selected' : ''} aria-pressed={timeOfDay === time} onClick={() => setTimeOfDay(time)}>{time}</button>
          ))}
        </div>
      </div>
      <div className="routine-panel">
        {steps.filter(step => timeOfDay === 'AM' || step.id !== 'protect').map((step, index) => (
          <button className={`routine-step ${selected.includes(step.id) ? 'selected' : ''}`} key={step.id} aria-pressed={selected.includes(step.id)} onClick={() => toggleStep(step.id)}>
            <b aria-hidden="true">{step.icon}</b>
            <span><small>STEP {String(index + 1).padStart(2, '0')}</small><strong>{step.title}</strong><em>{products[step.slug].name}</em></span>
            <i aria-hidden="true">{selected.includes(step.id) ? '✓' : '+'}</i>
          </button>
        ))}
        <div className="routine-total">
          <div><small>{ready ? activeSteps.length : '…'}-step {timeOfDay === 'AM' ? 'morning' : 'evening'} ritual</small><strong>₹{total.toLocaleString('en-IN')}</strong></div>
          <p>Estimated product total for your selected steps.</p>
          <button className="button dark" onClick={saveRoutine}>Save this routine →</button>
          <AddToCart slugs={activeSteps.map(step => step.slug)} label="Add selected steps to bag →" />
          <p role="status" aria-live="polite">{message}</p>
        </div>
      </div>
    </section>
  );
}
