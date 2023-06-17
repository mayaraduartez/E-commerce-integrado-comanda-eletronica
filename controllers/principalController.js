const Usuario = require("../models/Usuario");
const Cardapio = require("../models/Cardapio");
const Itens = require("../models/Itens");
const Pedido = require("../models/Pedido");
const Avaliacao = require("../models/Avaliacao");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { cpf } = require("cpf-cnpj-validator");
const moment = require("moment");

async function principal(req, res) {
  res.render("conteudo/principal.ejs");
}

async function abreinicial(req, res) {
  res.render("admin/principal.ejs");
}

async function menu(req, res) {
  const cardapio = await Cardapio.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("conteudo/menu", { Cardapio: cardapio });
}

async function pedidos(req, res) {
  res.render("conteudo/meuspedidos.ejs");
}

async function abreperfil(req, res) {
  try {
    const usuario = await Usuario.findOne({
      where: {
        id: req.user.id,
      },
    });

    res.render("conteudo/meuperfil", { usuario });
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar o usuário.");
  }
}

async function salvarperfil(req, res) {
  try {
    let usuario = await Usuario.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (usuario) {
      if (req.file) {
        usuario.foto = req.file.filename;
      }

      usuario.nome = req.body.nome;
      usuario.email = req.body.email;
      usuario.sobrenome = req.body.sobrenome;

      const dataNascimento = moment(req.body.data_nascimento, 'YYYY-MM-DD');
      usuario.data_nascimento = dataNascimento.format('YYYY-MM-DD');

      const cpfSemCaracteresEspeciais = req.body.cpf.replace(/[^\d]/g, "");
      usuario.cpf = cpfSemCaracteresEspeciais;

      const celularString = req.body.celular.toString();
      usuario.celular = celularString;

      await usuario.save();

      abreperfil(req, res, usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o perfil do usuário" });
  }
}

async function sair(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

async function abreavaliacoes(req, res) {
  const avaliacao = await Avaliacao.findAll({include: [Usuario]}).catch(function (err) {
    console.log(err);
  });
  res.render("conteudo/avaliacao", {Avaliacao: avaliacao});
}

async function avaliar(req, res) {
  try {
    const usuario = await Usuario.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (usuario) {
      const salvarestrelas = req.body.rating;
      const avaliacao = await Avaliacao.create({
        UsuarioId: req.user.id,
        estrelas: salvarestrelas,
        comentario: req.body.comentario,
      });
      await avaliacao.save();

      res.redirect("/avaliacoes")
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar a avaliação" });
  }
}

async function addmenu(req, res) {
  res.render("admin/addmenu.ejs");
}

async function addpromocao(req, res) {
  res.render("admin/addpromocao.ejs");
}

async function criarmenu(req, res) {
  const cardapio = await Cardapio.create({
    foto: req.file.filename,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    valor: req.body.valor,
    tipo: req.body.tipo,
  }).catch((err) => {});
  res.redirect("/menu");
}

async function addcarrinho(req, res) {
  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }
  req.session.carrinho.push(req.params.id);
  res.redirect("/menu");
}

async function abrecarrinho(req, res) {
  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }
  const cardapio = await Cardapio.findAll({
    where: {
      id: {
        [Op.or]: [req.session.carrinho],
      },
    },
  });

  res.render("conteudo/carrinho.ejs", { Cardapio: cardapio });
}

async function removeCarrinho(req, res) {
  const elementoId = req.params.id;
  console.log(req.params.id);
  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }

  // Encontre o índice do elemento no carrinho
  const index = req.session.carrinho.indexOf(elementoId);

  if (index !== -1) {
    // Remova o elemento do carrinho
    req.session.carrinho.splice(index, 1);
  }

  res.redirect("/carrinho");
}

async function salvaritens(req, res) {
  const pedidos = await Pedido.create({
    situacao: "pendente",
    valortotal: 0.0,
    UsuarioId: req.user.id,
    datapedido: new Date(),
  }).catch((err) => {});

  for (var i = 0; i < req.body.idpedido.length; i++) {
    const itens = await Itens.create({
      CardapioId: req.body.idpedido[i],
      valordoitem: req.body.valorpedido[i],
      quantidade: req.body.quantidade[i],
      PedidoId: pedidos.id,
    }).catch((err) => {
      console.log(err);
    });
    console.log(itens);
    pedidos.valortotal =
      pedidos.valortotal + itens.valordoitem * itens.quantidade;
  }
  await pedidos.save();

  res.redirect("/meuspedidos");
}

async function pedidos(req, res) {
  const pedidos = await Pedido.findAll({
    include: [
      {
        model: Itens,
        include: [
          {
            model: Cardapio,
          },
        ],
      },
    ],
    where: {
      UsuarioId: req.user.id,
    },
    order: [["id", "DESC"]], // Ordenar por ID em ordem decrescente
  });

  res.render("conteudo/meuspedidos", { Pedidos: pedidos });
}

module.exports = {
  principal,
  abreinicial,
  menu,
  pedidos,
  abreperfil,
  salvarperfil,
  sair,
  abreavaliacoes,
  avaliar,
  abrecarrinho,
  addmenu,
  addpromocao,
  criarmenu,
  addcarrinho,
  removeCarrinho,
  salvaritens,
};
