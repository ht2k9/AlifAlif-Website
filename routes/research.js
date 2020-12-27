const express = require('express');
const fs = require('fs');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', (req, res) => {
    fs.readFile('localbase/research.json', (err, data) => {
        if (err) throw err;

        const research = JSON.parse(data);
        
        res.render('research/index', {research});
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