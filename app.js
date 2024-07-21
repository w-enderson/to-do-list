const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Todo list');
});




app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})