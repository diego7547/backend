import express from 'express';
import { login , verificarToken} from '../../controllers/Login.controller.js';

const router = express.Router();

router.route('/').post(login).put(verificarToken);

export default router;