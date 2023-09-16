const express = require('express');
const app = express();
const port = 3100;

app.get('/hello', (req, res) => 
{
res.send('Hello World!');
});

app.listen(port, () =>
{
console.log(`Example app listening at http://localhost:${port}`);
}
);

const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 33
        },
        {
            title: 'Rent',
            budget: 33
        },
        {
            title: 'Grocery',
            budget: 34
        },
    ]
};

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.use('/',express.static('public'));


