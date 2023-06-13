const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const porta = process.env.PORT || 3002;
var session = require("express-session");
var passport = require("passport");

const loginRoute = require("./router/loginRoute");

const Usuario = require("./models/Usuario");
const Cardapio = require("./models/Cardapio");
const Itens = require("./models/Itens");
const Pedido = require("./models/Pedido");
const Token = require("./models/Token");

Itens.belongsTo(Cardapio);

Itens.belongsTo(Pedido);
Pedido.hasMany(Itens);

Pedido.belongsTo(Usuario);
Usuario.hasMany(Pedido);

Token.belongsTo(Usuario);
Usuario.hasMany(Token);


//configuração dos arquivos de visão (VIEWS)
app.set("view engine", "ejs");

//configurar para receber dados por metodo post
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use("/", loginRoute);


app.listen(porta, function () {
  console.log("Servidor funcionando!");
});