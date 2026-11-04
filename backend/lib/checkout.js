const crypto = require('node:crypto');
const { mongoose, connectToDatabase } = require('./mongodb');
const { catalogue } = require('./catalogue');
const Order = mongoose.models.CheckoutOrder || mongoose.model('CheckoutOrder', new mongoose.Schema({ providerId: {type:String,unique:true}, amount:Number, items:Array, status:{type:String,default:'created'}, paymentId:String },{timestamps:true}));
const ready = () => Boolean(process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && process.env.RAZORPAY_KEY_SECRET && process.env.MONGODB_URI);
async function provider(path, body) {
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {method:body?'POST':'GET',headers:{Authorization:`Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,'Content-Type':'application/json'}, ...(body?{body:JSON.stringify(body)}:{}), signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error('Payment provider unavailable');
  return response.json();
}
function registerCheckout(app) {
  app.get('/api/checkout/status',(_req,res)=>res.json({ready:ready(),mode:'test'}));
  app.post('/api/checkout/orders',async(req,res)=>{
    if(!ready())return res.status(503).json({error:'Checkout is awaiting payment configuration.'});
    const items=req.body?.items;
    if(!Array.isArray(items)||!items.length||items.length>4||new Set(items.map(i=>i?.slug)).size!==items.length)return res.status(400).json({error:'Invalid bag.'});
    const prices=[...catalogue,{slug:'ocevia-brightening-cream',price:476}];
    let amount=0;
    for(const item of items){const product=prices.find(p=>p.slug===item?.slug);if(!product||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>20)return res.status(400).json({error:'Invalid product or quantity.'});amount+=product.price*item.quantity*100;}
    try{await connectToDatabase();const order=await provider('orders',{amount,currency:'INR',receipt:crypto.randomUUID()});await Order.create({providerId:order.id,amount,items});return res.json({orderId:order.id,amount,currency:'INR',keyId:process.env.RAZORPAY_KEY_ID});}catch{return res.status(503).json({error:'Could not start checkout. Please try again.'});}
  });
  app.post('/api/checkout/verify',async(req,res)=>{
    if(!ready())return res.status(503).json({error:'Checkout unavailable.'});
    const {razorpay_order_id:orderId,razorpay_payment_id:paymentId,razorpay_signature:signature}=req.body||{};
    if(!/^order_[A-Za-z0-9]+$/.test(orderId||'')||!/^pay_[A-Za-z0-9]+$/.test(paymentId||'')||! /^[a-f0-9]{64}$/.test(signature||''))return res.status(400).json({error:'Invalid payment response.'});
    try{await connectToDatabase();const order=await Order.findOne({providerId:orderId});if(!order)return res.status(404).json({error:'Order not found.'});const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${order.providerId}|${paymentId}`).digest();if(!crypto.timingSafeEqual(expected,Buffer.from(signature,'hex')))return res.status(400).json({error:'Payment verification failed.'});const payment=await provider(`payments/${paymentId}`);if(payment.order_id!==order.providerId||payment.amount!==order.amount||payment.currency!=='INR')return res.status(400).json({error:'Payment details do not match.'});if(payment.status!=='captured')return res.status(202).json({verified:false,message:'Payment is awaiting capture. Keep your payment reference.'});await Order.updateOne({_id:order._id},{$set:{status:'paid',paymentId}});return res.json({verified:true,orderId:order.providerId,mode:'test'});}catch{return res.status(503).json({error:'Payment confirmation unavailable. Do not pay again; retain your payment reference.'});}
  });
}
module.exports={registerCheckout};
