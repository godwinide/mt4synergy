const router = require("express").Router();

router.get("/", (req, res) => {
    try {
        return res.render("index", { pageTitle: "Welcome", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/features", (req, res) => {
    try {
        return res.render("features", { pageTitle: "Features", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/faq", (req, res) => {
    try {
        return res.render("faq", { pageTitle: "FAQ", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/about", (req, res) => {
    try {
        return res.render("about", { pageTitle: "About Us", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/investment", (req, res) => {
    try {
        return res.render("investment", { pageTitle: "Investment", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/partners", (req, res) => {
    try {
        return res.render("partners", { pageTitle: "Partners", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/contact", (req, res) => {
    try {
        return res.render("contact", { pageTitle: "contact", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/team", (req, res) => {
    try {
        return res.render("contact", { pageTitle: "contact", layout: "layout2", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/terms", (req, res) => {
    try {
        return res.render("terms", { pageTitle: "Terms", req });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/forgot_password", (req, res) => {
    try {
        return res.render("forgot", { pageTitle: "Forgot Password" });
    }
    catch (err) {
        return res.redirect("/");
    }
});



module.exports = router;