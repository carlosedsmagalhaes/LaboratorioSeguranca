import { Router } from "express";
import { login, atualizarIptu, novoLogin, getIptuPorIdUsuario, getQRCodeOrCodBarras, getIptus } from "../controllers/usuarioController";
import { autenticar, exigirPerfis } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/novo-login", novoLogin);
router.put("/atualizar-iptu", autenticar, exigirPerfis(1, 2), atualizarIptu);
router.get("/iptu-por-usuario", autenticar, getIptuPorIdUsuario);
router.get("/codigo-qr-ou-barra", autenticar, getQRCodeOrCodBarras);
router.get("/iptus", autenticar, exigirPerfis(1, 2), getIptus);

export default router;