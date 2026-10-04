import { Router } from "express";
import { criarComentario, listarComentarios } from "../controllers/comentarioController";
import { autenticar } from "../middleware/authMiddleware";

const router = Router();

router.post("/", autenticar, criarComentario);
router.get("/", listarComentarios);

export default router;