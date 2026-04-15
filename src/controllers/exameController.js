import Exame from '../models/Exame.js';
import Tentativa from '../models/Tentativa.js';
import Questao from '../models/Questao.js';


export const obterExames = async (req, res) => {
    try {
        const exames = await Exame.find().populate({
            path: 'questoes',
            select: 'texto materia topico'
        });

        res.status(200).json({
            sucesso: true,
            contagem: exames.length,
            dados: exames,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const obterExame = async (req, res) => {
    try {
        const exame = await Exame.findById(req.params.id).populate({
            path: 'questoes',
            select: '-opcaoCorreta' 
        });

        if (!exame) {
            return res.status(404).json({ sucesso: false, mensagem: `Simulado não encontrado com o id ${req.params.id}` });
        }

        res.status(200).json({
            sucesso: true,
            dados: exame,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};

export const criarExame = async (req, res) => {
    try {
        req.body.usuario = req.usuario.id;

        const exame = await Exame.create(req.body);

        res.status(201).json({
            sucesso: true,
            dados: exame,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const enviarTentativa = async (req, res) => {
    try {
        const exame = await Exame.findById(req.params.id).populate('questoes');

        if (!exame) {
            return res.status(404).json({ sucesso: false, mensagem: `Simulado não encontrado com o id ${req.params.id}` });
        }

        const { respostas } = req.body;
        if (!respostas || !Array.isArray(respostas)) {
            return res.status(400).json({ sucesso: false, mensagem: 'Array de respostas é obrigatório' });
        }


        const dicionarioQuestoes = {};
        for (let q of exame.questoes) {
            dicionarioQuestoes[q._id.toString()] = q.opcaoCorreta;
        }

        let contagemCorretas = 0;
        const respostasAvaliadas = respostas.map(resp => {
            const estaCorreta = dicionarioQuestoes[resp.questao] === resp.opcaoSelecionada;
            if (estaCorreta) contagemCorretas++;

            return {
                questao: resp.questao,
                opcaoSelecionada: resp.opcaoSelecionada,
                estaCorreta
            };
        });

        const pontuacao = (contagemCorretas / exame.questoes.length) * 100;

        const tentativa = await Tentativa.create({
            usuario: req.usuario.id,
            exame: req.params.id,
            respostas: respostasAvaliadas,
            pontuacao,
            totalQuestoes: exame.questoes.length
        });

        res.status(201).json({
            sucesso: true,
            dados: tentativa,
            mensagem: `Você acertou ${contagemCorretas} de ${exame.questoes.length} (${pontuacao}%)`
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};

export const obterMinhasTentativas = async (req, res) => {
    try {
        const tentativas = await Tentativa.find({ usuario: req.usuario.id })
            .populate({
                path: 'exame',
                select: 'titulo descricao' 
            })
            .sort('-criadoEm'); 

        res.status(200).json({
            sucesso: true,
            contagem: tentativas.length,
            dados: tentativas,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};



