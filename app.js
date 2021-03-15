//require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
require("./views/database/conn");
const Register = require("./views/database/register");
const { json } = require("express");
//console.log(process.env.SECRET_KEY);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/r', (req, res) => {
    res.render('registration');
})
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/registration', (req, res) => {
    res.render('registration');
});
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const Email = await Register.findOne({ email: email });

        //decryption
        const isMatch = await bcrypt.compare(password, Email.password);
        //checking whether password matched or not
        if (isMatch) {
            const token = await Email.getToken();
            console.log("Token is:", token);
            res.status(201).render("index");
            console.log("successfully login...Yayy!!");
        } else {
            res.send("invalid password");
        }
    } catch (e) {
        res.error("Error!!");
    }
});
app.post('/registration', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.conformPassword;
        if (password === cpassword) {
            const registerCustomer = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                age: req.body.age,
                phoneNo: req.body.phoneNo,
                password: req.body.password,
                conformPassword: req.body.conformPassword
            })
            console.log("The success part is:", registerCustomer);

            //Authentication of user
            const token = await registerCustomer.getToken();
            console.log("Token is:", token);

            //Finally saving all data into database
            console.log("error start from here");
            const registered = await registerCustomer.save();
            console.log("finally");
            res.status(201).render("index");
        } else {
            res.send("passwords are not matching");
        }
    } catch (e) {
        console.log("Error!!" + e);
    }
});

app.listen(8080, () => {
    console.log("serving on port 8080");
});
