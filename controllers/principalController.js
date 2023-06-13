const Usuario = require("../models/Usuario");
const Cardapio = require("../models/Cardapio");
const Itens = require("../models/Itens");
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");
const Pedido = require("../models/Pedido");

  async function principal(req, res) {
    res.render("conteudo/principal.ejs");
  }

  async function abreinicial(req,res){
    res.render("admin/principal.ejs");
  }

  async function menu(req, res) {
    const cardapio = await Cardapio.findAll({
      
    }).catch(function (err) {
      console.log(err)
    });
    res.render("conteudo/menu", { Cardapio: cardapio });
  }

  

  async function pedidos(req, res) {
    res.render("conteudo/meuspedidos.ejs");
  }


  async function addmenu(req, res) {
    res.render("admin/addmenu.ejs");
  }

  async function addpromocao(req, res) {
    res.render("admin/addpromocao.ejs");
  }

  async function criarmenu(req, res){
    
    const cardapio = await Cardapio.create({
      foto: req.file.filename,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      valor: req.body.valor,
      tipo: req.body.tipo,
    }).catch(err=>{
      
    });
    res.redirect("/menu");
  };

  async function addcarrinho(req, res) {
    if(!req.session.carrinho){
      req.session.carrinho = []
    }
    req.session.carrinho.push(req.params.id)
    res.redirect('/menu')
  }

  async function abrecarrinho(req, res) {
    if(!req.session.carrinho){
      req.session.carrinho = []
    }
    const cardapio = await Cardapio.findAll({
      where:{
        id:{
          [Op.or]:[req.session.carrinho]
        } 
      }
    })
    
    res.render("conteudo/carrinho.ejs", {Cardapio:cardapio});
  }

  async function removeCarrinho(req, res) {
    const elementoId = req.params.id;
    console.log(req.params.id)
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }
  
    // Encontre o índice do elemento no carrinho
    const index = req.session.carrinho.indexOf(elementoId);
  
    if (index !== -1) {
      // Remova o elemento do carrinho
      req.session.carrinho.splice(index, 1);
    }
  
    res.redirect('/carrinho')
  }
  

  async function salvaritens(req, res){
    
    const pedidos = await Pedido.create({
      situacao: "pendente",
      valortotal: 0.0,
      UsuarioId: req.user.id,
      datapedido: new Date(),
    }).catch((err)=>{
      
    });
    
    for(var i=0; i<req.body.idpedido.length; i++){
      const itens = await Itens.create({
        CardapioId: req.body.idpedido[i],
        valordoitem: req.body.valorpedido[i],
        quantidade: req.body.quantidade[i],
        PedidoId: pedidos.id,
        
      }).catch(err=>{
        console.log(err)
      });
      console.log(itens)
      pedidos.valortotal = pedidos.valortotal + (itens.valordoitem*itens.quantidade)
    }
    await pedidos.save()
    
    res.redirect("/meuspedidos");
  };

  async function pedidos(req, res) {
    const pedidos = await Pedido.findAll({ include: [ { all: true } ] },{where:{UsuarioId: req.user.id}})
    console.log(pedidos)
    res.render('conteudo/meuspedidos',{ Pedidos:pedidos })
    
  }

  

  module.exports = { 
    principal,
    abreinicial,
    menu, 
    pedidos, 
    abrecarrinho, 
    addmenu,
    addpromocao,
    criarmenu,
    addcarrinho,
    removeCarrinho,
    salvaritens,
  };