const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/get/questions', (req, res) => {
    fs.readFile('localbase/questions.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});

router.get('/get/user', (req, res) => {
    fs.readFile('localbase/users.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});



router.post('/movement', (req, res) => {
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

router.get('/admin', (req, res) => {
    res.render('quiz/log-quiz');
});

router.post('/admin', (req, res) => {
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

router.get('/add', (req, res) => {
    res.render('quiz/add-quiz', {question: null});
});

router.get('/show/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);

        res.render('quiz/update-quiz', {question:(questions[req.params.id]), id: req.params.id});
    });
});

router.post('/update/:id', (req, res) => {
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
                    
                res.redirect('/admin');
            });
    });
});

router.get('/delete/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
        
        questions.splice(req.params.id, 1);

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
            if (err) throw err;
                
            res.redirect('/admin');
        });
    });
});
router.get('/get/users', (req, res) => {
    fs.readFile('localbase/users.json', (err, data) => {
        
        if (err) throw err;
        users = JSON.parse(data);

        res.send(users);
    });
});
router.post('/admin/questions', (req, res) => {
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
                
            res.redirect('/add');
        });
    });
});

module.exports = router;