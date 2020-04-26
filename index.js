const PORT = process.env.PORT || 8080;

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const events = require('./events.json');
const fs = require('fs');

const app = express();

app.set('view engine' , 'ejs');
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/flipbook/carpentryforeverything', (req, res) => {
    res.render('carpentryforeverything');
});

app.get('/example/ecommerce/:page', (req, res) => {
    res.render('examples/ecommerce/'+req.params.page);
});

app.get('/example/real-estate/:page', (req, res) => {
    res.render('examples/realestate/'+req.params.page);
});

app.get('/example/:site', (req, res) => {
    res.render('examples/'+req.params.site);
});

app.get('/marketing', (req, res) => {
    res.render('marketing');
});

app.get('/events', (req, res) => {
    res.render('events', {events: events});
});
// ***************************************************** QUIZ ****************************************/

app.get('/movement', (req, res) => {
    res.render('movement');
});

// app.get('/quiz/admin', (req, res) => {
//     res.render('quiz/log-quiz');
// });

// app.post('/quiz/admin', (req, res) => {
//     if(req.body.password == "Jej315441")
//         res.render('quiz/all-quiz');
// });

// app.get('/quiz/add', (req, res) => {
//     res.render('quiz/add-quiz');
// });

// app.get('/quiz/show', (req, res) => {
//     fs.readFile('localbase/questions.json', (err, data) => {
//         if (err) throw err;
//         questions = JSON.parse(data);
//     });
//     res.render('quiz/all-quiz');
// });

app.get('/quiz/jsondata', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        if (err) throw err;
        questions = JSON.parse(data);
        console.log("calling data of: "+ questions);
        res.send(questions);
    });
});


app.post('/quiz/admin/questions', (req, res) => {
    let questions = [];

    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
        
        questions.push( 
            {
                question : req.body.question,
                choiceA : req.body.answer1,
                choiceB : req.body.answer2,
                choiceC : req.body.answer3,
                correct : req.body.Canswer
            }
        );

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
            if (err) throw err;
                
            res.redirect('/quiz/show');
        });
    });
});

// ***************************************************** QUIZ ****************************************/

app.get('/events/:index', (req, res) => {
    res.render('computer-event', events[req.params.index]);
});

app.get('/register-success', (req, res) => {
    res.render('success');
});

app.get('/costumer/:id', (req, res) => {
    if(req.params.id == 'wW58Rrf8'){
        res.render('inovice');
    }
});

app.post('/', (req, res) => {
      // send mail with defined transport object
    let data = `From: ${req.body.name}, 
                Contact Information: ${req.body.email}, 
                Subject: ${req.body.subject}`;

    fs.appendFile('websites.txt', data , function (err) {
        if (err) throw err;
            
        res.redirect('/');
    });
});

app.post('/register', (req, res) => {
    // send mail with defined transport object
  let data = `Name: ${req.body.name} | Phone: ${req.body.phone} | Course: ${req.body.course} \n`;

  fs.appendFile('courses.txt', data , function (err) {
      if (err) throw err;
          
      res.redirect('/register-success');
  });
});


app.get('/brbmyfriend', (req, res) => {
    fs.readFile('courses.txt', function read(err, data) {
        if (err) {
            throw err;
        }
        res.render('data', {data: data});
    });
});

app.get('/*', (req, res) => {
    res.render('error');
});

app.listen(PORT, ()=>{
    console.log(`listening to localhost:${PORT}`);
});