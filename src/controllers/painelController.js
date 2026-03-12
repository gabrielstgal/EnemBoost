import mongoose from 'mongoose';
import Tentativa from '../models/Tentativa.js';


export const obterEstatisticasPainel = async (req, res) => {
    try {
        const usuarioId = new mongoose.Types.ObjectId(req.usuario.id);


        const tentativas = await Tentativa.find({ usuario: usuarioId }).populate({
            path: 'exame',
            select: 'titulo',
        }).sort('-createdAt');

        const totalExamesRealizados = tentativas.length;


        const pontuacaoMedia =
            tentativas.length > 0
                ? tentativas.reduce((acc, curr) => acc + curr.pontuacao, 0) / tentativas.length
                : 0;


        const desempenhoPorMateria = await Tentativa.aggregate([
            { $match: { usuario: usuarioId } },
            { $unwind: '$respostas' },
            {
                $lookup: {
                    from: 'questaos',
                    localField: 'respostas.questao',
                    foreignField: '_id',
                    as: 'detalhesQuestao',
                },
            },
            { $unwind: '$detalhesQuestao' },
            {
                $group: {
                    _id: '$detalhesQuestao.materia',
                    totalTentativas: { $sum: 1 },
                    respostasCorretas: {
                        $sum: { $cond: [{ $eq: ['$respostas.estaCorreta', true] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    materia: '$_id',
                    totalTentativas: 1,
                    respostasCorretas: 1,
                    precisao: {
                        $multiply: [
                            { $divide: ['$respostasCorretas', '$totalTentativas'] },
                            100,
                        ],
                    },
                    _id: 0,
                },
            },
        ]);

        res.status(200).json({
            sucesso: true,
            dados: {
                totalExamesRealizados,
                pontuacaoMedia: Number(pontuacaoMedia.toFixed(2)),
                tentativasRecentes: tentativas.slice(0, 5),
                desempenhoPorMateria,
            },
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};
