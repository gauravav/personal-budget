require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());
const ColorDifference = require('color-difference');



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

        // Check if a budget entry with the same title exists
        const existingTitleEntry = await Budget.findOne({ title });

        // Check if a budget entry with the same color exists
        const existingColorEntry = await Budget.findOne({ color });

        // Check if a similar color exists
        const colors = await Budget.find({}, 'color');
        const similarColorEntry = colors.find((entry) => {
            const similarity = ColorDifference.compare(entry.color, color);
            // Adjust the threshold as needed; lower values make colors more similar
            const similarityThreshold = 10;
            return similarity <= similarityThreshold;
        });

        if (existingTitleEntry) {
            return res.status(400).json({ error: 'Title already exists' });
        }

        if (existingColorEntry) {
            return res.status(400).json({ error: 'Color already exists' });
        }

        if (similarColorEntry) {
            return res.status(400).json({ error: 'Similar color already exists' });
        }

        const newEntry = new Budget({ title, budget, color });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        console.error('Error adding data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

 app.use('/',express.static('public'));

 app.use('/addBudget',express.static('public/addBudget.html'));
