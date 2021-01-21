const express = require('express');
const multer  = require('multer')
const fs = require('fs');
const router = express.Router();

const upload = multer({
    dest: "public/research/"
});

// DATA
router.get('/', (req, res) => {
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research_${today}.json`, (err, data) => {
    
        let research;

        if (err) research = [];
        else research = JSON.parse(data);
	
	    let 
        lightSleep = '',
        deepSleep = '',
        totalSleep = '',
        lightSleepMinutes = 0,
        deepSleepMinutes = 0,
        totalSleepMinutes = 0,
        lightSleepHours = 0,
        deepSleepHours = 0,
        totalSleepHours = 0,
        noiseAvg = 0,
        lightAvg = 0,
        sortedResearch = new Array(24).fill().map(u => ({time:0, light:0, noise:0, noiseCount:0, lightCount:0 }));

        for (let i = 0; i < research.length; i++) {
            let resHour = Number.parseInt(research[i].time.split(':')[0]);

            if(resHour >= 24) resHour -= 24;

            sortedResearch[resHour].user = research[i].user;

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
            if(sorted.noiseCount > 0) sorted.noise /= sorted.noiseCount;
            if(sorted.lightCount > 0) sorted.light /= sorted.lightCount;

            noiseAvg += sorted.noise;
            lightAvg += sorted.light;
        });
            
        noiseAvg /= sortedResearch.length;
        lightAvg /= sortedResearch.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        fs.readFile(`localbase/research_sleep_${today}.json`, (err, data) => {
            if (err) throw err;
    
            const sleep = JSON.parse(data);

            sleep.forEach(sl => {
                lightSleepHours += Number.parseInt(sl.lightSleep.split(':')[0]);
                deepSleepHours += Number.parseInt(sl.deepSleep.split(':')[0]);
                totalSleepHours += Number.parseInt(sl.totalSleep.split(':')[0]);

                lightSleepMinutes += Number.parseInt(sl.lightSleep.split(':')[1]);
                deepSleepMinutes += Number.parseInt(sl.deepSleep.split(':')[1]);
                totalSleepMinutes += Number.parseInt(sl.totalSleep.split(':')[1]);
            });

            lightSleep = `${lightSleepHours}:${lightSleepMinutes}`;
            deepSleep = `${deepSleepHours}:${deepSleepMinutes}`;
            totalSleep = `${totalSleepHours}:${totalSleepMinutes}`;

            fs.readFile('localbase/research_users.json', (err, data) => {
                if (err) throw err;
        
                const users = JSON.parse(data);
    
                res.render('research/index', {research, users, userID: 0, lightSleep, deepSleep, totalSleep, noiseAvg, lightAvg, sortedResearch});
            });
        });
    }); 
});

router.post('/', (req, res) => {
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research_${today}.json`, (err, data) => {
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

        fs.writeFile(`localbase/research_${today}.json`, JSON.stringify(research) , function (err) {
            if (err) throw err;
                
            res.send({success: true});
        });
    });
});

router.post('/sleep', upload.single('image'),  (req, res) => {
    let today = new Date().toISOString().slice(0, 10);

    fs.readFile(`localbase/research_sleep_${today}.json`, (err, data) => {
        let research;

        if (err) research = [];
        else research = JSON.parse(data);

        let filePath = null;

        if(req.file != null)
            filePath = req.file.path;

        research.push(req.body);

        if(filePath != null) {
		console.log(filePath);
            fs.rename(filePath, filePath+'.png', () => {
                research[research.length-1].photo = req.file.filename+'.png';
                
                fs.writeFile(`localbase/research_sleep_${today}.json`, JSON.stringify(research) , function (err) {
                    if (err) throw err;
                        
                    res.send({success: true});
                });
            }); 
        } else {
            fs.writeFile(`localbase/research_sleep_${today}.json`, JSON.stringify(research) , function (err) {
                if (err) throw err;
                    
                res.send({success: true});
            });
        }
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

    fs.readFile(`localbase/research_${today}.json`, (err, data) => {
        let allResearch;

        if (err) allResearch = [];
        else allResearch = JSON.parse(data);
        
        let
        lightSleep = '',
        deepSleep = '',
        totalSleep = '',
        lightSleepMinutes = 0,
        deepSleepMinutes = 0,
        totalSleepMinutes = 0,
        lightSleepHours = 0,
        deepSleepHours = 0,
        totalSleepHours = 0,
        noiseAvg = 0,
        lightAvg = 0,
        research = [],
        photos = [],
        sortedResearch = new Array(24).fill().map(u => ({time:0, light:0, noise:0, lightSleep:0, deepSleep:0, totalSleep:0, noiseCount:0, lightCount:0, user: req.params.id }));

        for (let i = 0; i < allResearch.length; i++) {
            if(allResearch[i].user == req.params.id) {
                research.push(allResearch[i]);

                let resHour = Number.parseInt(allResearch[i].time.split(':')[0]);

                if(resHour >= 24) resHour -= 24;
    
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

        sortedResearch.forEach(sorted => {
            if(sorted.noiseCount > 0) sorted.noise /= sorted.noiseCount;
            if(sorted.lightCount > 0) sorted.light /= sorted.lightCount;

            noiseAvg += sorted.noise;
            lightAvg += sorted.light;
        });
            
        noiseAvg /= sortedResearch.length;
        lightAvg /= sortedResearch.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        fs.readFile(`localbase/research_sleep_${today}.json`, (err, data) => {
            if (err) throw err;
    
            const sleep = JSON.parse(data);

            sleep.forEach(sl => {
                if(sl.user == req.params.id){
                    lightSleepHours += Number.parseInt(sl.lightSleep.split(':')[0]);
                    deepSleepHours += Number.parseInt(sl.deepSleep.split(':')[0]);
                    totalSleepHours += Number.parseInt(sl.totalSleep.split(':')[0]);
    
                    lightSleepMinutes += Number.parseInt(sl.lightSleep.split(':')[1]);
                    deepSleepMinutes += Number.parseInt(sl.deepSleep.split(':')[1]);
                    totalSleepMinutes += Number.parseInt(sl.totalSleep.split(':')[1]);

                    if(sl.photo != null)
                        photos.push(sl.photo);
                }
            });

            lightSleep = `${lightSleepHours}:${lightSleepMinutes}`;
            deepSleep = `${deepSleepHours}:${deepSleepMinutes}`;
            totalSleep = `${totalSleepHours}:${totalSleepMinutes}`;

            fs.readFile('localbase/research_users.json', (err, data) => {
                if (err) throw err;
        
                const users = JSON.parse(data);
    
                res.render('research/index', {photos, research, users, userID: 0, lightSleep, deepSleep, totalSleep, noiseAvg, lightAvg, sortedResearch});
            });
        });
    });
});

router.get('/filter/:date', (req, res) => {
    console.log(req.params.date);
    fs.readFile(`localbase/research_${req.params.date}.json`, (err, data) => {
        let research;

        if (err) research = [];
        else research = JSON.parse(data);
	
        let
        lightSleep = '',
        deepSleep = '',
        totalSleep = '',
        lightSleepMinutes = 0,
        deepSleepMinutes = 0,
        totalSleepMinutes = 0,
        lightSleepHours = 0,
        deepSleepHours = 0,
        totalSleepHours = 0,
        noiseAvg = 0,
        lightAvg = 0,
        sortedResearch = new Array(24).fill().map(u => ({time:0, light:0, noise:0, lightSleep:0, deepSleep:0, totalSleep:0, noiseCount:0, lightCount:0 }));

        for (let i = 0; i < research.length; i++) {
            let resHour = Number.parseInt(research[i].time.split(':')[0]);

            if(resHour >= 24) resHour -= 24;

            sortedResearch[resHour].user = research[i].user;

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

            if(sorted.noiseCount > 0) sorted.noise /= sorted.noiseCount;
            if(sorted.lightCount > 0) sorted.light /= sorted.lightCount;

            noiseAvg += sorted.noise;
            lightAvg += sorted.light;
        });
            
        noiseAvg /= sortedResearch.length;
        lightAvg /= sortedResearch.length;

        noiseAvg = noiseAvg.toFixed(2);
        lightAvg = lightAvg.toFixed(2);

        fs.readFile(`localbase/research_sleep_${req.params.date}.json`, (err, data) => {
            let sleep;

            if (err) sleep = [];
            else sleep = JSON.parse(data);
    

            sleep.forEach(sl => {
                lightSleepHours += Number.parseInt(sl.lightSleep.split(':')[0]);
                deepSleepHours += Number.parseInt(sl.deepSleep.split(':')[0]);
                totalSleepHours += Number.parseInt(sl.totalSleep.split(':')[0]);

                lightSleepMinutes += Number.parseInt(sl.lightSleep.split(':')[1]);
                deepSleepMinutes += Number.parseInt(sl.deepSleep.split(':')[1]);
                totalSleepMinutes += Number.parseInt(sl.totalSleep.split(':')[1]);
            });

            lightSleep = `${lightSleepHours}:${lightSleepMinutes}`;
            deepSleep = `${deepSleepHours}:${deepSleepMinutes}`;
            totalSleep = `${totalSleepHours}:${totalSleepMinutes}`;

            fs.readFile('localbase/research_users.json', (err, data) => {
                if (err) throw err;
        
                const users = JSON.parse(data);
    
                res.render('research/index', {research, users, userID: 0, lightSleep, deepSleep, totalSleep, noiseAvg, lightAvg, sortedResearch});
            });
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
