require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());


const url = process.env.MONGODB_URL

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

app.use(cors());

app.listen(port, () =>
{
console.log(`API served at http://localhost:${port}`);
}
);

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, required: true },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-Fa-f]{6}$/, 
    },
  });

const Budget = mongoose.model('Budget', budgetSchema);

app.get('/budget', async (req, res) => {
    try {
      const data = await Budget.find();
      res.json(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/budget', async (req, res) => {
    try {
      const { title, budget, color } = req.body;
      const newEntry = new Budget({ title, budget, color });
      await newEntry.save();
      res.status(201).json(newEntry);
    } catch (err) {
      console.error('Error adding data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

 app.use('/',express.static('public'));
