import express from 'express';
import { obterEstatisticasPainel } from '../controllers/painelController.js';
import { proteger } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router.get('/', proteger, obterEstatisticasPainel);

export default router;
