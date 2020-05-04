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

// ***************************************************** Digital Card ****************************************/

app.get('/digitalcard', (req, res) => {
    res.render('digitalcard/dashboard');
});

app.get('/digitalcard/show/:id', (req, res) => {
    res.render('digitalcard/test', {vcard: {}});
});

app.get('/digitalcard/add', (req, res) => {
    res.render('digitalcard/new-card', {vcard: {}});
});

app.post('/digitalcard/add', (req, res) => {
    res.render('digitalcard/dashboard');
});

app.post('/digitalcard/update', (req, res) => {
    res.render('digitalcard/dashboard');
});

app.post('/digitalcard/delete', (req, res) => {
    res.render('digitalcard/dashboard');
});

// ***************************************************** Digital Card ****************************************/


// ***************************************************** QUIZ ****************************************/

app.get('/keyadakadera', (req, res) => {
    fs.readFile('localbase/questions.json', (err, dataQ) => {
        if (err) throw err;
        let questions = JSON.parse(dataQ);
        fs.readFile('localbase/users.json', (err, dataU) => {
            if (err) throw err;
            let users = JSON.parse(dataU);
            res.render('movement', {questions: questions, users:users});
        });
    });
});

app.get('/quiz/get/questions', (req, res) => {
    fs.readFile('localbase/questions.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});

app.get('/quiz/get/user', (req, res) => {
    fs.readFile('localbase/users.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});



app.post('/movement', (req, res) => {
    fs.readFile('localbase/users.json', (err, data) => {
        
        if (err) throw err;

        let users = JSON.parse(data);
        
        users.push( 
            {
                username: req.body.name,
                phone: req.body.phone,
                score: req.body.score
            }
        );

        fs.writeFile('localbase/users.json', JSON.stringify(users) , function (err) {
            if (err) throw err;
                
            res.redirect('/keyadakadera');
        });
    });
});

app.get('/quiz/admin', (req, res) => {
    res.render('quiz/log-quiz');
});

app.post('/quiz/admin', (req, res) => {
    if(req.body.password == "Jej315441"){
        fs.readFile('localbase/questions.json', (err, dataQ) => {
            if (err) throw err;
            let questions = JSON.parse(dataQ);
            fs.readFile('localbase/users.json', (err, dataU) => {
                if (err) throw err;
                let users = JSON.parse(dataU);
                users.sort(function(a, b){
                    return parseInt(b.score)-parseInt(a.score);
                });

                let winners = [];
                let max = 0;

                for(let i=0; i<users.length; i++){
                    let val = parseInt(users[i].score);

                    if(val> max){
                        max = val;
                    }
                }

                for(let i=0; i<users.length; i++){
                    let val = parseInt(users[i].score);
                    if(val == max){
                        winners.push(users[i]);
                    }
                }
                
                res.render('quiz/all-quiz', {questions: questions, users:users, winners: winners});
            });
        });
    }
});

app.get('/quiz/add', (req, res) => {
    res.render('quiz/add-quiz', {question: null});
});

app.get('/quiz/show/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);

        res.render('quiz/update-quiz', {question:(questions[req.params.id]), id: req.params.id});
    });
});

app.post('/quiz/update/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);

        questions[req.params.id] = 
            {
                question : req.body.question,
                choiceA : req.body.answer1,
                choiceB : req.body.answer2,
                choiceC : req.body.answer3,
                choiceD : req.body.answer4,
                correct : req.body.Canswer
            }
        
            fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
                if (err) throw err;
                    
                res.redirect('/quiz/admin');
            });
    });
});

app.get('/quiz/delete/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
        
        questions.splice(req.params.id, 1);

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
            if (err) throw err;
                
            res.redirect('/quiz/admin');
        });
    });
});
app.get('/quiz/get/users', (req, res) => {
    fs.readFile('localbase/users.json', (err, data) => {
        
        if (err) throw err;
        users = JSON.parse(data);

        res.send(users);
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
                choiceD : req.body.answer4,
                correct : req.body.Canswer
            }
        );

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
            if (err) throw err;
                
            res.redirect('/quiz/add');
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

function sortNumber(a, b) {
    return a - b;
}