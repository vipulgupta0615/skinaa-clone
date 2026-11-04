'use client';
import { useEffect, useState } from 'react';
import { products } from '../lib/products';
function readCart() { try { const value = JSON.parse(localStorage.getItem('skinaa-cart') || '{}'); return Object.fromEntries(Object.entries(value).filter(([slug,qty]) => products[slug] && Number.isInteger(qty) && qty > 0 && qty <= 20)); } catch { return {}; } }
function notifyCartUpdated() { window.dispatchEvent(new Event('skinaa-cart-updated')); }

export function BagLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(Object.values(readCart()).reduce((sum, quantity) => sum + quantity, 0));
    updateCount();
    window.addEventListener('skinaa-cart-updated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('skinaa-cart-updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return <a className="bag icon-button" href="/cart" aria-label={count ? `View shopping bag, ${count} ${count === 1 ? 'item' : 'items'}` : 'View shopping bag'}><span aria-hidden="true">↗</span>{count > 0 && <b aria-hidden="true">{count > 99 ? '99+' : count}</b>}</a>;
}

export function AddToCart({ slugs, label = 'Add to bag →' }) {
  const [message, setMessage] = useState('');
  function add() {
    try { const cart = readCart(); slugs.filter(slug=>products[slug]).forEach(slug=>{ cart[slug]=Math.min(20,(cart[slug]||0)+1); }); localStorage.setItem('skinaa-cart',JSON.stringify(cart)); notifyCartUpdated(); setMessage('Added to your bag.'); } catch { setMessage('Your browser could not save the bag. Please allow local storage.'); }
  }
  return <div className="cart-action"><button className="button dark" disabled={!slugs.length} onClick={add}>{label}</button><a className="text-link" href="/cart">View bag →</a><span role="status">{message}</span></div>;
}
export default function Cart() {
  const [cart,setCart]=useState({}); const [ready,setReady]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{setCart(readCart());setReady(true);},[]);
  function change(slug,qty) { const next={...cart}; if(qty===0) delete next[slug];else next[slug]=Math.min(20,qty);try{localStorage.setItem('skinaa-cart',JSON.stringify(next));setCart(next);notifyCartUpdated();setError('');}catch{setError('Your bag could not be updated.');} }
  const total=Object.entries(cart).reduce((sum,[slug,qty])=>sum+products[slug].price*qty,0);
  return <main className="product-page cart-page">{!ready?<p>Loading your bag…</p>:Object.keys(cart).length?<><div className="cart-items">{Object.entries(cart).map(([slug,qty])=><article key={slug}>{products[slug].image&&<img src={`/assets/${products[slug].image}.webp`} width="100" height="100" alt={products[slug].name}/>}<div><a href={`/products/${slug}`}>{products[slug].name}</a><p>₹{products[slug].price} each</p><label>Quantity <select value={qty} onChange={event=>change(slug,Number(event.target.value))}>{Array.from({length:20},(_,i)=><option key={i+1}>{i+1}</option>)}</select></label><button onClick={()=>change(slug,0)}>Remove</button></div><strong>₹{qty*products[slug].price}</strong></article>)}</div><aside><h2>Subtotal <span>₹{total.toLocaleString('en-IN')}</span></h2><p>Assignment demo: explore products and build your bag. No payments or orders are processed.</p><p>Your bag is saved on this device.</p></aside></>:<p>Your bag is ready for a fresh start. Explore our product collection.</p>}<p role="status">{error}</p><a className="button outline" href="/products">Continue discovering →</a></main>;
}
