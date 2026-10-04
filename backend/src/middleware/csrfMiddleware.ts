import { randomBytes } from "crypto";
import { NextFunction, Request, Response } from "express";

const nomeCookieCsrf = "csrf_token";
const metodosMutaveis = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function novoTokenCsrf(): string {
    return randomBytes(32).toString("hex");
}

export function protegerCsrf(req: Request, res: Response, next: NextFunction) {
    let tokenCookie = req.cookies?.[nomeCookieCsrf] as string | undefined;

    if (!tokenCookie) {
        tokenCookie = novoTokenCsrf();
        res.cookie(nomeCookieCsrf, tokenCookie, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: "/"
        });
    }

    res.locals.csrfToken = tokenCookie;

    if (metodosMutaveis.has(req.method)) {
        const tokenHeader = req.header("x-csrf-token");

        if (!tokenHeader || tokenCookie !== tokenHeader) {
            res.status(403).json({ message: "Token CSRF ausente ou inválido" });
            return;
        }
    }

    next();
}
