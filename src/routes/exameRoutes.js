import express from 'express';
import {
    obterExames,
    obterExame,
    obterMinhasTentativas,
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
    .route('/tentativas/minhas')
    .get(proteger, obterMinhasTentativas);

router
    .route('/:id')
    .get(obterExame);

router
    .route('/:id/tentativas')
    .post(proteger, enviarTentativa);

export default router;
