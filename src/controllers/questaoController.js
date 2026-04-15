import Questao from '../models/Questao.js';


export const obterQuestoes = async (req, res) => {
    try {
        let query;

        
        const match = {};
        if (req.query.materia) match.materia = req.query.materia;
        if (req.query.topico) match.topico = req.query.topico;

        query = Questao.find(match).select('-opcaoCorreta');

        const questoes = await query;

        res.status(200).json({
            sucesso: true,
            contagem: questoes.length,
            dados: questoes,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const criarQuestao = async (req, res) => {
    try {
        req.body.usuario = req.usuario.id;

        const questao = await Questao.create(req.body);

        res.status(201).json({
            sucesso: true,
            dados: questao,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const atualizarQuestao = async (req, res) => {
    try {
        let questao = await Questao.findById(req.params.id);

        if (!questao) {
            return res.status(404).json({ sucesso: false, mensagem: `Questão não encontrada com o id ${req.params.id}` });
        }

        if (questao.usuario.toString() !== req.usuario.id && req.usuario.papel !== 'admin') {
            return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado a atualizar esta questão' });
        }

        questao = await Questao.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            sucesso: true,
            dados: questao,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const deletarQuestao = async (req, res) => {
    try {
        const questao = await Questao.findById(req.params.id);

        if (!questao) {
            return res.status(404).json({ sucesso: false, mensagem: `Questão não encontrada com o id ${req.params.id}` });
        }

        if (questao.usuario.toString() !== req.usuario.id && req.usuario.papel !== 'admin') {
            return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado a deletar esta questão' });
        }

        await questao.deleteOne();

        res.status(200).json({
            sucesso: true,
            dados: {},
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const resolverQuestao = async (req, res) => {
    try {
        const questao = await Questao.findById(req.params.id);

        if (!questao) {
            return res.status(404).json({ sucesso: false, mensagem: `Questão não encontrada com o id ${req.params.id}` });
        }

        const { resposta } = req.body;

        if (!resposta) {
            return res.status(400).json({ sucesso: false, mensagem: 'Por favor forneça uma resposta (A, B, C, D ou E)' });
        }

        const estaCorreta = questao.opcaoCorreta === resposta;

        res.status(200).json({
            sucesso: true,
            estaCorreta,
            opcaoCorreta: questao.opcaoCorreta,
            mensagem: estaCorreta ? 'Resposta correta!' : 'Resposta incorreta.',
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};
