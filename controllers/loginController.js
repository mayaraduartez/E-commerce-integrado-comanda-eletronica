const Usuario = require("../models/Usuario");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");
const transporter = require("../config/email");

async function cadastro(req, res) {
  var nome = req.body.nome;
  var email = req.body.email;
  var senha = req.body.senha;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(senha, salt);

  try {
    const usuario = await Usuario.create({
      nome: nome,
      email: email,
      senha: hash,
    });

    res.redirect("/login");
  } catch (error) {
    res.render("login/cadastro.ejs", {
      msg: "Esse e-mail já possui cadastro!",
    });
  }
}

async function abreTela(req, res, msg = "") {
  res.render("login/login.ejs", { msg: "" });
}

async function cadastrar(req, res) {
  res.render("login/cadastro.ejs", { msg: "" });
}

async function forgot(req, res) {
  res.render("login/forgot.ejs", { msg: "" });
}

async function telatoken(req, res) {
  res.render("login/token.ejs", { msg: "" });
}

async function atualizarsenha(req, res) {
  var novasenha = req.body.novasenha;
  let usuario = await Usuario.findOne({
    where: {
      email: req.body.email,
    },
  });

  let token = await Token.findOne({
    where: {
      token: req.body.token,
    },
  });

  if (!usuario) {
    res.render("login/token.ejs", {
      msg: "O email digitado está incorreto do email que foi enviado o token!",
    });
    return;
  }

  if (!token) {
    res.render("login/token.ejs", { msg: "O token está incorreto!" });
    return;
  }

  if (token.UsuarioId === usuario.id) {
    // Comando de atualização da senha
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(novasenha, salt);
    usuario.senha = hash;
    await usuario.save();
    res.redirect("/login");
  }
  
}

async function recuperar(req, res) {
  if (req.body.email == "") {
    res.render("login/forgot.ejs", { msg: "Você deve informar um email!" });
  } else {
    let usuario = await Usuario.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!usuario) {
      res.render("login/forgot.ejs", { msg: "Usuário não cadastrado!" });
    } else if (usuario.token === "" || usuario.token === null) {
      let token = generatePassword();

      let savetoken = await Token.create({
        UsuarioId: usuario.id,
        token: token,
        datacriacao: new Date(),
      });

      enviaremail(usuario, token);
      res.redirect("/token");
    } else {
      await Token.destroy({
        where: {
          UsuarioId: usuario.id,
        },
      });

      let token = generatePassword();

      let savetoken = await Token.create({
        UsuarioId: usuario.id,
        token: token,
        datacriacao: new Date(),
      });

      enviaremail(usuario, token);
      res.redirect("/token");
    }
  }
}

function generatePassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var pass = "";
  for (var i = 0; i < 10; i++) pass += chars.charAt(Math.random() * 61);
  return pass;
}

function enviaremail(usuario, token) {
  const email = {
    from: "recuperacaodesenhaif@hotmail.com",
    to: usuario.email,
    subject: "Recuperação de senha!",
    text:
      "Olá " +
      usuario.nome +
      " você tentou recuperar a senha pelo site! acesse o site http://localhost:3002/recuperacao e insira o token: " +
      token +
      "",
  };

  transporter.sendMail(email, (err, result) => {
    if (err) return console.log(err);
  });
}

const logar = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/addmenu",
});

module.exports = {
  abreTela,
  cadastro,
  cadastrar,
  logar,
  forgot,
  recuperar,
  telatoken,
  atualizarsenha,
};
