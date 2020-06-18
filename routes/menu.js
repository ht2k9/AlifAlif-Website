const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/admin', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu/dashboard', {menus: menus});
    });
});

router.get('/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu', {menu: menus[req.params.id]});
    });
});

router.get('/add', (req, res) => {
    res.render('menu/new-menu', {menu: {}});
});

router.post('/add', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {

        let phoneList = [];
        for(let i=1; i<req.body.phoneCount; i++){
            phoneList.push([
                {
                    title: req.body['title'+i],
                    number: req.body['phone'+i]
                }
            ]);
        }

        
        if (err) throw err;
        menus = JSON.parse(data);
        menus.push( 
            {
                business: req.body.business,
                logo : req.body.logo,
                bg: {link: req.body.bglink, title: req.body.bgtype },
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

        fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
            if (err) throw err;
                
            res.redirect('/add');
        });
    });
});

router.post('/update/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
            
        if (err) throw err;
        menus = JSON.parse(data);

        menus[req.params.id] = 
            {

            }
        
            fs.writeFile('localbase/menus.json', JSON.stringify(questions) , function (err) {
                if (err) throw err;
                    
                res.redirect('/admin');
            });
    });
});

router.post('/delete/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        
        if (err) throw err;
        menus = JSON.parse(data);
        
        menus.splice(req.params.id, 1);

        fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
            if (err) throw err;
                
            res.redirect('/admin');
        });
    });
});

module.exports = router;