const express = require('express');
const fileSystem = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;
const importJSON = fileSystem.readFileSync('data.json', 'utf8');
const budgetData = JSON.parse(importJSON);

app.use(cors());

app.listen(port, () =>
{
console.log(`API served at http://localhost:${port}`);
}
);

app.get('/budget', (req, res) => {
    res.json(budgetData);
});

// app.use('/',express.static('public'));


