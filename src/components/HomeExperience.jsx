'use client';

import { useMemo, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const concerns = {
  clarity: { number: '01', label: 'Calm the breakout cycle', eyebrow: 'For breakout-prone days', title: 'Clarity, without the stripping.', body: 'A barrier-first pairing that clears the noise, then keeps hydration close.', footer: 'Niacinamide + gentle cleansing', link: 'https://shop.skinaa.com/products/moisturizing-gel-oily-skin', color: '#1834ac' },
  glow: { number: '02', label: 'Bring back the glow', eyebrow: 'For your glow era', title: 'Brighten the pace, not the pressure.', body: 'A fresh, vitamin-forward reset designed to make your everyday cleanse feel like a beginning.', footer: 'Vitamin C + everyday ritual', link: 'https://shop.skinaa.com/products/vitamin-c-face-wash', color: '#c86f3b' },
  shield: { number: '03', label: 'Protect & prevent', eyebrow: 'For daily exposure', title: 'Make protection the easy part.', body: 'A featherlight sunscreen step that lets you get on with your day—no white cast, no compromise.', footer: 'SPF 50+ + hydration', link: 'https://shop.skinaa.com/products/aqua-sunscreen-gel-spf-50-pa-3plus', color: '#275ac4' },
  even: { number: '04', label: 'Even out the story', eyebrow: 'For uneven-looking tone', title: 'Care for every chapter of your skin.', body: 'A considered brightening step to pair with patient, gentle consistency.', footer: 'Brightening care + barrier support', link: 'https://shop.skinaa.com/collections/all', color: '#8f4f8b' }
};

const formulaDetails = {
  protection: { number: '01 / PROTECTION', title: 'A wearable layer of defence.', text: 'Broad-spectrum SPF 50+ with a weightless gel texture—made to make daily protection an easy yes.' },
  hydration: { number: '02 / HYDRATION', title: 'Hydration that plays well with sunlight.', text: 'Hyaluronic Acid keeps the formula comfortable and the finish supple-feeling through the day.' },
  finish: { number: '03 / FINISH', title: 'The kind of invisible you notice.', text: 'The aqua-gel finish disappears fast, so daily sunscreen feels good on the skin, not just on paper.' }
};

const routineProducts = [
  { id: 'cleanser', step: '01', title: 'Cleanse', product: 'Vitamin C Face Wash', price: 341, icon: '◒', tone: 'sun' },
  { id: 'treat', step: '02', title: 'Treat', product: 'Ocevia Brightening Cream', price: 476, icon: '✦', tone: 'lilac' },
  { id: 'moisturize', step: '03', title: 'Moisturize', product: 'Niacinamide Gel Moisturizer', price: 338, icon: '◉', tone: 'mint' },
  { id: 'protect', step: '04', title: 'Protect', product: 'Aqua SPF 50+ Gel', price: 489, icon: '☀', tone: 'sky' }
];

const productCards = [
  { type: 'tube', index: '01 — DAILY DEFENCE', name: 'Aqua SPF 50+ Gel', description: 'Lightweight broad-spectrum protection with hyaluronic acid.', price: '₹489', link: 'https://shop.skinaa.com/products/aqua-sunscreen-gel-spf-50-pa-3plus', color: 'blue' },
  { type: 'wash', index: '02 — FRESH START', name: 'Vitamin C Face Wash', description: 'An everyday cleanse with bright, easy energy.', price: '₹341', link: 'https://shop.skinaa.com/products/vitamin-c-face-wash', color: 'yellow' },
  { type: 'jar', index: '03 — BALANCED BASE', name: 'Niacinamide Gel', description: 'A breathable hit of hydration for your barrier.', price: '₹338', link: 'https://shop.skinaa.com/products/moisturizing-gel-oily-skin', color: 'green' }
];

function Toast({ message }) {
  return <div className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">{message}</div>;
}

export default function HomeExperience() {
  const [activeConcern, setActiveConcern] = useState('clarity');
  const [activeDetail, setActiveDetail] = useState('protection');
  const [rotation, setRotation] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState(new Set(['cleanser', 'moisturize', 'protect']));
  const [timeOfDay, setTimeOfDay] = useState('AM');
  const [comparison, setComparison] = useState(51);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const concern = concerns[activeConcern];
  const detail = formulaDetails[activeDetail];
  const total = useMemo(() => routineProducts.filter((item) => selectedSteps.has(item.id)).reduce((sum, item) => sum + item.price, 0), [selectedSteps]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  }

  function toggleRoutineStep(id) {
    setSelectedSteps((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function saveRoutine() {
    if (!selectedSteps.size) return showToast('Choose at least one ritual step first.');
    const payload = { timeOfDay, steps: [...selectedSteps], total };
    try {
      const response = await fetch(`${API_URL}/api/routines`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Unable to save routine');
      showToast('Your ritual is saved. You can pick it up any time.');
    } catch {
      window.sessionStorage.setItem('skinaa-routine', JSON.stringify(payload));
      showToast('Your ritual is held in this browser preview.');
    }
  }

  async function subscribe(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/subscribers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('Unable to subscribe');
      setEmail('');
      showToast('You’re on the SKINAA list. See you soon.');
    } catch {
      showToast('Thanks — your note is ready for the live SKINAA list.');
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement"><span>Free shipping over ₹799</span><i /><span>Dermatologist-developed care</span><i /><span>Made for real skin days</span></div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="SKINAA home"><span>✦</span>SKINAA</a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#journey">Shop by concern</a><a href="#formula">The formula</a><a href="#routine">Build a routine</a><a href="https://shop.skinaa.com/pages/our-doctors" target="_blank" rel="noreferrer">Our doctors ↗</a></nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search products" onClick={() => setSearchOpen((open) => !open)}>⌕</button>
          <a className="bag icon-button" href="https://shop.skinaa.com/cart" target="_blank" rel="noreferrer" aria-label="Open Shopify cart">♧<b>{selectedSteps.size}</b></a>
          <button className={`menu-button ${menuOpen ? 'active' : ''}`} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
        </div>
        {searchOpen && <div className="search-panel"><label htmlFor="shop-search">Find a formula</label><div><input id="shop-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Try “sunscreen” or “glow”" /><a href={`https://shop.skinaa.com/search?q=${encodeURIComponent(searchTerm)}`} target="_blank" rel="noreferrer">Search ↗</a></div></div>}
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a onClick={() => setMenuOpen(false)} href="#journey">Shop by concern</a><a onClick={() => setMenuOpen(false)} href="#formula">The formula</a><a onClick={() => setMenuOpen(false)} href="#routine">Build a routine</a><a href="https://shop.skinaa.com/collections/all" target="_blank" rel="noreferrer">Shop all ↗</a></nav>}
      </header>

      <main id="main">
        <section className="hero" id="top">
          <img src="/assets/skinaa-hero.png" alt="Blue serum bottle and white skincare tube among soft flowers and amber gel droplets" />
          <div className="hero-filter" />
          <div className="hero-copy"><p className="eyebrow">The skin intelligence edit <span>01—26</span></p><h1>Meet your skin<br /><em>where it is.</em></h1><p>Science-led essentials for the beautifully inconsistent business of living in your skin.</p><div className="hero-actions"><a className="button dark" href="#journey">Find your match <span>↓</span></a><a className="text-link" href="#formula">Explore the formula ↗</a></div></div>
          <div className="hero-orbit">NIACINAMIDE <b>✦</b> HYALURONIC</div>
          <aside className="hero-note"><p>DAILY ESSENTIAL</p><strong>Aqua SPF 50+</strong><span>Hydration, defence, zero white cast.</span><a href="https://shop.skinaa.com/products/aqua-sunscreen-gel-spf-50-pa-3plus" target="_blank" rel="noreferrer">Meet the UV veil ↗</a></aside>
        </section>

        <section className="proof"><div><b>✳</b><strong>Dermatologist<br />developed</strong></div><div><b>4L+</b><span>happy skin stories<br />and counting</span></div><div><b>⌁</b><strong>Intentional,<br />evidence-led formulas</strong></div><a href="https://shop.skinaa.com/collections/all" target="_blank" rel="noreferrer">Shop the edit ↗</a></section>

        <section className="section journey" id="journey">
          <div className="heading"><p className="eyebrow">A little less guesswork <span>02</span></p><h2>Where do you want<br /><em>your skin to go?</em></h2></div>
          <div className="journey-grid">
            <div className="concerns" role="tablist" aria-label="Skin concerns">{Object.entries(concerns).map(([id, item]) => <button key={id} className={activeConcern === id ? 'selected' : ''} onClick={() => setActiveConcern(id)} role="tab" aria-selected={activeConcern === id}><small>{item.number}</small>{item.label}<b>↗</b></button>)}</div>
            <article className="match-card" role="tabpanel" style={{ background: concern.color }}><div className="match-orb"><i /><i /><span>+<br />B3</span></div><div><p className="eyebrow">{concern.eyebrow}</p><h3>{concern.title}</h3><p>{concern.body}</p><a className="under-link" href={concern.link} target="_blank" rel="noreferrer">See your edit →</a></div><small>{concern.footer}</small></article>
          </div>
        </section>

        <section className="section formula" id="formula">
          <div className="formula-intro"><p className="eyebrow">Feel the science <span>03</span></p><div><h2>A formula you can<br /><em>move through.</em></h2><p>Explore the layers inside our everyday UV veil. Drag the bottle with the slider, or choose a callout.</p></div></div>
          <div className="formula-stage">
            <div className="formula-copy left"><small>01</small><strong>Water-light</strong><span>Comfortable daily wear with no heavy finish.</span></div><div className="formula-copy right"><small>02</small><strong>Barrier-minded</strong><span>Hyaluronic acid and niacinamide support a hydrated feel.</span></div>
            <div className="product-shadow" /><div className="bottle-3d" style={{ '--turn': `${rotation}deg` }} aria-label="Interactive stylized sunscreen bottle" role="img"><i className="cap" /><i className="neck" /><i className="body"><span>SKINAA</span><b>AQUA<br />VEIL</b><small>SPF 50+</small></i></div>
            {Object.keys(formulaDetails).map((id) => <button key={id} className={`hotspot ${id} ${activeDetail === id ? 'selected' : ''}`} onClick={() => setActiveDetail(id)}><b>+</b>{id === 'protection' ? 'UV veil' : id === 'hydration' ? 'Hydration' : 'Finish'}</button>)}
            <div className="formula-detail"><p>{detail.number}</p><h3>{detail.title}</h3><span>{detail.text}</span><a href="https://shop.skinaa.com/products/aqua-sunscreen-gel-spf-50-pa-3plus" target="_blank" rel="noreferrer">See product details ↗</a></div>
            <label className="rotation">Rotate the bottle<input aria-label="Rotate the bottle" type="range" min="-28" max="28" value={rotation} onChange={(event) => setRotation(event.target.value)} /></label>
          </div>
        </section>

        <section className="section editorial"><div className="editorial-visual"><p>fresh start<br />energy</p><div className="wash-bottle"><small>SKINAA</small><b>VITAMIN C</b><small>FACE WASH</small></div></div><div><p className="eyebrow">Not another routine <span>04</span></p><h2>Care that fits<br /><em>the day you’re having.</em></h2><p className="body-copy">From a 30-second morning reset to the “my skin needs a minute” evening, every SKINAA step gives you room to show up as you are.</p><blockquote>“<br /><span>Consistency starts with products you actually want to use.</span><small>— The SKINAA point of view</small></blockquote><a className="button outline" href="https://shop.skinaa.com/products/vitamin-c-face-wash" target="_blank" rel="noreferrer">Start fresh ↗</a></div></section>

        <section className="section routine" id="routine"><div><p className="eyebrow">Make it yours <span>05</span></p><h2>Build a little<br /><em>ritual.</em></h2><p className="body-copy">Tap the steps you want to keep close. We’ll hold the sequence for you.</p></div><div className="routine-panel"><div className="time-switch"><button className={timeOfDay === 'AM' ? 'selected' : ''} onClick={() => setTimeOfDay('AM')}>AM</button><button className={timeOfDay === 'PM' ? 'selected' : ''} onClick={() => setTimeOfDay('PM')}>PM</button></div>{routineProducts.map((item) => <button className={`routine-step ${selectedSteps.has(item.id) ? 'selected' : ''}`} aria-pressed={selectedSteps.has(item.id)} onClick={() => toggleRoutineStep(item.id)} key={item.id}><b className={item.tone}>{item.icon}</b><span><small>STEP {item.step}</small><strong>{item.title}</strong><em>{item.product}</em></span><i>{selectedSteps.has(item.id) ? '✓' : '+'}</i></button>)}<div className="routine-total"><div><small>{selectedSteps.size}-step {timeOfDay === 'AM' ? 'morning' : 'evening'} ritual</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><p>{selectedSteps.size ? 'A simple, barrier-friendly edit for everyday consistency.' : 'Choose one small step to start.'}</p><button className="button dark" onClick={saveRoutine}>Save this routine <span>→</span></button><small>Persists to MongoDB when a <code>MONGODB_URI</code> is configured.</small></div></div></section>

        <section className="section results"><div><p className="eyebrow">Skin, in real life <span>06</span></p><h2>The proof is in<br /><em>the ritual.</em></h2><p className="body-copy">Use the slider to explore the idea behind a well-layered morning routine.</p></div><div className="comparison-wrap"><div className="caption before">BEFORE<br /><span>Unprotected,<br />dehydrated feel</span></div><div className="caption after">AFTER<br /><span>Hydrated +<br />protected ritual</span></div><div className="comparison"><div className="after-skin"><div className="face good" /></div><div className="before-skin" style={{ width: `${comparison}%` }}><div className="face dry"><i /><i /><i /></div></div></div><label className="comparison-control"><span className="visually-hidden">Compare before and after</span><input type="range" min="0" max="100" value={comparison} onChange={(event) => setComparison(event.target.value)} /><b style={{ left: `${comparison}%` }}>↔</b></label></div><p className="results-note">Illustrative routine visual. Individual skin and results vary; explore product pages for customer reviews and full details.</p></section>

        <section className="section product-edit"><div className="heading"><p className="eyebrow">The starting line <span>07</span></p><h2>Three reasons to<br /><em>begin today.</em></h2></div><div className="product-grid">{productCards.map((product) => <article className={`product-card ${product.color}`} key={product.name}><div className={`mini-product ${product.type}`}><small>SKINAA</small><b>{product.type === 'tube' ? <>AQUA<br />SPF 50+</> : product.type === 'wash' ? 'VITAMIN C' : 'NIACINAMIDE'}</b><small>{product.type === 'jar' ? 'GEL MOISTURIZER' : product.type === 'wash' ? 'FACE WASH' : '50ml'}</small></div><p>{product.index}</p><h3>{product.name}</h3><span>{product.description}</span><footer><strong>{product.price}</strong><a href={product.link} target="_blank" rel="noreferrer">Shop ↗</a></footer></article>)}</div><a className="button outline centred" href="https://shop.skinaa.com/collections/all" target="_blank" rel="noreferrer">Discover all care ↗</a></section>

        <section className="section newsletter"><div className="newsletter-orb">✦</div><div><p className="eyebrow">A softer signal <span>08</span></p><h2>Skincare intel,<br /><em>minus the noise.</em></h2></div><form onSubmit={subscribe}><label htmlFor="email">A note in your inbox, occasionally.</label><div><input id="email" type="email" value={email} required onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" /><button className="button" type="submit">I’m in →</button></div><small>No spam. Just skin wisdom, new launches, and a good offer when it counts.</small></form></section>
      </main>

      <footer className="site-footer"><div><a className="brand" href="#top"><span>✦</span>SKINAA</a><p>Made for the skin you live in.</p></div><div><small>SHOP</small><a href="https://shop.skinaa.com/collections/all" target="_blank" rel="noreferrer">All products</a><a href="https://shop.skinaa.com/collections/sunscreen" target="_blank" rel="noreferrer">Sunscreen</a></div><div><small>CARE</small><a href="https://shop.skinaa.com/pages/our-doctors" target="_blank" rel="noreferrer">Our doctors</a><a href="https://shop.skinaa.com/blogs/news" target="_blank" rel="noreferrer">Skin journal</a></div><p>© 2026 SKINAA. Full-stack assessment build using MongoDB, Express, React, Next, and Node.</p></footer>
      <Toast message={toast} />
    </>
  );
}
