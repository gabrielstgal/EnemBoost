import express from 'express';
import { registrar, login, obterEu } from '../controllers/autenticacaoController.js';
import { proteger } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/eu', proteger, obterEu);

export default router;
