import express from 'express';
import {
    obterExames,
    criarExame,
    enviarTentativa
} from '../controllers/exameController.js';

import { proteger, autorizar } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(obterExames)
    .post(proteger, autorizar('admin'), criarExame);

router
    .route('/:id/tentativas')
    .post(proteger, enviarTentativa);

export default router;
