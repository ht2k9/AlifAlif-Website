const express = require('express');
const fs = require('fs');
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: "public/restaurants/menus/"
});

router.get('/admin', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu/dashboard', {menus: menus});
    });
});

router.get('/show/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu/menu', {menu: menus[req.params.id], id: req.params.id});
    });
});

router.get('/show/:id/:category', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        let menu = menus[req.params.id];
        res.render('menu/foods', {menu: menu, category: menu.categories[req.params.category]});
    });
});

router.get('/add', (req, res) => {
    res.render('menu/new-menu');
});

router.post('/add', upload.single('logo'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        menus = JSON.parse(data);
        menus.push(
            {
                business: req.body.business,
                colors: {primary: req.body.primary, secondary: req.body.secondary},
                categories: [],
                foods: [],
            }
        );

        fs.rename(filePath, filePath+'.png', () => {
            menus[menus.length-1].logo = req.file.filename+'.png';

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: menus.length-1});
            });
        }); 
    });
});

// CATEGORY
router.post('/category/add', upload.single('catImg'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        menus = JSON.parse(data);

        fs.rename(filePath, filePath+'.png', () => {
            menus[req.body.id].categories.push(
                {
                    title: req.body.catTitle,
                    icon: req.body.icon,
                    image: req.file.filename+'.png'
                }
            );

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: req.body.id, categories: menus[req.body.id].categories});
            });
        });
    });
});

// Food
router.post('/food/add', upload.single('foodImg'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        menus = JSON.parse(data);

        fs.rename(filePath, filePath+'.png', () => {
            menus[req.body.id].foods.push(
                {
                    title: req.body.food,
                    category: req.body.category,
                    price: req.body.price,
                    image: req.file.filename+'.png'
                }
            );

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: req.body.id, categories: menus[req.body.id].categories});
            });
        }); 
    });
});

router.get('/update/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu/new-menu', {menu: menus[req.params.id], id: req.params.id});
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

router.get('/delete/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        
        if (err) throw err;
        menus = JSON.parse(data);
        
        menus.splice(req.params.id, 1);

        fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
            if (err) throw err;
                
        res.render('menu/dashboard', {menus: menus});
        });
    });
});

module.exports = router;