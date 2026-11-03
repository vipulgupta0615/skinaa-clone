require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const next = require('next');
const { connectToDatabase, mongoose } = require('./lib/mongodb');
const { catalogue } = require('./lib/catalogue');
const Product = require('./models/Product');
const Routine = require('./models/Routine');
const Subscriber = require('./models/Subscriber');

const development = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || 3000);
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Next.js', 'Node.js'],
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.get('/api/catalogue', async (_req, res, nextHandler) => {
  try {
    const database = await connectToDatabase();
    const products = database ? await Product.find({}).lean() : catalogue;
    res.json({ products, source: database ? 'mongodb' : 'fallback-catalogue' });
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

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

async function startServer() {
  if (development) {
    const nextApp = next({ dev: true });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();
    app.use((req, res) => handle(req, res));
  } else {
    const outputDirectory = path.join(__dirname, 'out');
    app.use(express.static(outputDirectory));
    app.use((_req, res) => res.sendFile(path.join(outputDirectory, 'index.html')));
  }

  app.listen(port, () => {
    console.log(`SKINAA is running at http://localhost:${port}`);
  });

  connectToDatabase()
    .then((database) => console.log(database ? 'MongoDB connected.' : 'MongoDB is optional: running with local preview data.'))
    .catch((error) => console.warn(`MongoDB unavailable: ${error.message}`));
}

startServer().catch((error) => {
  console.error('Unable to start the server.', error);
  process.exit(1);
});
