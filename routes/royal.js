const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/get/questions', (req, res) => {
    fs.readFile('localbase/questions.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});

router.get('/get/user', (req, res) => {
    fs.readFile('localbase/users.json', (err, dataU) => {
        if (err) throw err;
        let data_ = JSON.parse(dataU);
        res.send(data_);
    });
});



router.post('/movement', (req, res) => {
    fs.readFile('localbase/users.json', (err, data) => {
        
        if (err) throw err;

        let users = JSON.parse(data);
        
<<<<<<< Updated upstream
        users.push( 
=======
        res.render('royal/clients', {clientsarray: royal[0].clients, admin: admin});
        });
    });
});

router.get('/logs', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
    res.render('royal/logs', {logs: royal[4].log, admin: admin});
    });
});

// Reports forms
router.post('/reports_result', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let royal = JSON.parse(data);
        let result = [];
        if(req.body.R_id == 0){
            if (req.body.order_provide0 == "order") {
                royal[2].orders.forEach(order => {
                    if(order.orderdate >= req.body.date_from
                            && order.orderdate <= req.body.date_to){
                                result.push(order);
                    }
                });
            }
            else if (req.body.order_provide0 == "provide") {
                royal[2].orders.forEach(order => {
                    if(order.providedate >= req.body.date_from
                            && order.providedate <= req.body.date_to){
                                result.push(order);
                    }
                });
            }
            else if (req.body.order_provide0 == "both") {
                royal[2].orders.forEach(order => {
                    if((order.orderdate >= req.body.date_from
                            && order.orderdate <= req.body.date_to)
                            || (order.providedate >= req.body.date_from
                                && order.providedate <= req.body.date_to)){
                                    result.push(order);
                    }
                });
            }
            if(req.body.order_paid0 != "all"){
                for(let i = 0; i < result.length; i++)
                    if(result[i].paid != req.body.order_paid0)
                        result.splice(i--, 1, );
            }
            res.render('royal/reports_result', {result: result, R_id: req.body.R_id, date_from: req.body.date_from, date_to: req.body.date_to});
        }
        else if (req.body.R_id == 1) {
            if (req.body.order_provide == "order") {
                royal[2].orders.forEach(order => {
                    if(order.clientid == req.body.clientid
                        && order.orderdate >= req.body.date_from
                            && order.orderdate <= req.body.date_to){
                                result.push(order);
                    }
                });
            }
            else if (req.body.order_provide == "provide") {
                royal[2].orders.forEach(order => {
                    if(order.clientid == req.body.clientid
                        && order.providedate >= req.body.date_from
                            && order.providedate <= req.body.date_to){
                                result.push(order);
                    }
                });
            }
            else if (req.body.order_provide == "both") {
                royal[2].orders.forEach(order => {
                    if(order.clientid == req.body.clientid
                        && ((order.orderdate >= req.body.date_from
                            && order.orderdate <= req.body.date_to)
                            || (order.providedate >= req.body.date_from
                                && order.providedate <= req.body.date_to))){
                                    result.push(order);
                    }
                });
            }
            if(req.body.order_paid != "all"){
                for(let i = 0; i < result.length; i++)
                    if(result[i].paid != req.body.order_paid)
                        result.splice(i--, 1, );
            }
            res.render('royal/reports_result', {result: result, R_id: req.body.R_id, client: req.body.client, date_from: req.body.date_from, date_to: req.body.date_to});
        }
    });
});

// Add
router.post('/addclient', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        royal[0].clients.push(
>>>>>>> Stashed changes
            {
                username: req.body.name,
                phone: req.body.phone,
                score: req.body.score
            }
        );
<<<<<<< Updated upstream

        fs.writeFile('localbase/users.json', JSON.stringify(users) , function (err) {
=======
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " added a new client: " + req.body.client_id),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
>>>>>>> Stashed changes
            if (err) throw err;
                
            res.redirect('/keyadakadera');
        });
    });
});

<<<<<<< Updated upstream
router.get('/admin', (req, res) => {
    res.render('quiz/log-quiz');
=======
router.post('/adduser', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let royal = JSON.parse(data);
        royal[3].admins.push(
            {
                username: req.body.user_username,
                password: req.body.user_password,
                name: req.body.user_name,
                role: req.body.user_role,
            }
        );
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " added a new user: " + req.body.user_username),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.admin_username)
                    admin = r_admin;
            });
            res.render('royal/users', {users: royal[3].admins, admin: admin});
        });
    });
>>>>>>> Stashed changes
});

router.post('/admin', (req, res) => {
    if(req.body.password == "Jej315441"){
        fs.readFile('localbase/questions.json', (err, dataQ) => {
            if (err) throw err;
            let questions = JSON.parse(dataQ);
            fs.readFile('localbase/users.json', (err, dataU) => {
                if (err) throw err;
                let users = JSON.parse(dataU);
                users.sort(function(a, b){
                    return parseInt(b.score)-parseInt(a.score);
                });

                let winners = [];
                let max = 0;

<<<<<<< Updated upstream
                for(let i=0; i<users.length; i++){
                    let val = parseInt(users[i].score);
=======
        let royal = JSON.parse(data);
        let orderproducts = [];
        for(let i = 0; i < req.body.products.length; i++) {
            if(req.body.quantities[i]){
            orderproducts.push(
                {
                    description: req.body.products[i],
                    quantity: req.body.quantities[i],
                    price: req.body.prices[i],
                }
            );
            }
        }
        royal[2].orders.push(
            {
                id: req.body.order_id,
                clientid: req.body.order_client_id,
                orderdate: req.body.order_date,
                providedate: req.body.order_provide_date,
                products: orderproducts,
                total: req.body.order_total,
                notice: req.body.notice,
                paid: "לא",
            }
        );
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " added a new order (" + req.body.order_id + ") for client: " + req.body.order_client_id),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let orders = [];
            let orders_ids = [];
            let savedproducts;
            royal[0].clients.forEach(client => {
            if(client.id == req.body.order_client_id){
                savedproducts = client.productprices;
            }
            });
            royal[2].orders.forEach(order => {
                if(order.clientid == req.body.order_client_id){
                    orders.push(order);
                }
                orders_ids.push(order.id);
            });
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/orders', {savedproducts: savedproducts, orders: orders, products: royal[1].products, clientid: req.body.order_client_id, clientname: req.body.order_client_name, orders_ids: orders_ids, admin: admin});
        });
    });
});
>>>>>>> Stashed changes

                    if(val> max){
                        max = val;
                    }
<<<<<<< Updated upstream
=======
                );
                order.products.forEach(orderproduct =>{
                    newtotal += Number(orderproduct.price * orderproduct.quantity);
                });
                order.total = newtotal.toString();
                orderproducts = order.products;
            }
        });
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " added a new product (" + req.body.orderproduct + ") to order: " + req.body.orderid),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let savedproducts;
            royal[0].clients.forEach(client => {
                if(client.id == req.body.clientid){
                    savedproducts = client.productprices;
>>>>>>> Stashed changes
                }

                for(let i=0; i<users.length; i++){
                    let val = parseInt(users[i].score);
                    if(val == max){
                        winners.push(users[i]);
                    }
                }
                
                res.render('quiz/all-quiz', {questions: questions, users:users, winners: winners});
            });
<<<<<<< Updated upstream
=======
        }
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " edited client: " + eid),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/clients', {clientsarray: royal[0].clients, admin: admin});
>>>>>>> Stashed changes
        });
    }
});

router.get('/add', (req, res) => {
    res.render('quiz/add-quiz', {question: null});
});

router.get('/show/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
<<<<<<< Updated upstream
        if (err) throw err;
        questions = JSON.parse(data);
=======
        let royal = JSON.parse(data);
        royal[3].admins.forEach(r_admin => {
            if(r_admin.username == req.body.default_username){
                r_admin.name = ename;
                r_admin.username = eusername;
                r_admin.role = erole;
            }
        });
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " edited user: " + eusername),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;  
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.admin_username)
                    admin = r_admin;
            });
            res.render('royal/users', {users: royal[3].admins, admin: admin});
        });
    });
});
>>>>>>> Stashed changes

        res.render('quiz/update-quiz', {question:(questions[req.params.id]), id: req.params.id});
    });
});

<<<<<<< Updated upstream
router.post('/update/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
=======
router.post('/editorder', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let eid, eorderdate, eprovidedate, etotal, enotice;
        eid = (req.body.order_id)? req.body.order_id : req.body.default_id;
        enotice = (req.body.notice)? req.body.notice : req.body.notice;
        eorderdate = (req.body.order_date && req.body.order_date != req.body.default_order_date)? req.body.order_date : req.body.default_order_date;
        eprovidedate = (req.body.order_provide_date && req.body.order_provide_date != req.body.default_provide_date)? req.body.order_provide_date : req.body.default_provide_date;
        etotal = (req.body.order_total && req.body.order_total != req.body.default_total)? req.body.order_total : req.body.default_total;
        epaid = (req.body.order_paid && req.body.order_paid != req.body.default_paid)? req.body.order_paid : req.body.default_paid;
        let order_client_id;
        let royal = JSON.parse(data);
        royal[2].orders.forEach(order => {
            if(order.id == req.body.default_id){
                order_client_id = order.clientid;
                order.id = eid;
                order.orderdate = eorderdate;
                order.providedate = eprovidedate;
                order.total = etotal;
                order.notice = enotice;
                order.paid = epaid;
            }
        });
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " edited order (" + eid +") for client: " + order_client_id),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
                
            let orders = [];
            let orders_ids = [];
            let savedproducts;
            royal[0].clients.forEach(client => {
                if(client.id == req.body.order_client_id){
                    savedproducts = client.productprices;
                }
            });
            royal[2].orders.forEach(order => {
                if(order.clientid == req.body.order_client_id){
                    orders.push(order);
                }
                orders_ids.push(order.id);
            });
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/orders', {savedproducts: savedproducts, orders: orders, products: royal[1].products, clientid: req.body.order_client_id, clientname: req.body.order_client_name, orders_ids: orders_ids, admin: admin});
        });
    });
});
>>>>>>> Stashed changes

        questions[req.params.id] = 
            {
                question : req.body.question,
                choiceA : req.body.answer1,
                choiceB : req.body.answer2,
                choiceC : req.body.answer3,
                choiceD : req.body.answer4,
                correct : req.body.Canswer
            }
<<<<<<< Updated upstream
        
            fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
                if (err) throw err;
                    
                res.redirect('/admin');
=======
        });
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " edited orderproduct (" + edit_orderproduct +") for order: " + req.body.orderid),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let savedproducts;
            royal[0].clients.forEach(client => {
                if(client.id == req.body.clientid){
                    savedproducts = client.productprices;
                }
            });  
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
>>>>>>> Stashed changes
            });
    });
});

<<<<<<< Updated upstream
router.get('/delete/:id', (req, res) => {
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
        
        questions.splice(req.params.id, 1);

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
=======
// Delete
router.post('/delclient', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[0].clients.length; i++){
            if(royal[0].clients[i].id == req.body.del_client_id){
                royal[0].clients.splice(i, 1, );
            }
        }
        for(let i = 0; i < royal[2].orders.length; i++){
            if(royal[2].orders[i].clientid == req.body.del_client_id){
                royal[2].orders.splice(i, 1, );
            }
        }
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " deleted client: " + req.body.del_client_id),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/clients', {clientsarray: royal[0].clients, admin: admin});
        });
    });
});

router.post('/deluser', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[3].admins.length; i++){
            if(royal[3].admins[i].username == req.body.del_user_username){
                royal[3].admins.splice(i, 1, );
            }
        }
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " deleted user: " + req.body.del_user_username),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
>>>>>>> Stashed changes
            if (err) throw err;
                
            res.redirect('/admin');
        });
    });
});
<<<<<<< Updated upstream
router.get('/get/users', (req, res) => {
    fs.readFile('localbase/users.json', (err, data) => {
        
        if (err) throw err;
        users = JSON.parse(data);

        res.send(users);
=======

router.post('/delorder', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let order_client_id;
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[2].orders.length; i++){
            if(royal[2].orders[i].id == req.body.del_order_id){
                order_client_id = royal[2].orders[i].clientid;
                royal[2].orders.splice(i, 1, );
            }
        }
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " deleted order (" + req.body.del_order_id + ") for user: " + order_client_id),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let orders_ids = [];
            let orders = [];
            let savedproducts;
        royal[0].clients.forEach(client => {
            if(client.id == req.body.order_client_id){
                savedproducts = client.productprices;
            }
        });
            royal[2].orders.forEach(order => {
                if(order.clientid == req.body.order_client_id){
                    orders.push(order);
                }
                orders_ids.push(order.id);
            });
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/orders', {savedproducts: savedproducts, orders: orders, products: royal[1].products, clientid: req.body.order_client_id, clientname: req.body.order_client_name, orders_ids: orders_ids, admin: admin});
        });
>>>>>>> Stashed changes
    });
});
router.post('/admin/questions', (req, res) => {
    let questions = [];

<<<<<<< Updated upstream
    fs.readFile('localbase/questions.json', (err, data) => {
        
        if (err) throw err;
        questions = JSON.parse(data);
        
        questions.push( 
            {
                question : req.body.question,
                choiceA : req.body.answer1,
                choiceB : req.body.answer2,
                choiceC : req.body.answer3,
                choiceD : req.body.answer4,
                correct : req.body.Canswer
=======
router.post('/delorderproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let orderproducts;
        let newtotal = 0;
        royal[2].orders.forEach(order => {
            if(order.id == req.body.orderid){
                for(let i = 0; i < order.products.length; i++){
                    if(order.products[i].description == req.body.del_orderproduct){
                        order.products.splice(i, 1, );
                    }
                }
                order.products.forEach(orderproduct =>{
                    newtotal += Number(orderproduct.price * orderproduct.quantity);
                });
                order.total = newtotal.toString();
                orderproducts = order.products;
            }
        });
        let cd = new Date();
        royal[4].log.push(
            {
            time: (cd.getFullYear().toString() + "/" + cd.getMonth().toString() + "/" + cd.getDate().toString() + "  " + cd.getHours().toString() + ":" + cd.getMinutes().toString() + ":" + cd.getSeconds()),
            action: (req.body.username + " deleted orderproduct (" + req.body.del_orderproduct + ") from order: " + req.body.orderid),
            }
        );
        if(royal[4].log.length > 30){
            royal[4].log.splice(0, 1, );
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let savedproducts;
            royal[0].clients.forEach(client => {
                if(client.id == req.body.clientid){
                    savedproducts = client.productprices;
                }
            });
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/orderproducts', {savedproducts: savedproducts, orderproducts: orderproducts, products: royal[1].products, orderid: req.body.orderid, clientid: req.body.clientid, clientname: req.body.clientname, admin: admin});
        });
    });
});

router.post('/delproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[1].products.length; i++){
            if(royal[1].products[i].description == req.body.del_product){
                royal[1].products.splice(i, 1, );
>>>>>>> Stashed changes
            }
        );

        fs.writeFile('localbase/questions.json', JSON.stringify(questions) , function (err) {
            if (err) throw err;
                
            res.redirect('/add');
        });
    });
});

module.exports = router;