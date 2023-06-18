const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const principalController = require("../controllers/principalController"); 
const upload = require("../config/upload");
const autenticacao = require("../config/autenticacao");
const autenticacaoadmin = require("../config/autenticacaoadmin");

router.get("/login", 
loginController.abreTela);

router.get("/cadastro", 
loginController.cadastrar);

router.post("/cadastro", 
loginController.cadastro);

router.post("/login", 
loginController.logar);

router.get("/forgot", 
loginController.forgot);

router.post("/forgot", 
loginController.recuperar);

router.get("/token", 
loginController.telatoken);

router.post("/token", 
loginController.atualizarsenha)

router.get("/", 
principalController.principal);

router.get("/menu", 
autenticacao,
principalController.menu,
);

router.get("/meuspedidos", 
autenticacao,
principalController.pedidos);

router.get("/meuperfil",
autenticacao,
principalController.abreperfil);

router.post("/meuperfil",
upload.single('foto'), 
autenticacao,
principalController.salvarperfil);

router.post('/logout', 
autenticacao,
principalController.sair);

router.get("/avaliacoes",
principalController.abreavaliacoes);

router.post("/avaliar", 
autenticacao,
principalController.avaliar);

router.get("/carrinho", 
autenticacao,
principalController.abrecarrinho);

router.get("/carrinho/add/:id", 
autenticacao,
principalController.addcarrinho,
);

router.get('/carrinho/remove/:id',
autenticacao,
principalController.removeCarrinho);

router.post("/carrinho",
autenticacao, 
principalController.salvaritens);

router.get("/abreinicial", 
autenticacaoadmin,
principalController.abreinicial);

router.get("/addmenu", 
autenticacaoadmin,
principalController.addmenu,
);

router.post("/addmenu", 
autenticacaoadmin, 
upload.single('foto'), 
principalController.criarmenu)

router.get("/addpromocao", 
autenticacaoadmin,
principalController.addpromocao,
);

module.exports = router;
