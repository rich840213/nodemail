var express = require('express');
var router = express.Router();
var csrf = require('csurf');
require('dotenv').config();
// CSRF Token
var csrfProtection = csrf();
router.use(csrfProtection);
// Mailer
var path = require('path');
var nodemailer = require('nodemailer');
// 聯絡我們的頁面
router.get('/', csrfProtection, function (req, res) {
    req.session.date = new Date();
    res.render('contact', {
        csrfToken: req.csrfToken(),
        errors: req.flash('errors'),
        date: req.session.date
    });
});

// 查看 Contact
router.get('/review/', function (req, res) {
    res.render('contactReview');
});
router.post('/post', csrfProtection, function (req, res) {
    var data = req.body;
    console.log(req.checkBody);
    req.checkBody('username', '姓名不可為空').notEmpty();
    req.checkBody('email', 'Email不可為空').isEmail();
    req.checkBody('title', '標題不可為空').notEmpty();
    req.checkBody('description', '訊息不可為空').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        req.flash('errors', messages);
        return res.redirect('/contact');
    }

    var mailOptions = {
        from: 'JK<10663126@gm.nfu.edu.tw>',
        to: data.email,
        subject: data.username + ' SEND',
        text: data.description
    };

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PW,
        }
    });
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        res.redirect('/contact/review/');
    })
});
module.exports = router;
