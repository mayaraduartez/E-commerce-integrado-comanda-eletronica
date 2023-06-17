const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); //importa as funções de controller
const principalController = require("../controllers/principalController"); 
const upload = require("../config/upload");
const autenticacao = require("../config/autenticacao");
const autenticacaoadmin = require("../config/autenticacaoadmin");



//abrir a tela de login e cadastro
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

router.get("/abreinicial", 
principalController.abreinicial);

router.get("/meuspedidos", 
principalController.pedidos);

router.get("/meuperfil",
principalController.abreperfil);

router.post("/meuperfil",
upload.single('foto'), 
principalController.salvarperfil);

router.post('/logout', principalController.sair);


router.get("/avaliacoes",
principalController.abreavaliacoes);

router.post("/avaliar", 
principalController.avaliar);

router.get("/carrinho", 
principalController.abrecarrinho);

router.get("/menu", 
autenticacao,
principalController.menu,
);

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

router.get("/carrinho/add/:id", 
principalController.addcarrinho,
);

router.post("/carrinho", 
principalController.salvaritens);

router.get('/carrinho/remove/:id', principalController.removeCarrinho);



module.exports = router;
