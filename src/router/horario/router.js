import express from 'express';
import { createHorario, deleteHorario, findOneHorario, getAllHorario, updateHorario } from '../../controllers/Horario.controller.js';


const router = express.Router();

router.route("/").post(createHorario).get(getAllHorario);
router.route("/:id").put(updateHorario).get(findOneHorario).delete(deleteHorario);

export default router;