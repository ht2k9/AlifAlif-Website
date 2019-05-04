const PORT = process.env.PORT || 8080;

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

app.set('view engine' , 'ejs');
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.redirect('/בניית-אתרים-לעסקים');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.redirect('/בניית-אתרים-לעסקים');
});

app.get('/*-*-*', (req, res) => {
    res.render('home');
});

app.get('/*', (req, res) => {
    res.render('error');
});

app.listen(PORT, ()=>{
    console.log(`listening to localhost:${PORT}`);
});