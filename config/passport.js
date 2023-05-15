const Usuario = require("../models/Usuario.js"); //importei o modelo usuario
const bcrypt = require("bcrypt"); //importei a biblioteca da criptografia da senha, pra mim comparar as senhas
const passport = require("passport"); //importei a biblioteca que vou usar de login de senha(meu sistema de login)
var LocalStrategy = require("passport-local"); //importei a estratégia de login que vou usar

passport.use(
  new LocalStrategy(async function (username, password, cb) {
    console.log(username + " " + password)
    //ta recebendo o usuario e a senha q foi digitado para retornar (cb: função de resposta)
    var usuario = await Usuario.findOne({ where: { email: username } });
    console.log(usuario)
    //verificando se o usuario está do bd, com o find
    if (!usuario) {
      return cb(null,false, { message: "Usuario não existe!" }); //não teve resultado
    } else {
      //2º teste pra achar o usuario, pra ver se a senha está errada
      if (!bcrypt.compareSync(password, usuario.senha)) {
        return cb(null, false, { message: "Senha incorreta!" });
      } else {
        return cb(null, usuario); //por ultimo o resultado diferente dos outros
      }
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email, nome: user.nome, admin: user.admin });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
module.exports = passport;