import express from "express";
import { deleteRegistro, findAllRegistro, findByIdRegistro, insertRegistro, updateRegistro } from "../../controllers/Registros.controller.js";

const router = express.Router();

router.route("/").get(findAllRegistro).post(insertRegistro);
router.route("/:id").delete(deleteRegistro).get(findByIdRegistro).put(updateRegistro);
export default router;