import express from "express";
import userRoutes from "./routes/usuarioRoutes";
import commentRoutes from "./routes/comentarioRoutes";
import hackerMalvadao from "./routes/hackerMalvadaoRoutes";
import cookieParser from "cookie-parser";
import { protegerCsrf } from "./middleware/csrfMiddleware";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(protegerCsrf);
// app.use(express.urlencoded({ extended: true }));

app.use("/usuario", userRoutes);
app.use("/comentario", commentRoutes);
app.use("/hacker-malvadao", hackerMalvadao);

app.listen(3001, () => {
    console.log("Servidor Vulnerável rodando na porta 3001");
});