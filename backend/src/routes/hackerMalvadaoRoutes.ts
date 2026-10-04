import { Router } from "express";
import { recepcionarDadosRoubados } from "../controllers/hackerMalvadaoController";
import { autenticar, exigirPerfis } from "../middleware/authMiddleware";

const router = Router();

router.post("/dados-roubados", autenticar, exigirPerfis(1), recepcionarDadosRoubados);

export default router;