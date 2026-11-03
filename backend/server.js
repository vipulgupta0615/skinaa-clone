require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase, mongoose } = require('./lib/mongodb');
const { catalogue } = require('./lib/catalogue');
const Product = require('./models/Product');
const Routine = require('./models/Routine');
const Subscriber = require('./models/Subscriber');

const port = Number(process.env.PORT || 4000);
const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  }
}));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'skinaa-api',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Next.js', 'Node.js'],
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.get('/api/catalogue', async (_req, res, nextHandler) => {
  try {
    const database = await connectToDatabase();
    const products = database ? await Product.find({}).lean() : catalogue;
    res.json({ products: products.map(product => ({ ...product, shopUrl: `/products/${encodeURIComponent(product.slug)}` })), source: database ? 'mongodb' : 'fallback-catalogue' });
  } catch (error) {
    nextHandler(error);
  }
});

app.post('/api/routines', async (req, res, nextHandler) => {
  const { timeOfDay, steps, total, email } = req.body || {};
  if (!['AM', 'PM'].includes(timeOfDay) || !Array.isArray(steps) || !steps.length || !Number.isFinite(total)) {
    return res.status(400).json({ error: 'A time of day, at least one routine step, and a valid total are required.' });
  }

  try {
    const database = await connectToDatabase();
    if (!database) return res.status(202).json({ saved: false, mode: 'local-preview' });
    const routine = await Routine.create({ timeOfDay, steps, total, email });
    return res.status(201).json({ saved: true, routineId: routine.id });
  } catch (error) {
    return nextHandler(error);
  }
});

app.post('/api/subscribers', async (req, res, nextHandler) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });

  try {
    const database = await connectToDatabase();
    if (!database) return res.status(202).json({ saved: false, mode: 'local-preview' });
    await Subscriber.updateOne({ email }, { $setOnInsert: { email, source: 'homepage' } }, { upsert: true });
    return res.status(201).json({ saved: true });
  } catch (error) {
    return nextHandler(error);
  }
});

async function startServer() {
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((error, _req, res, _next) => {
    const status = error.message === 'Origin is not allowed by CORS.' ? 403 : 500;
    if (status === 500) console.error(error);
    res.status(status).json({ error: status === 403 ? error.message : 'Something went wrong. Please try again.' });
  });

  app.listen(port, () => {
    console.log(`SKINAA API is running at http://localhost:${port}`);
  });

  connectToDatabase()
    .then((database) => console.log(database ? 'MongoDB connected.' : 'MongoDB is optional: running with local preview data.'))
    .catch((error) => console.warn(`MongoDB unavailable: ${error.message}`));
}

startServer().catch((error) => {
  console.error('Unable to start the server.', error);
  process.exit(1);
});
