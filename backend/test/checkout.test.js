const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const db = require('../lib/mongodb');
let record, updated, providerCalls;
db.connectToDatabase = async () => ({});
db.mongoose.models.CheckoutOrder = {
  create: async value => { record = { ...value, _id:'local-order' }; },
  findOne: async () => record,
  updateOne: async (_query,value) => { updated = value; }
};
const routes = {};
require('../lib/checkout').registerCheckout({ get:(path,handler)=>routes[path]=handler, post:(path,handler)=>routes[path]=handler });
function response() { return { code:200, status(code){this.code=code;return this;},json(body){this.body=body;return this;} }; }
const invoke = async (path, body) => {const res=response();await routes[path]({body},res);return res;};
test('checkout validates prices, signatures, and capture before confirming payment',async()=>{
  process.env.RAZORPAY_KEY_ID='rzp_test_fixture';process.env.RAZORPAY_KEY_SECRET='fixture-secret';process.env.MONGODB_URI='fixture';
  providerCalls=[];
  global.fetch=async(url,options)=>{providerCalls.push({url,options});return {ok:true,json:async()=>url.endsWith('/orders')?{id:'order_fixture'}:{order_id:'order_fixture',amount:68200,currency:'INR',status:'captured'}};};
  let res=await invoke('/api/checkout/orders',{items:[{slug:'vitamin-c-face-wash',quantity:2}],amount:1});
  assert.equal(res.code,200);assert.equal(res.body.amount,68200);assert.equal(JSON.parse(providerCalls[0].options.body).amount,68200);
  for(const items of [[{slug:'unknown',quantity:1}],[{slug:'vitamin-c-face-wash',quantity:-1}],[{slug:'vitamin-c-face-wash',quantity:1.5}],Array(2).fill({slug:'vitamin-c-face-wash',quantity:1})]) assert.equal((await invoke('/api/checkout/orders',{items})).code,400);
  const payload={razorpay_order_id:'order_fixture',razorpay_payment_id:'pay_fixture',razorpay_signature:'0'.repeat(64)};
  assert.equal((await invoke('/api/checkout/verify',payload)).code,400);assert.equal(updated,undefined);
  payload.razorpay_signature=crypto.createHmac('sha256','fixture-secret').update('order_fixture|pay_fixture').digest('hex');
  global.fetch=async()=>({ok:true,json:async()=>({order_id:'order_fixture',amount:1,currency:'INR',status:'captured'})});
  assert.equal((await invoke('/api/checkout/verify',payload)).code,400);assert.equal(updated,undefined);
  global.fetch=async()=>({ok:true,json:async()=>({order_id:'order_fixture',amount:68200,currency:'INR',status:'authorized'})});
  assert.equal((await invoke('/api/checkout/verify',payload)).code,202);assert.equal(updated,undefined);
  global.fetch=async()=>({ok:true,json:async()=>({order_id:'order_fixture',amount:68200,currency:'INR',status:'captured'})});
  assert.equal((await invoke('/api/checkout/verify',payload)).body.verified,true);assert.equal(updated.$set.status,'paid');
  process.env.RAZORPAY_KEY_ID='rzp_live_fixture';assert.equal((await invoke('/api/checkout/orders',{})).code,503);
});
