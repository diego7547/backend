import express from "express";
import dotenv from "dotenv";
import  cors from "cors";

// routers
import routerRegistro from "./router/registro/router.js";
import routerPersonal from "./router/personal/router.js";
import routerLogin from "./router/login/router.js";
import routerHorario from "./router/horario/router.js";
import routerRegistros from "./router/registros/router.js";



// middleware 
import { checkToken } from "./utils/middlewares.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// api - registro
app.use("/api/login",routerLogin);
app.use("/api/registro",routerRegistro);
app.use("/api/personal",checkToken,routerPersonal);
app.use("/api/horario",checkToken,routerHorario);
app.use("/api/registros",checkToken,routerRegistros);

app.set('port',process.env.PORT || 3000);

app.listen(app.get('port'),()=>{
    console.log(`http://localhost:${app.get('port')}`)
});