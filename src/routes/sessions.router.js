const express = require("express");
const router = express.Router();
// const UserModel = require("../models/user.model.js");
const passport = require("passport");

// Registro con passport:

router.post("/", passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister"
}), async (req, res) => {

    if (!req.user) return res.status(400).send("Credenciales inválidas");

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send("Registro fallido")
})

// Login con passport

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(400).send("Credenciales inválidas");

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/faillogin", (req, res) => {
    res.send("Fallo el login");
})

//Logout

router.get("/logout", (req, res) => {
    if(req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
})

//Version para GitHub

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {

})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    //La estrategia de GitHub nos retornará el usuario, entonces lo agregamos a nuestro objeto de session:
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})


module.exports = router;