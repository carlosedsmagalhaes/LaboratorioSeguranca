import { NextFunction, Request, Response } from "express";
import ValidarToken from "../Services/jwtServices";
import { RetornoPayload } from "../Tipos/retornoPayload";

declare global {
    namespace Express {
        interface Request {
            usuario?: RetornoPayload;
        }
    }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("authorization");
    const [tipo, token] = authorization?.split(" ") ?? [];

    if (tipo !== "Bearer" || !token) {
        res.status(401).json({ message: "Token de autenticação ausente" });
        return;
    }

    const usuario = ValidarToken(token);
    if (!usuario) {
        res.status(401).json({ message: "Token de autenticação inválido ou expirado" });
        return;
    }

    req.usuario = usuario;
    next();
}

export function exigirPerfis(...perfis: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario || !perfis.includes(req.usuario.tipo)) {
            res.status(403).json({ message: "Acesso negado" });
            return;
        }

        next();
    };
}