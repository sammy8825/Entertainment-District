const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();

const port = 8800;

app.use('/images', express.static('images'));
app.use('/css', express.static('css'));

// For Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.listen(port, () => {
    console.log(`Listening to post ${port}`);
});