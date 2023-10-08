const router = require("express").Router();
const User = require("../model/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const path = require("path");

router.get("/signin", (req, res) => {
    try {
        return res.render("signin", { pageTitle: "Login", layout: "layout2" });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/signin');
});


router.get("/signup", (req, res) => {
    try {
        return res.render("signup", { pageTitle: "Signup", layout: "layout2" });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/signup', async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            phone,
            gender,
            country,
            currency,
            password,
            password2
        } = req.body;
        console.log(req.body)
        const userIP = req.ip;
        const user = await User.findOne({ email, username });
        const user1 = await User.findOne({ username });
        if (user || user1) {
            return res.render("signup", { ...req.body, error_msg: "A User with that email or username already exists", layout: "layout2", pageTitle: "Signup" });
        } else {
            if (!username || !fullname || !gender || !country || !currency || !email || !phone || !password || !password2) {
                return res.render("signup", { ...req.body, error_msg: "Please fill all fields", layout: "layout2", pageTitle: "Signup" });
            } else {
                if (password !== password2) {
                    return res.render("signup", { ...req.body, error_msg: "Both passwords are not thesame", layout: "layout2", pageTitle: "Signup" });
                }
                if (password2.length < 6) {
                    return res.render("signup", { ...req.body, error_msg: "Password length should be min of 6 chars", layout: "layout2", pageTitle: "Signup" });
                }
                const newUser = {
                    username,
                    fullname,
                    email,
                    phone,
                    gender,
                    currency,
                    country,
                    password,
                    clearPassword: password,
                    userIP
                };
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password2, salt);
                newUser.password = hash;
                const _newUser = new User(newUser);
                await _newUser.save();
                req.flash("success_msg", "Register success, you can now login");
                return res.redirect("/signin");
            }
        }
    } catch (err) {
        console.log(err)
    }
})



module.exports = router;