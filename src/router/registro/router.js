import express from "express";
import { registro,finalizar } from "../../controllers/Registro.controll.js";

const router = express.Router();

router.route("/").post(registro).put(finalizar);

export default router;
