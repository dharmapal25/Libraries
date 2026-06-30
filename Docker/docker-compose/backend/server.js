const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.get('/api/data', (req, res) => {
    const data = {
        message: 'This is a sample server.',
        timestamp: new Date(),
    };
    res.json(data);
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'David' },
        { id: 5, name: 'Eve' },
    ];
    res.json(users);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});