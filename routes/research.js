const { time } = require('console');
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
        
        let avgCounter = 0.0,
        lightSleep = 0,
        deepSleep = 0,
        noiseAvg = 0,
        lightAvg = 0,
        totalSleep = 0,
        sortedResearch = new Array(24).fill().map(u => ({time:0, light:0, noise:0, lightSleep:0, deepSleep:0, totalSleep:0, noiseCount:0, lightCount:0 }));

        for (let i = 0; i < research.length; i++) {
            let resHour = Number.parseInt(research[i].time.split(':')[0]);

            sortedResearch[resHour].user = research[i].user;

            sortedResearch[resHour].lightSleep = Number.parseInt(research[i].lightSleep);
            sortedResearch[resHour].deepSleep = Number.parseInt(research[i].deepSleep);
            sortedResearch[resHour].totalSleep = Number.parseInt(research[i].totalSleep);

            sortedResearch[resHour].time = resHour;

            const noise = Number.parseFloat(research[i].noise);
            const light = Number.parseFloat(research[i].light);


            if(noise > 0 && noise < 1000){
                sortedResearch[resHour].noise += noise;
                sortedResearch[resHour].noiseCount++;

            }
            if(light > 0 && light < 1000){
                sortedResearch[resHour].light += light;
                sortedResearch[resHour].lightCount++;
            }
        }

        sortedResearch.forEach(sorted => {
            lightSleep += sorted.lightSleep;
            deepSleep += sorted.deepSleep;
            totalSleep += sorted.totalSleep;

            if(sorted.noiseCount > 0) sorted.noise /= sorted.noiseCount;
            if(sorted.lightCount > 0) sorted.light /= sorted.lightCount;

            noiseAvg += sorted.noise;
            lightAvg += sorted.light;

            if(sorted.totalSleep > 0) {
                avgCounter++;
            }
        });

        lightSleep /= 60;
        deepSleep /= 60;
        totalSleep /= 60;
            
        noiseAvg /= sortedResearch.length;
        lightAvg /= sortedResearch.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);

            res.render('research/index', {research, users, userID: 0, lightSleep, deepSleep, noiseAvg, lightAvg, totalSleep, sortedResearch});
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

        const{awake, user, noise, light, deepSleep, lightSleep, totalSleep} = req.body;

        research.push(
            {
                noise,
                light,
		        awake,
                deepSleep,
                user,
                lightSleep,
                totalSleep,
                date: today,
                time: `${date.getHours()+2}:${date.getMinutes()}`,
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
        
        let avgCounter = 0,
        lightSleep = 0,
        deepSleep = 0,
        noiseAvg = 0,
        lightAvg = 0,
        totalSleep = 0,
        sortedResearch = new Array(24).fill().map(u => ({time:0, light:0, noise:0, lightSleep:0, deepSleep:0, totalSleep:0, noiseCount:0, lightCount:0, user: req.params.id }));

        for (let i = 0; i < allResearch.length; i++) {
            if(allResearch[i].user == req.params.id) {
                let resHour = Number.parseInt(research[i].time.split(':')[0]);

                sortedResearch[resHour].lightSleep = Number.parseInt(allResearch[i].lightSleep);
                sortedResearch[resHour].deepSleep = Number.parseInt(allResearch[i].deepSleep);
                sortedResearch[resHour].totalSleep = Number.parseInt(allResearch[i].totalSleep);
    
                sortedResearch[resHour].time = resHour;
    
                const noise = Number.parseFloat(allResearch[i].noise);
                const light = Number.parseFloat(allResearch[i].light);
    
    
                if(noise > 0 && noise < 1000){
                    sortedResearch[resHour].noise += noise;
                    sortedResearch[resHour].noiseCount++;
    
                }
                if(light > 0 && light < 1000){
                    sortedResearch[resHour].light += light;
                    sortedResearch[resHour].lightCount++;
                }
            }
            
        }

        let research = [];

        sortedResearch.forEach(sorted => {
            lightSleep += sorted.lightSleep;
            deepSleep += sorted.deepSleep;
            totalSleep += sorted.totalSleep;

            if(sorted.noiseCount > 0) sorted.noise /= sorted.noiseCount;
            if(sorted.lightCount > 0) sorted.light /= sorted.lightCount;

            noiseAvg += sorted.noise;
            lightAvg += sorted.light;

            if(sorted.totalSleep > 0) {
                avgCounter++;
            }
        });

        lightSleep /= 60;
        deepSleep /= 60;
        totalSleep /= 60;
            
        noiseAvg /= avgCounter;
        lightAvg /= avgCounter;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);


        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);
            
            res.render('research/index', {research: allResearch, users, userID: req.params.id, lightSleep, deepSleep, noiseAvg, lightAvg, totalSleep, sortedResearch});
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
