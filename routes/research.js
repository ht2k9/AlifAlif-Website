const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    fs.readFile('localbase/research.json', (err, data) => {
        if (err) throw err;

        const research = JSON.parse(data);

        fs.readFile('localbase/research_users.json', (err, data) => {
            if (err) throw err;
    
            const users = JSON.parse(data);
            
            res.render('research/index', {research, users});
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
            
            res.render('research/index', {research, users});
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

module.exports = router;