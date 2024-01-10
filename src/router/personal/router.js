import express from 'express';
import { createPersonal, deletePersonal, findAllPersonal, getPersonalByDni, updatePersonal } from '../../controllers/Personal.controll.js';


const router = express.Router();

router.route("/").post(createPersonal).get(findAllPersonal);
router.route("/:dni").put(updatePersonal).delete(deletePersonal).get(getPersonalByDni);

export default  router;