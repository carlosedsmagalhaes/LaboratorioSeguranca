import jwt from "jsonwebtoken";
import { RetornoPayload } from "../Tipos/retornoPayload";

const segredoJwt = "chave-secreta";

function obterSegredoJwt(): string {
    if (!segredoJwt) {
        throw new Error("JWT_SECRET não configurado");
    }

    return segredoJwt;
}

export function GerarToken(payload: RetornoPayload): string {
    return jwt.sign(payload, obterSegredoJwt(), { expiresIn: "1h" });
}

export default function ValidarToken(token: string): RetornoPayload | null {
    try {
        const decoded = jwt.verify(token, obterSegredoJwt()) as RetornoPayload;
        return {
            id: Number(decoded.id),
            tipo: Number(decoded.tipo),
            email: decoded.email,
            nome: decoded.nome
        };
    } catch (error) {
        return null;
    }
}


