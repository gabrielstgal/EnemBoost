import express from 'express';
import {
    obterConteudos,
    obterConteudo,
    criarConteudo,
    atualizarConteudo,
    deletarConteudo,
} from '../controllers/conteudoController.js';

import { proteger, autorizar } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(obterConteudos)
    .post(proteger, autorizar('admin'), criarConteudo);

router
    .route('/:id')
    .get(obterConteudo)
    .put(proteger, autorizar('admin'), atualizarConteudo)
    .delete(proteger, autorizar('admin'), deletarConteudo);

export default router;
