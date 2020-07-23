const express = require('express');
const fs = require('fs');
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: "public/royal/"
});

router.get('/', (req, res) => {
    res.render('royal/homepage');
});

router.get('/clients', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
    res.render('royal/clients', {clientsarray: royal[0].clients});
    });
});

router.get('/orders/:clientid', (req, res) => {
    fs.readFile('localbase/royal.json', (err, data) => {
        if (err) throw err;
        let royal = JSON.parse(data);
        let orders = [];
        royal[2].orders.forEach(order => {
            if(order.clientid == req.params.clientid){
                orders.push(order);
            }
        });
        res.render('royal/orders', {orders: orders});
    });
});

router.get('/reports', (req, res) => {
    res.render('royal/reports');
});

router.get('/forms', (req, res) => {
    res.render('royal/forms');
});

module.exports = router;