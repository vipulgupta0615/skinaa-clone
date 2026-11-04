'use client';
import { useEffect, useState } from 'react';
import CheckoutButton from './CheckoutButton';
import { products } from '../lib/products';
function readCart() { try { const value = JSON.parse(localStorage.getItem('skinaa-cart') || '{}'); return Object.fromEntries(Object.entries(value).filter(([slug,qty]) => products[slug] && Number.isInteger(qty) && qty > 0 && qty <= 20)); } catch { return {}; } }
export function AddToCart({ slugs, label = 'Add to bag →' }) {
  const [message, setMessage] = useState('');
  function add() {
    try { const cart = readCart(); slugs.filter(slug=>products[slug]).forEach(slug=>{ cart[slug]=Math.min(20,(cart[slug]||0)+1); }); localStorage.setItem('skinaa-cart',JSON.stringify(cart)); setMessage('Added to your bag.'); } catch { setMessage('Your browser could not save the bag. Please allow local storage.'); }
  }
  return <div className="cart-action"><button className="button dark" disabled={!slugs.length} onClick={add}>{label}</button><a className="text-link" href="/cart">View bag →</a><span role="status">{message}</span></div>;
}
export default function Cart() {
  const [cart,setCart]=useState({}); const [ready,setReady]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{setCart(readCart());setReady(true);},[]);
  function change(slug,qty) { const next={...cart}; if(qty===0) delete next[slug];else next[slug]=Math.min(20,qty);try{localStorage.setItem('skinaa-cart',JSON.stringify(next));setCart(next);setError('');}catch{setError('Your bag could not be updated.');} }
  const total=Object.entries(cart).reduce((sum,[slug,qty])=>sum+products[slug].price*qty,0);
  return <main className="product-page cart-page"><p className="eyebrow">YOUR EVERYDAY EDIT</p><h1>Your bag.</h1>{!ready?<p>Loading your bag…</p>:Object.keys(cart).length?<><div className="cart-items">{Object.entries(cart).map(([slug,qty])=><article key={slug}>{products[slug].image&&<img src={`/assets/${products[slug].image}.webp`} width="100" height="100" alt={products[slug].name}/>}<div><a href={`/products/${slug}`}>{products[slug].name}</a><p>₹{products[slug].price} each</p><label>Quantity <select value={qty} onChange={event=>change(slug,Number(event.target.value))}>{Array.from({length:20},(_,i)=><option key={i+1}>{i+1}</option>)}</select></label><button onClick={()=>change(slug,0)}>Remove</button></div><strong>₹{qty*products[slug].price}</strong></article>)}</div><aside><h2>Subtotal <span>₹{total.toLocaleString('en-IN')}</span></h2><p>Shipping and taxes have not been calculated.</p><CheckoutButton cart={cart}/><p>Your bag stays saved on this device. Real purchases are not yet enabled.</p></aside></>:<p>Your bag is ready for a fresh start. Explore your essentials below.</p>}<p role="status">{error}</p><a className="button outline" href="/#essentials">Continue discovering →</a></main>;
}
