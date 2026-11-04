'use client';
import { useState } from 'react';
const API=(process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000').replace(/\/$/,'');
export default function CheckoutButton({cart}){
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  async function start(){setBusy(true);setMessage('');try{
    const status=await fetch(`${API}/api/checkout/status`).then(r=>r.json());if(!status.ready)throw new Error('Razorpay checkout is awaiting configuration. Your bag is saved.');
    if(!window.Razorpay)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Could not load checkout. Please try again.'));};document.body.appendChild(script);});
    const response=await fetch(`${API}/api/checkout/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:Object.entries(cart).map(([slug,quantity])=>({slug,quantity}))})});const order=await response.json();if(!response.ok)throw new Error(order.error);
    const checkout=new window.Razorpay({key:order.keyId,order_id:order.orderId,amount:order.amount,currency:order.currency,name:'SKINAA',description:'Test checkout — no real order',theme:{color:'#173e34'},modal:{ondismiss:()=>{setBusy(false);setMessage('Checkout closed. Your bag is saved.');}},handler:async result=>{try{const reply=await fetch(`${API}/api/checkout/verify`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result)});const data=await reply.json();setMessage(data.verified?`Test payment verified: ${data.orderId}. No real order has been placed.`:`${data.message||data.error} Payment reference: ${result.razorpay_payment_id}`);}catch{setMessage(`Confirmation pending. Do not pay again. Payment reference: ${result.razorpay_payment_id}`);}finally{setBusy(false);}}});checkout.on('payment.failed',()=>{setBusy(false);setMessage('Payment was not completed. Your bag is saved.');});checkout.open();
  }catch(error){setMessage(error.message||'Checkout unavailable.');setBusy(false);}}
  return <div><button className="button dark" disabled={busy} onClick={start}>{busy?'Opening checkout…':'Try Razorpay test checkout →'}</button><p role="status">{message}</p><small>Test mode only. No real payment or shipment.</small></div>;
}
