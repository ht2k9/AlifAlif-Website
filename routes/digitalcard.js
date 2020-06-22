const express = require('express');
const fs = require('fs');
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: "public/vcards/"
});

router.get('/admin', (req, res) => {
    fs.readFile('localbase/vcards.json', (err, dataQ) => {
        if (err) throw err;
        let vcards = JSON.parse(dataQ);
        
        res.render('digitalcard/dashboard', {vcards: vcards});
    });
});

router.get('/show/:id', (req, res) => {
    fs.readFile('localbase/vcards.json', (err, dataQ) => {
        if (err) throw err;
        let vcards = JSON.parse(dataQ);
        
        res.render('digitalcard/vcard', {vcard: vcards[req.params.id]});
    });
});

router.get('/add', (req, res) => {
    res.render('digitalcard/new-card');
});

router.get('/update/:id', (req, res) => {
    fs.readFile('localbase/vcards.json', (err, data) => {
        
        if (err) throw err;
        vcards = JSON.parse(data);
        
        res.render('digitalcard/edit-card', {vcard: vcards[req.params.id], index: req.params.id });

    });
});

router.post('/add', upload.single('logo'), (req, res) => {
    fs.readFile('localbase/vcards.json', (err, data) => {
        if (err) throw err;

        const filePath = req.file.path;

        let phoneList = [];
        for(let i=1; i<=req.body.phoneCount; i++){
            phoneList.push(
                {
                    title: req.body['title'+i],
                    number: req.body['phone'+i]
                }
            );
        }

        vcards = JSON.parse(data);

        fs.rename(filePath, filePath+'.png', () => {
            vcards.push( 
                {
                    business: req.body.business,
                    logo : req.file.filename+'.png',
                    bg: {link: req.body.bglink, type: req.body.bgtype },
                    facebook: {title: req.body.facebook1, link: req.body.facebook2 },
                    waze: {title: req.body.waze1, link: req.body.waze2 },
                    instagram: {title: req.body.instagram1, link: req.body.instagram2 },
                    whatsrouter: {title: req.body.whatsrouter1, link: req.body.whatsrouter2 },
                    phones : phoneList,
                    day1 : {start:req.body.days1, end: req.body.daye1},
                    day2 : {start:req.body.days2, end: req.body.daye2},
                    day3 : {start:req.body.days3, end: req.body.daye3},
                    day4 : {start:req.body.days4, end: req.body.daye4},
                    day5 : {start:req.body.days5, end: req.body.daye5},
                    day6 : {start:req.body.days6, end: req.body.daye6},
                    day7 : {start:req.body.days7, end: req.body.daye7},
                }
            );

            fs.writeFile('localbase/vcards.json', JSON.stringify(vcards) , function (err) {
                if (err) throw err;
                    
                res.redirect('/digitalcard/admin');
            });
        });
    });
});

router.post('/update/:id', upload.single('logo'), (req, res) => {
    fs.readFile('localbase/vcards.json', (err, data) => {
        const filePath = req.file.path;
            
        let phoneList = [];
        for(let i=1; i<= req.body.phoneCount; i++){
            phoneList.push(
                {
                    title: req.body['title'+i],
                    number: req.body['phone'+i]
                }
            );
        }

        if (err) throw err;

        vcards = JSON.parse(data);
        fs.rename(filePath, filePath+'.png', () => {
                let vcard =  
                {
                    business: req.body.business,
                    logo : req.file.filename+'.png',
                    bg: {link: req.body.bglink, type: req.body.bgtype },
                    facebook: {title: req.body.facebook1, link: req.body.facebook2 },
                    waze: {title: req.body.waze1, link: req.body.waze2},
                    instagram: {title: req.body.instagram1, link: req.body.instagram2 },
                    whatsrouter: {title: req.body.whatsrouter1, link: req.body.whatsrouter2 },
                    phones : phoneList,
                    day1 : {start:req.body.days1, end: req.body.daye1},
                    day2 : {start:req.body.days2, end: req.body.daye2},
                    day3 : {start:req.body.days3, end: req.body.daye3},
                    day4 : {start:req.body.days4, end: req.body.daye4},
                    day5 : {start:req.body.days5, end: req.body.daye5},
                    day6 : {start:req.body.days6, end: req.body.daye6},
                    day7 : {start:req.body.days7, end: req.body.daye7},
                };
                vcards[req.params.id] = vcard;

                fs.writeFile('localbase/vcards.json', JSON.stringify(vcards) , function (err) {
                    if (err) throw err;
                        
                    res.redirect('/digitalcard/admin');
                });
            });
    });
});

router.get('/delete/:id', (req, res) => {
    fs.readFile('localbase/vcards.json', (err, data) => {
        
        if (err) throw err;
        vcards = JSON.parse(data);
        
        vcards.splice(req.params.id, 1);

        fs.writeFile('localbase/vcards.json', JSON.stringify(vcards) , function (err) {
            if (err) throw err;
                
            res.redirect('/digitalcard/admin');
        });
    });
});

module.exports = router;