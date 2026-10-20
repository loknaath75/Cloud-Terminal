require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { MongoClient, ObjectId } = require('mongodb');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
}

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://loknaath759106_db_user:webdev%4014@cluster0.unn59vq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(MONGODB_URI);

let db;
let transactionsCol;
let settingsCol;
let dbError = null;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    db = client.db('spendwise');
    transactionsCol = db.collection('transactions');
    settingsCol = db.collection('settings');
    dbError = null;
  } catch (err) {
    dbError = err.message;
    console.error('❌ Error connecting to MongoDB Atlas:', err.message);
    console.error('⚠️ Server will run, but database queries will fail until MongoDB Atlas credentials are valid.');
  }
}

async function disconnectFromMongoDB() {
  await client.close();
  console.log('🔌 Disconnected from MongoDB Atlas.');
}

process.on('SIGINT', async () => {
  await disconnectFromMongoDB();
  process.exit(0);
});

async function getOrInitSettings() {
  let settings = await settingsCol.findOne({});
  if (!settings) {
    await settingsCol.insertOne({ budget: 2000, currency: '₹' });
    settings = await settingsCol.findOne({});
  }
  return settings;
}

function formatDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  const idStr = _id ? _id.toString() : (doc.id || '');
  return { id: idStr, ...rest };
}

app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  if (!db) {
    return res.status(503).json({
      error: 'Database not connected. Please verify your MongoDB Atlas username/password in backend/.env',
      details: dbError
    });
  }
  next();
});

app.get('/api/state', async (req, res) => {
  try {
    const settings = await getOrInitSettings();
    const transactions = await transactionsCol
      .find({})
      .sort({ date: -1, _id: -1 })
      .toArray();

    res.json({
      transactions: transactions.map(formatDoc),
      budget: settings.budget,
      currency: settings.currency
    });
  } catch (err) {
    console.error('Error fetching state:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Add a transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, date, category, type, notes } = req.body;

    if (!title || !amount || !date || !category || !type) {
      return res.status(400).json({ error: 'Missing required transaction fields' });
    }

    const newTx = {
      title: title.trim(),
      amount: parseFloat(amount),
      date,
      category,
      type,
      notes: notes ? notes.trim() : undefined,
      createdAt: new Date()
    };

    const result = await transactionsCol.insertOne(newTx);
    res.status(201).json(formatDoc({ _id: result.insertedId, ...newTx }));
  } catch (err) {
    console.error('Error adding transaction:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Delete a transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id };
    const result = await transactionsCol.deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting transaction:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3b. Update a transaction by ID
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, category, type, notes } = req.body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (date) updates.date = date;
    if (category) updates.category = category;
    if (type) updates.type = type;
    if (notes !== undefined) updates.notes = notes ? notes.trim() : '';

    const filter = ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id };
    const result = await transactionsCol.findOneAndUpdate(
      filter,
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(formatDoc(result));
  } catch (err) {
    console.error('Error updating transaction:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Update settings (budget and/or currency)
app.post('/api/settings', async (req, res) => {
  try {
    const { budget, currency } = req.body;
    const updates = {};

    if (budget !== undefined) updates.budget = Math.max(0, parseFloat(budget) || 0);
    if (currency !== undefined) updates.currency = currency;

    await settingsCol.updateOne({}, { $set: updates }, { upsert: true });
    const settings = await settingsCol.findOne({});

    res.json({ success: true, budget: settings.budget, currency: settings.currency });
  } catch (err) {
    console.error('Error updating settings:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Seed sample transactions (Indian Rupee amounts)
app.post('/api/seed', async (req, res) => {
  try {
    const today = new Date();
    const formatDate = (offset) => {
      const d = new Date();
      d.setDate(today.getDate() - offset);
      return d.toISOString().split('T')[0];
    };

    const sampleTransactions = [
      { title: 'Monthly Salary', amount: 55000, date: formatDate(5), category: 'Income', type: 'income', notes: 'Monthly payroll' },
      { title: 'House Rent', amount: 14000, date: formatDate(6), category: 'Utilities', type: 'expense', notes: 'Monthly rent transfer' },
      { title: 'Grocery Shopping', amount: 2200, date: formatDate(4), category: 'Food', type: 'expense', notes: 'Supermarket' },
      { title: 'Petrol Fill-up', amount: 950, date: formatDate(3), category: 'Transport', type: 'expense' },
      { title: 'Restaurant Dinner', amount: 1400, date: formatDate(2), category: 'Food', type: 'expense', notes: 'Dinner with friends' },
      { title: 'Movie Tickets', amount: 600, date: formatDate(2), category: 'Entertainment', type: 'expense' },
      { title: 'Gym Membership', amount: 1200, date: formatDate(1), category: 'Shopping', type: 'expense', notes: 'Monthly fee' },
      { title: 'Freelance Project', amount: 12000, date: formatDate(1), category: 'Income', type: 'income', notes: 'Web development' },
      { title: 'Morning Tea & Snacks', amount: 180, date: formatDate(0), category: 'Food', type: 'expense', notes: 'Office canteen' },
      { title: 'Clothes Shopping', amount: 3200, date: formatDate(0), category: 'Shopping', type: 'expense', notes: 'Festive shopping' },
    ].map(tx => ({ ...tx, createdAt: new Date() }));

    await transactionsCol.deleteMany({});
    const result = await transactionsCol.insertMany(sampleTransactions);

    const insertedIds = Object.values(result.insertedIds);
    const seeded = sampleTransactions.map((tx, i) =>
      formatDoc({ _id: insertedIds[i], ...tx })
    );

    const settings = await getOrInitSettings();

    res.json({
      transactions: seeded,
      budget: settings.budget,
      currency: settings.currency
    });
  } catch (err) {
    console.error('Error seeding data:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. Reset all transactions
app.post('/api/reset', async (req, res) => {
  try {
    await transactionsCol.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    console.error('Error resetting transactions:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve built frontend static files
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  if (fs.existsSync(path.join(frontendBuildPath, 'index.html'))) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    res.status(404).send('Build the frontend to serve the UI here.');
  }
});

// Start server immediately & attempt DB connection
app.listen(PORT, () => {
  console.log(`🚀 SpendWise server running on http://localhost:${PORT}`);
  connectToMongoDB();
});
