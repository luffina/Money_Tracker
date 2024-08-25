const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const Transaction = require('./models/Transaction');

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Setting views directory

// Routes
app.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.render('index', { transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add', async (req, res) => {
  const { category_select, amount_input, info, date_input } = req.body;

  if (!category_select || !amount_input || !info || !date_input) {
    return res.status(400).send('All fields are required.');
  }

  const newTransaction = new Transaction({
    category: category_select,
    amount: parseFloat(amount_input),
    info,
    date: new Date(date_input),
  });

  try {
    await newTransaction.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
