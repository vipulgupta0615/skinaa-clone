'use client';

import { useEffect, useRef, useState } from 'react';

const layers = {
  protection: { label: 'UV protection', symbol: '☀', title: '01 / Daily defence', copy: 'Start with the protection layer.', color: '#ebd995' },
  hydration: { label: 'Hydration', symbol: 'H₂O', title: '02 / Hydration', copy: 'Explore the hyaluronic acid story.', color: '#bce5dd' },
  finish: { label: 'Lightweight finish', symbol: '≈', title: '03 / Texture', copy: 'Discover the lightweight gel finish.', color: '#e4edc9' }
};
const wrap = angle => ((angle + 180) % 360 + 360) % 360 - 180;

export default function ProductStage({ children, activeDetail, detail, onSelect }) {
  const [angle, setAngle] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stage = useRef(null);
  const drag = useRef(null);
  const layer = layers[activeDetail];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(preference.matches); if (preference.matches) setPlaying(false); };
    update();
    preference.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    observer.observe(stage.current);
    return () => { preference.removeEventListener('change', update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!playing || reduced || !visible) return;
    let frame;
    let last = 0;
    function tick(time) {
      if (document.hidden) { last = 0; frame = requestAnimationFrame(tick); return; }
      if (!last) last = time;
      if (time - last >= 32) {
        const elapsed = Math.min(time - last, 80);
        setAngle(current => wrap(current + elapsed * .018));
        last = time;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced, visible]);

  function endDrag(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDragging(false);
  }

  return <div ref={stage} className={`formula-stage interactive-stage layer-${activeDetail} ${dragging ? 'is-dragging' : ''} ${visible ? 'stage-visible' : ''}`} style={{ '--layer-color': layer.color }}>
    <div className="layer-caption"><span>{layer.title}</span><p>{layer.copy}</p></div>
    <div className="ingredient-field" aria-hidden="true"><i /><i /><i /><i /><i /><i /><div className="ingredient-ring" /><span key={activeDetail}>{layer.symbol}</span></div>
    <div className="product-shadow" />
    <div className="rotation-surface" role="group" aria-label="Drag horizontally to rotate the product; keyboard rotation controls below"
      onPointerDown={event => { if (event.button !== 0) return; setPlaying(false); drag.current = { x: event.clientX, angle }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}
      onPointerMove={event => { if (drag.current) setAngle(wrap(drag.current.angle + (event.clientX - drag.current.x) * .65)); }}
      onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
      <div className="formula-vessel" style={{ '--angle': `${angle}deg` }}>{children}</div>
    </div>
    <div className="layer-controls" role="group" aria-label="Explore formula layers">{Object.entries(layers).map(([id, item]) => <button key={id} aria-pressed={activeDetail === id} onClick={() => onSelect(id)}><span aria-hidden="true">{item.symbol}</span>{item.label}</button>)}</div>
    <div className="formula-detail" aria-live="polite" aria-atomic="true"><div key={activeDetail} className="detail-transition"><p className="eyebrow">{detail.number}</p><h3>{detail.title}</h3><p>{detail.text}</p><a href="/products/aqua-sunscreen-gel-spf-50-pa-3plus">Explore this product →</a></div></div>
    <div className="rotation-console"><label htmlFor="product-rotation">Rotate the product <output>{Math.round(angle)}°</output></label><input id="product-rotation" type="range" min="-180" max="180" step="1" value={Math.round(angle)} onChange={event => { setPlaying(false); setAngle(Number(event.target.value)); }} /><div><button onClick={() => { setPlaying(false); setAngle(0); }}>Reset view</button><button disabled={reduced} aria-pressed={playing} onClick={() => setPlaying(current => !current)}>{playing ? 'Pause rotation' : 'Auto-rotate'}</button></div><small>{reduced ? 'Reduced motion enabled. Drag or use the slider to explore.' : 'Drag sideways to explore · Scroll vertically to continue'}</small></div>
  </div>;
}
