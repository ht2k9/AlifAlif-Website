const express = require('express');
const fs = require('fs');
const router = express.Router();


// DATA
router.get('/', (req, res) => {
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research${today}.json`, (err, data) => {
        let research;

        if (err) research = [];
        else research = JSON.parse(data);
        
        let lightSleep = 0,
        deepSleep = 0,
        noiseAvg = 0,
        lightAvg = 0,
        totalSleep = 0;

        research.forEach(res => {
            lightSleep += res.lightSleep;
            deepSleep += res.deepSleep;

            const noise = Number.parseFloat(res.noise);
            const light = Number.parseFloat(res.light);

            if(noise > 0 && noise < 1000)
                noiseAvg += noise;
            if(light > 0 && light < 1000)
                lightAvg += light;
        });

        console.log(lightSleep);

        noiseAvg /= research.length;
        lightAvg /= research.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        totalSleep = lightSleep + deepSleep;
        
        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);

            res.render('research/index', {research, users, userID: 0, lightSleep, deepSleep, noiseAvg, lightAvg, totalSleep});
        });
    }); 
});

router.post('/', (req, res) => {
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research${today}.json`, (err, data) => {
        let research;
        const date = new Date();

        if (err) research = [];
        else research = JSON.parse(data);

        const{noise, light, deepSleep, lightSleep, totalSleep} = req.body;

        research.push(
            {
                noise,
                light,
                deepSleep,
                lightSleep,
                totalSleep,
                date: today,
                time: date.getHours(),
            }
        );

        fs.writeFile(`localbase/research${today}.json`, JSON.stringify(research) , function (err) {
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
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research${today}.json`, (err, data) => {
        let allResearch;

        if (err) allResearch = [];
        else allResearch = JSON.parse(data);
        
        let lightSleep = 0,
        deepSleep = 0,
        noiseAvg = 0,
        lightAvg = 0,
        totalSleep = 0;

        let research = [];

        allResearch.forEach(res => {
            if(res.user == req.params.id) {
                research.push(res);
                
                lightSleep += res.lightSleep;
                deepSleep += res.deepSleep;
    
                const noise = Number.parseFloat(res.noise);
                const light = Number.parseFloat(res.light);

                if(noise > 0 && noise < 1000)
                    noiseAvg += noise;
                if(light > 0 && light < 1000)
                    lightAvg += light;
            }
        });

        noiseAvg /= research.length;
        lightAvg /= research.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        totalSleep = lightSleep + deepSleep;


        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);
            
            res.render('research/index', {research, users, userID: req.params.id, lightSleep, deepSleep, noiseAvg, lightAvg, totalSleep});
        });
    });
});

router.post('/user_active', (req, res) => {
    fs.readFile('localbase/research_users.json', (err, data) => {
        if (err) throw err;

        const allResearch = JSON.parse(data);
        let isActive = false;

        allResearch.forEach(user => {
            if(user.id == req.body.id) {
                isActive = user.active;
            }
        });

        res.send({success: isActive});
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

        console.log(req.body);

        fs.writeFile('localbase/research_users.json', JSON.stringify(users) , function (err) {
            if (err) throw err;
                
            res.redirect('/research/users')
        });
    });
});

module.exports = router;