const express = require('express');
const fs = require('fs');
const router = express.Router();


// DATA

router.get('/', (req, res) => {
    fs.readFile('localbase/research.json', (err, data) => {
        if (err) throw err;

        const research = JSON.parse(data);

        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);
            
            res.render('research/index', {research, users, userID: 0});
        });
    }); 
});

router.post('/', (req, res) => {
    fs.readFile('localbase/research.json', (err, data) => {
        if (err) throw err;

        const research = JSON.parse(data);

        console.log(req.body);
        
        research.push(req.body);

        fs.writeFile('localbase/research.json', JSON.stringify(research) , function (err) {
            if (err) throw err;
                
            res.send({success: true});
        });
    });
});

// USER LOGIN / REGISTER

router.get('/users', (req, res) => {
    fs.readFile('localbase/research_users.json', (err, data) => {
        if (err) throw err;

        const users = JSON.parse(data);
        
        res.render('research/users', {users, userID: 0});
    });
});

router.post('/login', (req, res) => {
    fs.readFile('localbase/research_users.json', (err, data) => {
        if (err) throw err;

        const {id, username, password} = req.body;
        const users = JSON.parse(data);
        let userExists = false;
        let correctPass = false;

        console.log(req.body);
        
        users.forEach(user => {
            if(user.id == id) {
                userExists = true;
                correctPass = user.password == password;
            }
        });

        if(!userExists){
            users.push({
                id,
                username,
                password,
                active: false
            });
	    correctPass = true;
	}

        fs.writeFile('localbase/research_users.json', JSON.stringify(users) , function (err) {
            if (err) throw err;
                
            res.send({success: correctPass});
        });
    });
});

router.get('/:id', (req, res) => {
    fs.readFile('localbase/research.json', (err, data) => {
        if (err) throw err;

        const allResearch = JSON.parse(data);
        let research = [];

        allResearch.forEach(ree => {
            if(ree.user == req.params.id) {
                research.push(ree);
            }
        });

        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);
            
            res.render('research/index', {research, users, userID: req.params.id});
        });
    });
});

router.post('/:id', (req, res) => {
    fs.readFile('localbase/research_users.json', (err, data) => {
        if (err) throw err;

        const users = JSON.parse(data);
        
        users.forEach(user => {
            if(user.id == req.params.id) {
                user.active = req.body.isActive;
            }
        });

        fs.writeFile('localbase/research_users.json', JSON.stringify(users) , function (err) {
            if (err) throw err;
                
            res.redirect('/research/users')
        });
    });
});

module.exports = router;