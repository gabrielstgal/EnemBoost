import express from 'express';
import {
    obterQuestoes,
    criarQuestao,
    atualizarQuestao,
    deletarQuestao,
    resolverQuestao,
} from '../controllers/questaoController.js';

import { proteger, autorizar } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(obterQuestoes)
    .post(proteger, autorizar('admin'), criarQuestao);

router
    .route('/:id')
    .put(proteger, autorizar('admin'), atualizarQuestao)
    .delete(proteger, autorizar('admin'), deletarQuestao);

router.post('/:id/responder', proteger, resolverQuestao);

export default router;
