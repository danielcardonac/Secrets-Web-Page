require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const encrypt = require("mongoose-encryption");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

const schemaUsuario = new mongoose.Schema({
  email: String,
  contra: String
});
//CREAMOS UN STRING BASTANTE LARGO Y MELO , Q VA A MANTENERSE SECRETO!

//AÑADIMOS ENCRYPT COMO PLUGIN Y EL SECRETO COMO UN OBJETO DE JS
schemaUsuario.plugin(encrypt, {secret: process.env.SECRETO, encryptedFields: ["contra"]});

const Usuario = new  mongoose.model("Usuario", schemaUsuario);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const nuevoUsuario = new Usuario({
    email: req.body.username,
    contra: req.body.password
  });
  nuevoUsuario.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const nombreUsuario = req.body.username;
  const password = req.body.password;

  Usuario.findOne({email: nombreUsuario}, function(err, usuarioEncontrado){
    if(err){
      console.log(err);
    } else{
      if(usuarioEncontrado){
        if (usuarioEncontrado.contra === password){
          res.render("secrets");
        } else{

        }
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Servidor iniciado en el puerto 3000");
});
