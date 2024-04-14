const express = require("express");
const router = express.Router();
// const UserModel = require("../models/user.model.js");
const passport = require("passport");

// //Registro:
// router.post("/", async (req, res) => {
//     const {first_name, last_name, email, password, age} = req.body;
//     try {
//         //Verificamos si el correo que recibo, ya esta en la DB
//         const existeUsuario = await UserModel.findOne({email:email});
//         if(existeUsuario){
//             return res.status(400).send("El correo ingresado ya esta registrado");
//         }
//         //Creamos un nuevo usuario:
//         const nuevoUsuario = await UserModel.create({first_name, last_name, email, password, age});

//         //Armamos la session:
//         req.session.login = true;
//         req.session.user = {...nuevoUsuario._doc}
//         //res.status(200).send("Usuario creado con éxito!")
//         res.redirect("/api/products");
//     } catch (error) {
//         res.status(500).send("Error interno del servidor")
//     }
// })

// //Login:

// router.post("/login", async(req, res) => {
//     const {email, password} = req.body;

//     try {
//         const usuario = await UserModel.findOne({email:email});
//         if(usuario){
//             if(usuario.password === password){
//                 req.session.login = true;
//                 req.session.user = {
//                     email: usuario.email,
//                     age: usuario.age,
//                     first_name: usuario.first_name,
//                     last_name: usuario.last_name,
//                     role: usuario.email === 'adminCoder@coder.com' && usuario.password === 'adminCod3r123' ? 'admin' : 'usuario' // Asignar rol basado en las credenciales

//                 }
//                 // Redirigir al usuario a la vista de productos después del inicio de sesión               
//                 res.redirect("/api/products");
//             }else{
//                 res.status(401).send("Contraseña invalida")
//             }
//         }else{
//             res.status(404).send("Usuario no encontrado");
//         }
//     } catch (error) {
//         res.status(500).send("Error interno del servidor");
//     }
// })

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