const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); //importa as funções de controller
const principalController = require("../controllers/principalController"); 
const upload = require("../config/upload");
const autenticacao = require("../config/autenticacao");
const autenticacaoadmin = require("../config/autenticacaoadmin");



//abrir a tela de login e cadastro
router.get("/login", loginController.abreTela);

router.get("/cadastro", loginController.cadastrar);

router.post("/cadastro", loginController.cadastro);

router.post("/login", loginController.logar);

router.get("/forgot", loginController.forgot);

router.post("/forgot", loginController.recuperar);

router.get("/token", loginController.telatoken);

router.get("/", principalController.principal);

router.get("/meuspedidos", principalController.pedidos);

router.get("/carrinho", principalController.abrecarrinho);

router.get("/menu", 
autenticacao,
principalController.menu,

);

router.get("/addmenu", 
autenticacaoadmin,
principalController.addmenu,
);

router.post("/addmenu", autenticacaoadmin, upload.single('foto'), principalController.criarmenu)

router.get("/addpromocao", 
autenticacaoadmin,
principalController.addpromocao,
);

router.get("/carrinho/add/:id", 
principalController.addcarrinho,
);

router.post("/carrinho", principalController.salvaritens);







module.exports = router;
