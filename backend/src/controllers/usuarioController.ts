import { Request, Response } from "express";
import db from "../database";
import { GerarToken } from "../Services/jwtServices";
import xss from "xss";



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const query =
        `SELECT id, nome, email, tipo_usuario_id FROM usuario WHERE email = $1 AND senha = $2`;

    console.log(`Query Executada: ${query}`);

    const result = await db.query(query, [email, password]);

    if (result.rowCount && result.rowCount > 0) {
        
        const usuario = {
            id: result.rows[0].id,
            nome: result.rows[0].nome,
            email: result.rows[0].email,
            tipo: result.rows[0].tipo_usuario_id
        };

        res.cookie("access_token", GerarToken(usuario), {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        res.json({
            success: true,
            user: usuario
        });

    } else {
        res.status(401).json({
            success: false,
            message: "Falha no login"
        });
    }
};


export const novoLogin = async (req: Request, res: Response) => {
    const { email, password, nome } = req.body;

    //CORREÇÃO CONTRA XSS.
    const emailSanitizado = xss(email);
    const passwordSanitizado = xss(password);
    const nomeSanitizado = xss(nome);

    const queryNomeIpuExiste =
        `SELECT * FROM iptu WHERE nome = $1`;

    console.log(`Query Executada: ${queryNomeIpuExiste}`);

    const iptuResult = await db.query(queryNomeIpuExiste, [nomeSanitizado]);

    if (iptuResult.rowCount && iptuResult.rowCount > 0) {

        const query =
            `INSERT INTO usuario (email, senha, nome, tipo_usuario_id)
             VALUES ($1, $2, $3, 3)`;

        console.log(`Query Executada: ${query}`);

        const result = await db.query(query, [emailSanitizado, passwordSanitizado, nomeSanitizado]);

        const queryIdUsuario =
            `SELECT id FROM usuario
             WHERE email = $1 AND senha = $2`;

        console.log(`Query Executada: ${queryIdUsuario}`);

        const resultIdUsuario = await db.query(queryIdUsuario, [emailSanitizado, passwordSanitizado]);

        const queryUpdateTabelaIptu =
            `UPDATE iptu
             SET usuario_id = $1
             WHERE nome = $2`;

        console.log(`Query Executada: ${queryUpdateTabelaIptu}`);

        const resultUpdate = await db.query(queryUpdateTabelaIptu, [resultIdUsuario.rows[0].id, nome]);

        if (
            result.rowCount &&
            result.rowCount > 0 &&
            resultUpdate.rowCount &&
            resultUpdate.rowCount > 0
        ) {

            res.json({
            success: true,
            user: result.rows[0]
        
            });

        } else {
            res.status(401).json({
                success: false,
                message: "Falha no login"
            });
        }

    } else {
        res.status(404).json({
            success: false,
            message: `Nome ${nome} não encontrado no cadastro de municipes`
        });
    }
};


export const atualizarIptu = async (req: Request, res: Response) => {

    const {
        usuarioId,
        novoValor
    } = req.body;

    const query =
        `UPDATE iptu
         SET valor = $1
         WHERE usuario_id = $2`;

    console.log(`Query Executada: ${query}`);

    try {
        await db.query(query, [novoValor, usuarioId]);

        res.json({
            message: "IPTU atualizado"
        });

    } catch (err: any) {
        res.status(500).json({
            error: err.message
        });
    }
};


export const getIptuPorIdUsuario = async (
    req: Request,
    res: Response
) => {

    const usuarioId = req.usuario?.id;
    const query =
        `SELECT * FROM iptu WHERE usuario_id = $1`;

    console.log(`Query Executada: ${query}`);

    try {

        const result = await db.query(query, [usuarioId]);

        console.log(`Retorno: ${JSON.stringify(result.rows)}`);

        res.json({
            iptu: result.rows
        });

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }
};


export const getIptus = async (
    req: Request,
    res: Response
) => {

    
    const query = `SELECT * FROM iptu`;

    console.log(`Query Executada: ${query}`);

    try {

        const result = await db.query(query);

        res.json({
            iptu: result.rows
        });

    } catch (err: any) {

        res.status(500).json({
            error: err.message
        });
    }
};


export const getQRCodeOrCodBarras = async (
    req: Request,
    res: Response
) => {

    const tipo = req.query.tipo as string;

    //CORREÇÃO CONTRA XSS, DEIXA DE ENVIAR O HTML DIRETAMENTE PARA O FRONTEND.
    if (tipo !== "codigoDeBarras" && tipo !== "qrcode") {
        res.status(400).json({ message: "Tipo de código inválido" });
        return;
    }

    res.json({ tipo });
};

