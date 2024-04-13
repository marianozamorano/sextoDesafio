const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Registro:
router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;
    try {
        //Verificamos si el correo que recibo, ya esta en la DB
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario){
            return res.status(400).send("El correo ingresado ya esta registrado");
        }
        //Creamos un nuevo usuario:
        const nuevoUsuario = await UserModel.create({first_name, last_name, email, password, age});

        //Armamos la session:
        req.session.login = true;
        req.session.user = {...nuevoUsuario._doc}
        //res.status(200).send("Usuario creado con éxito!")
        res.redirect("/api/products");
    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})

//Login:

router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try {
        const usuario = await UserModel.findOne({email:email});
        if(usuario){
            if(usuario.password === password){
                req.session.login = true;
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    role: usuario.email === 'adminCoder@coder.com' && usuario.password === 'adminCod3r123' ? 'admin' : 'usuario' // Asignar rol basado en las credenciales

                }
                // Redirigir al usuario a la vista de productos después del inicio de sesión               
                res.redirect("/api/products");
            }else{
                res.status(401).send("Contraseña invalida")
            }
        }else{
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

//Logout

router.get("/logout", (req, res) => {
    if(req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
})


module.exports = router;