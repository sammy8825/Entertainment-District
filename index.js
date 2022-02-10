const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();

const port = 8800;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing', {message: 'This is the message passed from the index.js file'});
});

app.listen(port, () => {
    console.log(`Listening to post ${port}`);
});