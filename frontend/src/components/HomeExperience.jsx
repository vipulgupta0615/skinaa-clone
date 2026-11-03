'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProductStage from './ProductStage';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

const concerns = {
  clarity: { number: '01', label: 'Calm the breakout cycle', eyebrow: 'For breakout-prone days', title: 'Clarity, without the stripping.', body: 'A barrier-first pairing that clears the noise, then keeps hydration close.', footer: 'Niacinamide + gentle cleansing', link: '/products/moisturizing-gel-oily-skin', color: '#315a49' },
  glow: { number: '02', label: 'Bring back the glow', eyebrow: 'For your glow era', title: 'Brighten the pace, not the pressure.', body: 'A fresh, vitamin-forward reset designed to make your everyday cleanse feel like a beginning.', footer: 'Vitamin C + everyday ritual', link: '/products/vitamin-c-face-wash', color: '#8b492b' },
  shield: { number: '03', label: 'Protect & prevent', eyebrow: 'For daily exposure', title: 'Make protection the easy part.', body: 'A featherlight sunscreen step that lets you get on with your day—no white cast, no compromise.', footer: 'SPF 50+ + hydration', link: '/products/aqua-sunscreen-gel-spf-50-pa-3plus', color: '#31596b' },
  even: { number: '04', label: 'Even out the story', eyebrow: 'For uneven-looking tone', title: 'Care for every chapter of your skin.', body: 'A considered brightening step to pair with patient, gentle consistency.', footer: 'Brightening care + barrier support', link: '/products/ocevia-brightening-cream', color: '#714568' }
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
  { type: 'tube', index: '01 — DAILY DEFENCE', name: 'Aqua SPF 50+ Gel', description: 'Lightweight broad-spectrum protection with hyaluronic acid.', price: '₹489', link: '/products/aqua-sunscreen-gel-spf-50-pa-3plus', color: 'blue' },
  { type: 'wash', index: '02 — FRESH START', name: 'Vitamin C Face Wash', description: 'An everyday cleanse with bright, easy energy.', price: '₹341', link: '/products/vitamin-c-face-wash', color: 'yellow' },
  { type: 'jar', index: '03 — BALANCED BASE', name: 'Niacinamide Gel', description: 'A breathable hit of hydration for your barrier.', price: '₹338', link: '/products/moisturizing-gel-oily-skin', color: 'green' }
];

function Sculpture() {
  return <div className="sculpture" role="img" aria-label="Three-dimensional SKINAA sunscreen packaging concept"><div className="cylinder">{Array.from({ length: 32 }, (_, i) => <i key={i} className="cylinder-panel" style={{ '--i': i }} />)}<div className="cylinder-top" /><div className="sculpture-label"><span>SKINAA</span><small>DERMATOLOGY + DAILY CARE</small><b>AQUA</b><em>sun gel</em><strong>50<span>SPF +</span></strong><small>HYALURONIC ACID<br />50 ml / 1.69 fl. oz.</small></div><div className="sculpture-back">SKINAA<br /><small>EVERYDAY<br />PROTECTION<br />————<br />CONCEPT VISUAL</small></div><div className="sculpture-cap" /></div></div>;
}

function Toast({ message }) {
  return <div className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">{message}</div>;
}

export default function HomeExperience() {
  const [journeyTime, setJourneyTime] = useState('AM');
  const [journeyDepth, setJourneyDepth] = useState('simple');
  const [savedRoutine, setSavedRoutine] = useState(false);
  const [activeConcern, setActiveConcern] = useState('clarity');
  const [activeDetail, setActiveDetail] = useState('protection');
  const [selectedSteps, setSelectedSteps] = useState(new Set(['cleanser', 'moisturize', 'protect']));
  const [timeOfDay, setTimeOfDay] = useState('AM');
  const [motionPaused, setMotionPaused] = useState(false);
  const [heroTurn, setHeroTurn] = useState(-22);
  const [productFilter, setProductFilter] = useState('all');
  const toastTimer = useRef(null);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTrigger = useRef(null);
  const menuTrigger = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    function dismiss(event) {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'pointerdown' && headerRef.current?.contains(event.target)) return;
      if (event.type === 'keydown') (searchOpen ? searchTrigger : menuTrigger).current?.focus();
      setMenuOpen(false);
      setSearchOpen(false);
    }
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', dismiss);
    return () => {
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('pointerdown', dismiss);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const saved = window.localStorage.getItem('skinaa-routine');
    if (saved) {
      try {
        const routine = JSON.parse(saved);
        setSavedRoutine(true);
        if (Array.isArray(routine.steps)) setSelectedSteps(new Set(routine.steps.filter(id => routineProducts.some(p => p.id === id))));
        if (['AM', 'PM'].includes(routine.timeOfDay)) setTimeOfDay(routine.timeOfDay);
      } catch { /* Ignore outdated saved routines. */ }
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.section').forEach(section => { section.classList.add('reveal'); observer.observe(section); });
    return () => { observer.disconnect(); window.clearTimeout(toastTimer.current); };
  }, []);

  function chooseTime(value) {
    setTimeOfDay(value);
    setSelectedSteps(current => {
      const next = new Set(current);
      value === 'PM' ? next.delete('protect') : next.add('protect');
      return next;
    });
  }

  const recommendedIds = ['cleanser', 'moisturize', ...(journeyTime === 'AM' ? ['protect'] : []), ...(journeyDepth === 'complete' && activeConcern === 'even' ? ['treat'] : [])];
  const recommended = routineProducts.filter(item => recommendedIds.includes(item.id));
  const recommendationTotal = recommended.reduce((sum, item) => sum + item.price, 0);
  function applyJourney() {
    setTimeOfDay(journeyTime);
    setSelectedSteps(new Set(recommendedIds));
    showToast('Your suggested steps are ready to customize.');
  }
  const concern = concerns[activeConcern];
  const detail = formulaDetails[activeDetail];
  const total = useMemo(() => routineProducts.filter((item) => selectedSteps.has(item.id)).reduce((sum, item) => sum + item.price, 0), [selectedSteps]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3500);
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
    window.localStorage.setItem('skinaa-routine', JSON.stringify(payload));
    setSavedRoutine(true);
    showToast('Your routine is saved on this device.');
    try {
      const response = await fetch(`${API_URL}/api/routines`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok || !(await response.json()).saved) throw new Error('Unable to save routine');
      showToast('Your ritual is saved. You can pick it up any time.');
    } catch {
      showToast('Your routine is saved on this device.');
    }
  }

  async function subscribe(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/subscribers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok || !(await response.json()).saved) throw new Error('Unable to subscribe');
      setEmail('');
      showToast('You’re on the SKINAA list. See you soon.');
    } catch {
      showToast('Subscription could not be saved. Please try again later.');
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement"><span>Free shipping over ₹799</span><i /><span>Dermatologist-developed care</span><i /><span>Made for real skin days</span></div>

      <header className="site-header" ref={headerRef}>
        <a className="brand" href="#top" aria-label="SKINAA home"><span>✦</span>SKINAA</a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#essentials">Shop essentials</a><a href="#journey">Shop by concern</a><a href="#formula">The formula</a><a href="#routine">Build a routine</a><a href="/#science">Our approach ↓</a></nav>
        <div className="header-actions">
          <button ref={searchTrigger} className="icon-button" aria-label="Search products" aria-controls="product-search" aria-expanded={searchOpen} onClick={() => { setSearchOpen(open => !open); setMenuOpen(false); }}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>
          <a className="bag icon-button" href="/#routine" aria-label="View your routine">↗</a>
          <button ref={menuTrigger} className={`menu-button ${menuOpen ? 'active' : ''}`} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => { setMenuOpen(open => !open); setSearchOpen(false); }}><i /><i /></button>
        </div>
        {searchOpen && <div className="search-panel" id="product-search"><label htmlFor="shop-search">Find a formula</label><input id="shop-search" autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search sunscreen, cleanse, hydration…" /><div className="search-results" aria-live="polite">{productCards.filter(product => `${product.name} ${product.description} ${product.color === 'blue' ? 'sunscreen protect' : product.color === 'yellow' ? 'cleanse glow' : 'hydrate moisturizer'}`.toLowerCase().includes(searchTerm.trim().toLowerCase())).map(product => <a key={product.name} href={product.link}>{product.name}<span>{product.price} →</span></a>)}{!productCards.some(product => `${product.name} ${product.description} ${product.color === 'blue' ? 'sunscreen protect' : product.color === 'yellow' ? 'cleanse glow' : 'hydrate moisturizer'}`.toLowerCase().includes(searchTerm.trim().toLowerCase())) && <p>No matches yet. Try “sunscreen”, “cleanse” or “hydrate”.</p>}</div><button onClick={() => { setSearchOpen(false); searchTrigger.current?.focus(); }} aria-label="Close search">Close ×</button></div>}
        {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation"><p className="eyebrow">YOUR SKIN, YOUR STARTING POINT</p><a onClick={() => setMenuOpen(false)} href="#essentials">Shop essentials <span>01</span></a><a onClick={() => setMenuOpen(false)} href="#journey">Shop by concern</a><a onClick={() => setMenuOpen(false)} href="#formula">The formula</a><a onClick={() => setMenuOpen(false)} href="#routine">Build a routine</a><a onClick={() => setMenuOpen(false)} href="#science">Our approach <span>05</span></a></nav>}
      </header>

      <main id="main" tabIndex={-1} className={motionPaused ? "motion-paused" : ""}>
        <section className="hero immersive-hero" id="top">
          <div className="hero-copy"><p className="eyebrow"><span className="live-dot" /> SCIENCE MEETS YOUR EVERYDAY</p><h1>Good science.<br />Great skin.<br /><em>Your kind of care.</em></h1><p>Dermatologist-developed essentials. Thoughtful ingredients. A routine that feels like you.</p><div className="hero-actions"><a className="button dark" href="#essentials">Shop the essentials <span>↗</span></a><a className="text-link" href="#journey">Find my skin match →</a></div><div className="hero-assurance"><span>✳</span><p>Created by dermatologists.<br /><strong>Made for real skin.</strong></p></div></div>
          <div className="hero-lab" onPointerMove={event => { if (!motionPaused && event.pointerType === 'mouse' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { const box = event.currentTarget.getBoundingClientRect(); setHeroTurn(((event.clientX - box.left) / box.width - .5) * 65); } }} onPointerLeave={() => setHeroTurn(-22)}>
            <div className="lab-word" aria-hidden="true">SKIN<br />IN MOTION</div><div className="lab-orbit orbit-one" /><div className="lab-orbit orbit-two" /><div className="gel-drop drop-one" /><div className="gel-drop drop-two" />
            <div className="hero-vessel" style={{ '--angle': `${heroTurn}deg` }}><Sculpture /></div>
            <span className="lab-tag tag-one">☀ SPF 50+<small>YOUR DAILY DEFENCE</small></span><span className="lab-tag tag-two">H₂O<small>HYDRATION, IN EVERY LAYER</small></span>
            <button className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}>{motionPaused ? "Resume ambient motion" : "Pause ambient motion"}</button><div className="lab-floor" /><div className="lab-bottom"><span>01 / PACKAGING CONCEPT • EXPLORE BELOW</span><a href="#formula" aria-label="Explore the interactive formula">↓</a></div>
          </div>
          <div className="hero-bottom"><span>SKINCARE, WITH A LITTLE MORE FEELING.</span><span>SCROLL TO DISCOVER ↓</span></div>
        </section>

        <section className="proof"><div><b>✳</b><strong>Dermatologist<br />developed</strong></div><div><b>4L+</b><span>happy skin stories<br />and counting</span></div><div><b>⌁</b><strong>Intentional,<br />evidence-led formulas</strong></div><a href="/#essentials">Shop the edit ↗</a></section>

        <section className="section product-edit" id="essentials"><div className="heading"><div><p className="eyebrow">THE EVERYDAY EDIT / 01</p><h2>Small steps.<br /><em>Skin-changing rituals.</em></h2></div><p className="section-aside">Your daily essentials, thoughtfully formulated.<br />Find your first step here.</p></div><div className="filter-row" role="group" aria-label="Filter essentials">{[['all','All essentials'],['blue','Protect'],['yellow','Cleanse'],['green','Hydrate']].map(([id,label]) => <button key={id} aria-pressed={productFilter === id} onClick={() => setProductFilter(id)}>{label}</button>)}<span>FORMULAS WITH PURPOSE. ALWAYS.</span></div><div className="product-grid">{productCards.filter(p => productFilter === 'all' || productFilter === p.color).map((product) => <article className={`product-card ${product.color}`} key={product.name}><a className="product-image" href={product.link} aria-label={`View ${product.name}`}><span className="product-badge">{product.color === 'blue' ? 'DAILY DEFENCE' : product.color === 'yellow' ? 'FRESH START' : 'BARRIER CARE'}</span><img src={`/assets/${product.color === 'blue' ? 'aqua' : product.color === 'yellow' ? 'vitamin-c' : 'niacinamide'}.webp`} alt={product.name} width="533" height="533" loading="lazy" /><span className="image-arrow">↗</span></a><div className="product-info"><p>{product.index}</p><h3>{product.name}</h3><span>{product.description}</span><footer><strong>{product.price}</strong><a href={product.link}>Explore product ↗</a></footer></div></article>)}</div><a className="button outline centred" href="/#essentials">Shop all skincare ↗</a><p className="shop-note">Explore ingredients and build your routine here. Online checkout is not yet available.</p></section>

        <section className="section journey" id="journey">
          <div className="heading"><p className="eyebrow">A little less guesswork <span>02</span></p><h2>Where do you want<br /><em>your skin to go?</em></h2></div>
          <div className="journey-grid">
            <div className="concerns" role="group" aria-label="Skin concerns">{Object.entries(concerns).map(([id, item]) => <button key={id} className={activeConcern === id ? 'selected' : ''} onClick={() => setActiveConcern(id)} aria-pressed={activeConcern === id}><small>{item.number}</small>{item.label}<b>↗</b></button>)}</div>
            <article className="match-card" aria-live="polite" style={{ background: concern.color }}><div className="match-orb"><i /><i /><span>+<br />{activeConcern === 'clarity' ? 'B3' : activeConcern === 'glow' ? 'C' : activeConcern === 'shield' ? 'SPF' : 'CARE'}</span></div><div><p className="eyebrow">{concern.eyebrow}</p><h3>{concern.title}</h3><p>{concern.body}</p><a className="under-link" href={concern.link}>See your edit →</a></div><small>{concern.footer}</small></article>
          </div>
          <div className="journey-planner"><div className="journey-preferences"><p className="eyebrow">02 / MAKE IT FIT YOUR DAY</p><h3>Your pace. Your ritual.</h3><fieldset><legend>When is your ritual?</legend>{['AM','PM'].map(time => <button key={time} aria-pressed={journeyTime === time} onClick={() => setJourneyTime(time)}>{time === 'AM' ? '☀ Morning' : '☾ Evening'}</button>)}</fieldset><fieldset><legend>How do you like to start?</legend>{[['simple','Keep it simple'],['complete','Room for targeted care']].map(([id,label]) => <button key={id} aria-pressed={journeyDepth === id} onClick={() => setJourneyDepth(id)}>{label}</button>)}</fieldset></div><div className="journey-recommendation" aria-live="polite"><p className="eyebrow">03 / YOUR STARTING POINT</p><h3>{recommended.length} steps, thoughtfully paired.</h3><p>{journeyTime === 'AM' ? 'Cleanse, hydrate and protect: a practical morning foundation.' : 'Cleanse and moisturize: a simple evening foundation.'} {journeyDepth === 'complete' && activeConcern === 'even' ? 'A targeted-care step is included for your tone-focused edit.' : `Explore ${activeConcern === 'glow' ? 'Vitamin C Face Wash' : activeConcern === 'shield' ? 'Aqua SPF 50+ Gel' : activeConcern === 'even' ? 'Ocevia Brightening Cream' : 'Niacinamide Gel'} as your concern-led highlight.`}</p><ol>{recommended.map(item => <li key={item.id}><span>{item.title}</span><strong>{item.product}</strong><small>₹{item.price}</small></li>)}</ol><div className="journey-summary"><strong>₹{recommendationTotal.toLocaleString('en-IN')}</strong><a className="button dark" href="#routine" onClick={applyJourney}>Customize these steps →</a></div><small>A starting point based on your choices, not a skin diagnosis. Check each product’s details before use.</small></div></div>
        </section>

        <section className="section formula" id="formula">
          <div className="formula-intro"><p className="eyebrow">Feel the science <span>03</span></p><div><h2>A formula you can<br /><em>move through.</em></h2><p>Explore the layers inside our everyday UV veil. Drag to rotate the 3D concept, then explore each formula layer. Packaging visualization; see the product page for the actual pack.</p></div></div>
          <ProductStage activeDetail={activeDetail} detail={detail} onSelect={setActiveDetail}><Sculpture /></ProductStage>
        </section>

        <section className="section editorial"><div className="editorial-visual"><p>fresh start<br />energy</p><div className="wash-bottle"><small>SKINAA</small><b>VITAMIN C</b><small>FACE WASH</small></div></div><div><p className="eyebrow">Not another routine <span>04</span></p><h2>Care that fits<br /><em>the day you’re having.</em></h2><p className="body-copy">From a 30-second morning reset to the “my skin needs a minute” evening, every SKINAA step gives you room to show up as you are.</p><blockquote>“<br /><span>Consistency starts with products you actually want to use.</span><small>— The SKINAA point of view</small></blockquote><a className="button outline" href="/products/vitamin-c-face-wash">Start fresh ↗</a></div></section>

        <section className="section routine" id="routine"><div><p className="eyebrow">Make it yours <span>05</span></p><h2>Build a little<br /><em>ritual.</em></h2><p className="body-copy">Tap the steps you want to keep close. We’ll hold the sequence for you.</p>{savedRoutine && <p className="saved-routine-note" role="status">✓ You have a saved routine on this device. Save again to update it.</p>}<div className="routine-map" aria-label="Your selected routine steps">{routineProducts.filter(item => selectedSteps.has(item.id)).map((item,index) => <div key={item.id}><span>{index + 1}</span><p>{item.title}<small>{item.product}</small></p></div>)}</div></div><div className="routine-panel"><div className="time-switch"><button className={timeOfDay === 'AM' ? 'selected' : ''} aria-pressed={timeOfDay === 'AM'} onClick={() => chooseTime('AM')}>AM</button><button className={timeOfDay === 'PM' ? 'selected' : ''} aria-pressed={timeOfDay === 'PM'} onClick={() => chooseTime('PM')}>PM</button></div>{routineProducts.filter(item => timeOfDay === 'AM' || item.id !== 'protect').map((item) => <button className={`routine-step ${selectedSteps.has(item.id) ? 'selected' : ''}`} aria-pressed={selectedSteps.has(item.id)} onClick={() => toggleRoutineStep(item.id)} key={item.id}><b className={item.tone}>{item.icon}</b><span><small>STEP {item.step}</small><strong>{item.title}</strong><em>{item.product}</em></span><i>{selectedSteps.has(item.id) ? '✓' : '+'}</i></button>)}<div className="routine-total"><div><small>{selectedSteps.size}-step {timeOfDay === 'AM' ? 'morning' : 'evening'} ritual</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><p>{selectedSteps.size ? 'A simple, barrier-friendly edit for everyday consistency.' : 'Choose one small step to start.'}</p><button className="button dark" onClick={saveRoutine}>Save this routine <span>→</span></button><div className="routine-links">{routineProducts.filter(item => selectedSteps.has(item.id)).map(item => <a key={item.id} href={item.id === 'cleanser' ? productCards[1].link : item.id === 'protect' ? productCards[0].link : item.id === 'moisturize' ? productCards[2].link : '/products/ocevia-brightening-cream'}>Shop {item.title.toLowerCase()} ↗</a>)}</div><small>Saved on this device. Explore each step without leaving SKINAA.</small></div></div></section>

        <section className="section science-note" id="science"><p className="eyebrow">THOUGHTFULLY FORMULATED / 06</p><h2>Your skin is personal.<br /><em>Your care should be, too.</em></h2><div className="science-grid"><article><span>01 / EXPERTISE</span><h3>Science at the start.</h3><p>Get to know the ingredients in your daily care and how each step fits into your routine.</p><a href="#formula">Explore the formula ↓</a></article><article><span>02 / TRANSPARENCY</span><h3>Know your formula.</h3><p>Explore product descriptions, key ingredients and routine pairings to choose your next step.</p><a href="#essentials">Explore the essentials ↗</a></article><article><span>03 / CONSISTENCY</span><h3>A ritual, not a race.</h3><p>Start with a few considered steps. Build a routine around your skin and the time you have.</p><a href="#routine">Make it yours ↗</a></article></div></section>

        <section className="section newsletter"><div className="newsletter-orb">✦</div><div><p className="eyebrow">A softer signal <span>08</span></p><h2>Skincare intel,<br /><em>minus the noise.</em></h2></div><form onSubmit={subscribe}><label htmlFor="email">A note in your inbox, occasionally.</label><div><input id="email" type="email" value={email} required onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" /><button className="button" type="submit">I’m in →</button></div><small>No spam. Just skin wisdom, new launches, and a good offer when it counts.</small></form></section>
      </main>

      <footer className="site-footer"><div><a className="brand" href="#top"><span>✦</span>SKINAA</a><p>Made for the skin you live in.</p></div><div><small>SHOP</small><a href="/#essentials">All products</a><a href="/products/aqua-sunscreen-gel-spf-50-pa-3plus">Sunscreen</a></div><div><small>CARE</small><a href="/#science">Our approach</a><a href="/#science">Skin philosophy</a></div><p>© 2026 SKINAA. Science-led care. Made for the skin you live in.</p></footer>
      <a className="mobile-shop" href="#essentials">Discover your everyday essentials <span>Shop now ↗</span></a>
      <Toast message={toast} />
    </>
  );
}
