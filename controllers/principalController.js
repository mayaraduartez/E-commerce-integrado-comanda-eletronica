const Usuario = require("../models/Usuario");
const Cardapio = require("../models/Cardapio");
const Itens = require("../models/Itens");
const Pedido = require("../models/Pedido");
const Avaliacao = require("../models/Avaliacao");
const Descricao = require("../models/Descricao");
const Pedido_Comanda = require("../models/Pedido_Comanda");
const Comanda = require("../models/Comanda");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { cpf } = require("cpf-cnpj-validator");
const moment = require("moment");

async function principal(req, res) {
  const descricao = await Descricao.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("conteudo/principal.ejs", { Descricao: descricao });
}

async function abreinicial(req, res) {
  const descricao = await Descricao.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("admin/principal.ejs", { Descricao: descricao });
}

async function edtdescricao(req,res){
  res.render("admin/edtdescricao.ejs");
}

async function salvardescricao(req, res) {
  try {
    await Descricao.destroy({
      where: {},
      truncate: true
    });

    const descricao = await Descricao.create({
      descricao: req.body.descricao,
    });

    res.redirect("/abreinicial");

  } catch (error) {
    console.error(error);
    res.redirect("/abreinicial");
  }
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

      const dataNascimento = moment(req.body.data_nascimento, 'YYYY-MM-DD').startOf('day');
      usuario.data_nascimento = dataNascimento.tz('America/Sao_Paulo').format('YYYY-MM-DD');

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

async function admsair(req,res){
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

async function abreavaliacoes(req, res) {
  const avaliacao = await Avaliacao.findAll({
    include: [Usuario],
    order: [['id', 'DESC']] // Classificar pelo ID em ordem decrescente
  });
  res.render("conteudo/avaliacao", { Avaliacao: avaliacao });
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
        data: new Date(),
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
  res.redirect("/menuadm");
}

async function menuadm(req, res) {
  const cardapio = await Cardapio.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("admin/menuadm.ejs", { Cardapio: cardapio });
}

async function edtmenu(req, res) {
  const id = req.params.id;
    const cardapio = await Cardapio.findOne({
        where: { id: id }
    });

    if (!cardapio) {
      console.log("Deu erro")
    }
    res.render("admin/edtmenu.ejs", { Cardapio: cardapio });

}

async function edtsalvar(req, res) {
  try {
    const id = req.params.id;
    const { foto, titulo, descricao, tipo, valor } = req.body;

    const cardapio = await Cardapio.findOne({
      where: {
        id: id,
      },
    });

    if (!cardapio) {
      return res.status(404).json({ error: 'Cardápio não encontrado' });
    }

    cardapio.foto = foto;
    cardapio.titulo = titulo;
    cardapio.descricao = descricao;
    cardapio.tipo = tipo;
    cardapio.valor = valor;

    await cardapio.save();

   return res.redirect('/menuadm');
  } catch (error) {
    console.error('Erro ao atualizar o cardápio:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao atualizar o cardápio' });
  }
}

async function removemenu(req, res) {
  const itemId = req.params.id;

  try {
    const item = await Cardapio.destroy({ where: { id: itemId } });

    if (item === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    const cardapio = await Cardapio.findAll(); // Obter os itens atualizados do cardápio

    return res.redirect("/menuadm");
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover o item do cardápio', error });
  }
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

async function addcarrinho(req, res) {
  if (!req.session.carrinho) {
    req.session.carrinho = [];
  }
  req.session.carrinho.push(req.params.id);
  res.redirect("/menu");
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
  try {
    const metodo = req.body.metodo;
    let endereco = {}; // Inicializa o objeto de endereço vazio

    if (metodo === "delivery") {
      endereco = {
        rua: req.body.rua,
        bairro: req.body.bairro,
        numero: req.body.numero,
        telefone: req.body.telefone,
      };
    }

    const pedidos = await Pedido.create({
      situacao: "pendente",
      valortotal: 0.0,
      UsuarioId: req.user.id,
      datapedido: new Date(),
      metodo: metodo === "buscar" ? "buscar" : metodo,
      endereco: endereco, // Salva o objeto de endereço no atributo "endereco" do modelo PEDIDO
    });
    if(req.body.idpedido.length>1){
    for (var i = 0; i < req.body.idpedido.length; i++) {
      const valorPedido = parseFloat(req.body.valorpedido[i]);
      const quantidade = parseInt(req.body.quantidade[i]);
      
      const itens = await Itens.create({
        CardapioId: req.body.idpedido[i],
        valordoitem: valorPedido,
        quantidade: quantidade,
        PedidoId: pedidos.id,
      });

      console.log(itens);

      pedidos.valortotal += valorPedido * quantidade;
    }
  }else{
    const valorPedido = parseFloat(req.body.valorpedido);
      const quantidade = parseInt(req.body.quantidade);
      
      const itens = await Itens.create({
        CardapioId: req.body.idpedido,
        valordoitem: valorPedido,
        quantidade: quantidade,
        PedidoId: pedidos.id,
      });

      console.log(itens);

      pedidos.valortotal += valorPedido * quantidade;
  }

    await pedidos.save();

    res.redirect("/meuspedidos");
  } catch (error) {
    console.error("Erro ao salvar os itens:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao salvar os itens" });
  }
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

async function abrecomanda(req, res){
  const mesaSelecionada = req.session.mesaSelecionada || false; // Move a declaração da variável aqui
  const cardapio = await Cardapio.findAll({}).catch(function (err) {
    console.log(err);
  });
  
  res.render("admin/comanda", { Cardapio: cardapio, mesaSelecionada });
}

async function salvarMesaSelecionada(req, res) {
  const mesaSelecionada = req.body.mesa;

  req.session.mesaSelecionada = mesaSelecionada;
  console.log("mesa:" + mesaSelecionada);

  abrecomanda(req, res); // Adicione os argumentos req e res na chamada da função
}

async function abrepedido(req, res) {
  const mesaSelecionada = req.session.mesaSelecionada ;
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  const cardapio = await Cardapio.findAll({
    where: {
      id: {
        [Op.or]: [req.session.pedido],
      },
    },
  });

  res.render("admin/pedido.ejs", { Cardapio: cardapio, mesaSelecionada: mesaSelecionada });
}

async function addpedido(req, res) {
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  req.session.pedido.push(req.params.id);
  res.redirect("/admmesas");
}

async function removepedido(req, res) {
  const elementoId = req.params.id;
  console.log(req.params.id);
  if (!req.session.pedido) {
    req.session.pedido = [];
  }

  // Encontre o índice do elemento no carrinho
  const index = req.session.pedido.indexOf(elementoId);

  if (index !== -1) {
    // Remova o elemento do carrinho
    req.session.pedido.splice(index, 1);
  }

  res.redirect("/pedido");
}

async function salvarcomanda(req, res) {
  try {
    const pedidos_comanda = await Pedido_Comanda.create({
      situacao: "pendente",
      valortotal: 0.0,
      datapedido: new Date(),
      mesa: req.body.mesa,
    });

    console.log(pedidos_comanda);

    let valortotal = 0.0;

    if(req.body.idpedido.length > 1){
    for (var i = 0; i < req.body.idpedido.length; i++) {
      const valorPedido = parseFloat(req.body.valorpedido[i]);
      const quantidade = parseInt(req.body.quantidade[i]);


      const comanda = await Comanda.create({
        CardapioId: req.body.idpedido[i],
        valordoitem: valorPedido,
        quantidade: quantidade,
        PedidoComandaId: pedidos_comanda.id,
      });

      console.log(comanda);

      valortotal += (valorPedido) * (quantidade);
    }
  }else{
    const valorPedido = parseFloat(req.body.valorpedido);
      const quantidade = parseInt(req.body.quantidade);


      const comanda = await Comanda.create({
        CardapioId: req.body.idpedido,
        valordoitem: valorPedido,
        quantidade: quantidade,
        PedidoComandaId: pedidos_comanda.id,
      });

      console.log(comanda);

      valortotal += (valorPedido) * (quantidade);
  }

    pedidos_comanda.valortotal = valortotal;
    await pedidos_comanda.save();

    return res.status(200).json({ message: 'Comanda salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar a comanda:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao salvar a comanda' });
  }
}

async function pedidoscozinha(req,res){
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
    order: [["id", "DESC"]], // Ordenar por ID em ordem decrescente
  });

  const pedidos_comanda = await Pedido_Comanda.findAll({
    include: [
      {
        model: Comanda,
        include: [
          {
            model: Cardapio,
          },
        ],
      },
    ],
    order: [["id", "DESC"]], // Ordenar por ID em ordem decrescente
  });
  res.render("admin/pedidoscozinha.ejs", { Pedidos: pedidos, Pedido_Comanda: pedidos_comanda });
}

async function updatesituacaodelivery(req,res){
  const pedidoId = req.params.id;

  try {
    const pedido = await Pedido.findOne({
      where:{
        id: pedidoId,
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    pedido.situacao = 'Pronto'; // Atualize a situação do pedido para "pronto"
    await pedido.save(); // Salve as alterações no banco de dados

    return res.redirect('/pedidoscozinha');
  } catch (error) {
    console.error('Erro ao atualizar a situação do pedido:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a situação do pedido' });
  }
}

async function updatesituacao(req,res){
  const pedidoId = req.params.id; 

  try {
    const pedido_comanda = await Pedido_Comanda.findOne({
      where: {
        id: pedidoId,
      },
    });

    if (!pedido_comanda) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    pedido_comanda.situacao = 'Pronto'; // Atualize a situação do pedido para "pronto"
    await pedido_comanda.save(); // Salve as alterações no banco de dados

    return res.redirect('/pedidoscozinha');
  } catch (error) {
    console.error('Erro ao atualizar a situação do pedido:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a situação do pedido' });
  }
} 

module.exports = {
  principal,
  abreinicial,
  edtdescricao,
  salvardescricao,
  menu,
  pedidos,
  abreperfil,
  salvarperfil,
  sair,
  admsair,
  abreavaliacoes,
  avaliar,
  abrecarrinho,
  addmenu,
  addpromocao,
  menuadm,
  edtmenu,
  edtsalvar,
  removemenu,
  abrecomanda,
  salvarMesaSelecionada,
  criarmenu,
  addcarrinho,
  removeCarrinho,
  salvaritens,
  abrepedido,
  addpedido,
  removepedido,
  salvarcomanda,
  pedidoscozinha,
  updatesituacaodelivery,
  updatesituacao,
};
