const express = require('express');
const fs = require('fs');
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: "public/royal/"
});


router.get('/', (req, res) => {
    if(req.app.locals.isLogged) {
        res.redirect('/royal/home');
    }else {
        fs.readFile('localbase/royal.json', (err, data) => {
            if (err) throw err;
            let royal = JSON.parse(data);
            res.render('royal/login', {admins: royal[3].admins});
        });
    }
});

router.get('/logout', (req, res) => {
    req.app.locals.isLogged = false;
    req.app.locals.username = '';
    res.redirect('/royal');
});

router.get('/users/:username', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
    res.render('royal/users', {users: royal[3].admins, admin: admin});
    });
});

router.get('/home', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        let isLogged = req.app.locals.isLogged;
        let username = req.app.locals.username;
        royal[3].admins.forEach(r_admin => {
            if(r_admin.username == username)
                admin = r_admin;
        });
        if(isLogged)
            res.render('royal/homepage', {admin: admin});
        else
            res.redirect('/royal');
    });
});


router.post('/home', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.body.username){
                req.app.locals.isLogged = true;
                req.app.locals.username = req.body.username;
                admin = r_admin;
            }
        });
        res.render('royal/homepage', {admin: admin});
    });
});

router.get('/clients/:username', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
    res.render('royal/clients', {clientsarray: royal[0].clients, admin: admin});
    });
});

router.get('/products', (req, res) =>{
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
    res.render('royal/products', {productsarray: royal[1].products});
    });
});

router.get('/orders/:username/:clientid/:clientname', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let orders = [];
        let orders_ids = [];
        let savedproducts;
        let admin;
        royal[0].clients.forEach(client => {
            if(client.id == req.params.clientid){
                savedproducts = client.productprices;
            }
        });
        royal[2].orders.forEach(order => {
            if(order.clientid == req.params.clientid){
                orders.push(order);
            }
            orders_ids.push(order.id);
        });
        
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
        res.render('royal/orders', {savedproducts: savedproducts, orders: orders, products: royal[1].products, clientid: req.params.clientid, clientname: req.params.clientname, orders_ids: orders_ids, adminpass: req.params.admin, admin: admin});
    });
});

router.get('/productprices/:username/:clientid', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let productprices;
        let clientname;
        royal[0].clients.forEach(client => {
            if(client.id == req.params.clientid){
                clientname = client.name;
                productprices = client.productprices;
            }
        });
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
        res.render('royal/productprices', {productprices: productprices, products: royal[1].products, clientid: req.params.clientid, clientname: clientname, admin: admin});
    });
});

router.get('/orderproducts/:username/:orderid/:clientid/:clientname', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let orderproducts;
        let savedproducts;
        royal[0].clients.forEach(client => {
            if(client.id == req.params.clientid){
                savedproducts = client.productprices;
            }
        });
        royal[2].orders.forEach(order => {
            if(order.id == req.params.orderid){
                orderproducts = order.products;
            }
        });
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
        res.render('royal/orderproducts', {savedproducts: savedproducts, orderproducts: orderproducts, products: royal[1].products, orderid: req.params.orderid, clientid: req.params.clientid, clientname: req.params.clientname, admin: admin});
    });
});

router.get('/reports/:r_id', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        res.render('royal/reports_search', {R_id: req.params.r_id, clients: royal[0].clients});
    });
});

router.get('/forms', (req, res) => {
    res.render('royal/forms');
});

router.get('/changeadminpass/:username', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.params.username)
                admin = r_admin;
        });
        res.render('royal/changeadminpass', {admin: admin});
    });
});

router.post('/changepass', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let admin;
        royal[3].admins.forEach(r_admin =>{
            if(r_admin.username == req.body.username){
                admin = r_admin;
                admin.password = req.body.new_pass;
            }
        });

        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
        
        res.render('royal/clients', {clientsarray: royal[0].clients, admin: admin});
        });
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
            {
                name: req.body.client_name,
                id: req.body.client_id,
                phone: req.body.client_phone,
                address: req.body.client_address,
                productprices: [],
            }
        );
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

router.post('/addproductprice', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let productprices = [];
        for(let i = 0; i < royal[0].clients.length; i++){
            if(royal[0].clients[i].id == req.body.clientid){
                royal[0].clients[i].productprices.push(
                    {
                        description: req.body.product_description,
                        price: req.body.product_price,
                    }
                );
                productprices = royal[0].clients[i].productprices;
            }
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/productprices', {productprices: productprices, products: royal[1].products, clientid: req.body.clientid, clientname: req.body.clientname, admin: admin});
        });
    });
});

router.post('/addorder', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

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
                paid: "לא",
            }
        );
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

router.post('/addorderproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let orderproducts;
        let newtotal = 0;
        royal[2].orders.forEach(order => {
            if(order.id == req.body.orderid){
                order.products.push(
                    {
                        description: req.body.orderproduct,
                        quantity: req.body.orderproduct_quantity,
                        price: req.body.orderproduct_price,
                    }
                );
                order.products.forEach(orderproduct =>{
                    newtotal += Number(orderproduct.price * orderproduct.quantity);
                });
                order.total = newtotal.toString();
                orderproducts = order.products;
            }
        });
        
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

router.post('/addproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        royal[1].products.push(
            {
                description: req.body.product_description,
            }
        );
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            res.render('royal/products', {productsarray: royal[1].products});
        });
    });
});

// Edit
router.post('/editclient', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let eid, ename, ephone, eaddress;
        ename = (req.body.client_name)? req.body.client_name : req.body.default_name;
        eid = (req.body.client_id)? req.body.client_id : req.body.default_id;
        ephone = (req.body.client_phone)? req.body.client_phone : req.body.default_phone;
        eaddress = (req.body.client_address)? req.body.client_address : req.body.default_address;
        
        let royal = JSON.parse(data);
        royal[0].clients.forEach(client => {
            if(client.id == req.body.default_id){
                client.name = ename;
                client.id = eid;
                client.phone = ephone;
                client.address = eaddress;
            }
        });
        if(req.body.client_id && req.body.client_id != req.body.default_id){
            royal[2].orders.forEach(order => {
                if(order.clientid == req.body.default_id){
                    order.clientid = eid;
                }
            });
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

router.post('/edituser', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let eusername, ename, erole;
        ename = (req.body.user_name)? req.body.user_name : req.body.default_name;
        eusername = (req.body.user_username)? req.body.user_username : req.body.default_username;
        erole = (req.body.user_role)? req.body.user_role : req.body.default_role;
        
        let royal = JSON.parse(data);
        royal[3].admins.forEach(r_admin => {
            if(r_admin.username == req.body.default_username){
                r_admin.name = ename;
                r_admin.username = eusername;
                r_admin.role = erole;
            }
        });
        
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

router.post('/editproductprice', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let productprices = [];
        for(let i = 0; i < royal[0].clients.length; i++){
            if(royal[0].clients[i].id == req.body.clientid){
                royal[0].clients[i].productprices.forEach(product => {
                    if(product.description == req.body.edit_product_description){
                        product.price = req.body.edit_product_price;
                    }
                });
                productprices = royal[0].clients[i].productprices;
            }
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/productprices', {productprices: productprices, products: royal[1].products, clientid: req.body.clientid, clientname: req.body.clientname, admin: admin});
        });
    });
});

router.post('/editorder', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {

        let eid, eorderdate, eprovidedate, etotal;
        eid = (req.body.order_id)? req.body.order_id : req.body.default_id;
        eorderdate = (req.body.order_date && req.body.order_date != req.body.default_order_date)? req.body.order_date : req.body.default_order_date;
        eprovidedate = (req.body.order_provide_date && req.body.order_provide_date != req.body.default_provide_date)? req.body.order_provide_date : req.body.default_provide_date;
        etotal = (req.body.order_total && req.body.order_total != req.body.default_total)? req.body.order_total : req.body.default_total;
        epaid = (req.body.order_paid && req.body.order_paid != req.body.default_paid)? req.body.order_paid : req.body.default_paid;
        
        let royal = JSON.parse(data);
        royal[2].orders.forEach(order => {
            if(order.id == req.body.default_id){
                order.id = eid;
                order.orderdate = eorderdate;
                order.providedate = eprovidedate;
                order.total = etotal;
                order.paid = epaid;
            }
        });
        
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

router.post('/editorderproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let orderproducts;
        let newtotal = 0;
        royal[2].orders.forEach(order => {
            if(order.id == req.body.orderid){
                order.products.forEach(product => {
                    if(product.description == req.body.edit_orderproduct){
                        product.quantity = req.body.edit_orderproduct_quantity;
                        product.price = req.body.edit_orderproduct_price;
                    }
                });
                order.products.forEach(orderproduct =>{
                    newtotal += Number(orderproduct.price * orderproduct.quantity);
                });
                order.total = newtotal.toString();
                orderproducts = order.products;
            }
        });
        
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

router.post('/editproduct', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[1].products.length; i++){
            if(royal[1].products[i].description == req.body.default_description){
                royal[1].products[i].description = req.body.product_editname;
            }
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
                
            res.render('royal/products', {productsarray: royal[1].products});
        });
    });
});

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

router.post('/delproductprice', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        let royal = JSON.parse(data);
        let productprices = [];
        for(let i = 0; i < royal[0].clients.length; i++){
            if(royal[0].clients[i].id == req.body.clientid){
                for(let j = 0; j < royal[0].clients[i].productprices.length; j++) {
                    if(royal[0].clients[i].productprices[j].description == req.body.del_product){
                        royal[0].clients[i].productprices.splice(j, 1, );
                    }
                }
                productprices = royal[0].clients[i].productprices;
            }
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
            let admin;
            royal[3].admins.forEach(r_admin =>{
                if(r_admin.username == req.body.username)
                    admin = r_admin;
            });
            res.render('royal/productprices', {productprices: productprices, products: royal[1].products, clientid: req.body.clientid, clientname: req.body.clientname, admin: admin});
        });
    });
});

router.post('/delorder', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        
        let royal = JSON.parse(data);
        for(let i = 0; i < royal[2].orders.length; i++){
            if(royal[2].orders[i].id == req.body.del_order_id){
                royal[2].orders.splice(i, 1, );
            }
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
    });
});

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
            }
        }
        fs.writeFile('localbase/royal.json', JSON.stringify(royal) , function (err) {
            if (err) throw err;
                
            res.render('royal/products', {productsarray: royal[1].products});
        });
    });
});

module.exports = router;