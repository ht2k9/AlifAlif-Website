const express = require('express');
const fs = require('fs');
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: "public/restaurants/"
});

// SHOW
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
        
        res.render('menu/menu', {menu: menus[req.params.id], id: req.params.id, lang: 'ar'});
    });
});

router.get('/show/:lang/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        res.render('menu/menu', {menu: menus[req.params.id], id: req.params.id, lang: req.params.lang, isVisible: false});
    });
});

router.post('/show/:lang/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        res.render('menu/menu', {menu: menus[req.params.id], id: req.params.id, lang: req.params.lang, isVisible: true});
    });
});

router.post('/cart/add', (req, res) => {
    req.app.locals.cart.push(req.body.cartitem);
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('back');
});

router.get('/show/:lang/:id/:category', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menu = JSON.parse(data)[req.params.id];

        let foods = [];
        menu.foods.forEach(food => {
            if(food.category == req.params.category){
                foods.push(food);
            }
        });

        res.render('menu/foods', {id: req.params.id, lang: req.params.lang, category: menu.categories[req.params.category], foods: foods, lang: req.params.lang, darkmode: menu.darkmode});
    });
});

router.get('/add', (req, res) => {
    res.render('menu/new-menu', {menu: null});
});


// NEW
router.post('/add', upload.single('logo'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        let menus = JSON.parse(data);
        menus.push(
            {
                business: {he: req.body.businessHE, ar: req.body.businessAR},
                colors: {primary: req.body.primary, secondary: req.body.secondary},
                darkmode: req.body.darkmode,
                categories: [],
                foods: [],
            }
        );

        fs.rename(filePath, filePath+'.png', () => {
            menus[menus.length-1].logo = req.file.filename+'.png';

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: menus.length-1, menu: menus[menus.length-1]});
            });
        }); 
    });
});

// UPDATE
router.post('/update/:id', upload.single('logo'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        menus = JSON.parse(data);
        menus[req.params.id] = (
            {
                business: req.body.business,
                colors: {primary: req.body.primary, secondary: req.body.secondary},
            }
        );

        fs.rename(filePath, filePath+'.png', () => {
            menus[req.params.id].logo = req.file.filename+'.png';

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/admin');
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
                    title: {ar: req.body.catTitleAR, he: req.body.catTitleHE},
                    icon: req.body.icon,
                    image: req.file.filename+'.png'
                }
            );

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: req.body.id, categories: menus[req.body.id].categories, menu: null});
            });
        });
    });
});

// Food
// ADD
router.post('/food/add', upload.single('foodImg'), (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        const filePath = req.file.path;

        let menus = JSON.parse(data);

        fs.rename(filePath, filePath+'.png', () => {
            menus[req.body.id].foods.push(
                {
                    title: {ar: req.body.foodAR, he: req.body.foodHE},
                    description: {ar: req.body.descriptionAR, he: req.body.descriptionHE},
                    category: req.body.category,
                    price: req.body.price,
                    image: req.file.filename+'.png'
                }
            );

            fs.writeFile('localbase/menus.json', JSON.stringify(menus) , function (err) {
                if (err) throw err;
                    
                res.render('menu/new-menu', {id: req.body.id, categories: menus[req.body.id].categories, menu: null});
            });
        }); 
    });
});

router.get('/update/:id', (req, res) => {
    fs.readFile('localbase/menus.json', (err, data) => {
        if (err) throw err;
        let menus = JSON.parse(data);
        
        res.render('menu/new-menu', {menu: menus[req.params.id], id: req.params.id, categories: menus[req.params.id].categories});
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