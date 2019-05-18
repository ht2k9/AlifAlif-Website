const PORT = process.env.PORT || 8080;

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'abbasa4696@gmail.com',
      pass: ''
    }
  });

const app = express();

app.set('view engine' , 'ejs');
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/example/:site', (req, res) => {
    res.render('examples/'+req.params.site);
});

app.get('/example/real-estate/:page', (req, res) => {
    res.render('examples/realestate/'+req.params.page);
});

app.post('/', (req, res) => {
      // send mail with defined transport object
  let mailOptions = {
    from: 'abbasa4696@gmail.com', // sender address
    to: 'ahmed_abbas22@hotmail.com', // list of receivers
    subject: "New Client Contacted AlifAlif", // Subject line
    text: `<h2>From: ${req.body.name}</h2>
                <h3>Contact Information: ${req.body.email}
                <p>${req.body.subject}</p>`
  };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {console.log(error);}
        else{
            console.log("message sent: "+info.messageId);
            res.redirect('/');
        }
    });
});

app.get('/*', (req, res) => {
    res.render('error');
});

app.listen(PORT, ()=>{
    console.log(`listening to localhost:${PORT}`);
});