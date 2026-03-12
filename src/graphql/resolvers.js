import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import Usuario from '../models/Usuario.js';
import Conteudo from '../models/Conteudo.js';
import Exame from '../models/Exame.js';
import Tentativa from '../models/Tentativa.js';
import Questao from '../models/Questao.js';
import mongoose from 'mongoose';


const verificarLogado = (usuario) => {
    if (!usuario) {
        throw new AuthenticationError('Não autorizado, faça login.');
    }
};

const verificarAdmin = (usuario) => {
    verificarLogado(usuario);
    if (usuario.papel !== 'admin') {
        throw new ForbiddenError('Apenas administradores podem fazer isto.');
    }
};

export const resolvers = {
    Query: {

        obterEu: async (_, __, context) => {
            verificarLogado(context.usuario);
            return await Usuario.findById(context.usuario.id);
        },


        obterConteudos: async (_, { materia }) => {
            let query = {};
            if (materia) query.materia = materia;
            return await Conteudo.find(query).populate('usuario');
        },


        obterConteudo: async (_, { id }) => {
            return await Conteudo.findById(id).populate('usuario');
        },


        obterExames: async () => {
            return await Exame.find().populate('questoes').populate('usuario');
        },


        obterExame: async (_, { id }) => {
            return await Exame.findById(id).populate('questoes').populate('usuario');
        },


        obterEstatisticasPainel: async (_, __, context) => {
            verificarLogado(context.usuario);
            const usuarioId = new mongoose.Types.ObjectId(context.usuario.id);

            const tentativas = await Tentativa.find({ usuario: usuarioId }).populate('exame').sort('-createdAt');
            const totalExamesRealizados = tentativas.length;

            const pontuacaoMedia = tentativas.length > 0
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

            return {
                totalExamesRealizados,
                pontuacaoMedia: Number(pontuacaoMedia.toFixed(2)),
                tentativasRecentes: tentativas.slice(0, 5),
                desempenhoPorMateria,
            };
        }
    },

    Mutation: {

        criarConteudo: async (_, args, context) => {
            verificarAdmin(context.usuario);
            const conteudo = await Conteudo.create({
                ...args,
                usuario: context.usuario.id
            });
            return await Conteudo.findById(conteudo._id).populate('usuario');
        },


        enviarTentativa: async (_, { exameId, respostas }, context) => {
            verificarLogado(context.usuario);

            const exame = await Exame.findById(exameId).populate('questoes');
            if (!exame) throw new Error(`Simulado não encontrado com ID ${exameId}`);

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
                usuario: context.usuario.id,
                exame: exameId,
                respostas: respostasAvaliadas,
                pontuacao,
                totalQuestoes: exame.questoes.length
            });

            return await Tentativa.findById(tentativa._id).populate('exame').populate('usuario');
        }
    },


    Conteudo: {
        usuario: async (parent) => {
            return await Usuario.findById(parent.usuario);
        }
    },
    Exame: {
        usuario: async (parent) => {
            return await Usuario.findById(parent.usuario);
        },
        questoes: async (parent) => {
            const exame = await Exame.findById(parent.id).populate('questoes');
            return exame.questoes;
        }
    },
    Questao: {
        usuario: async (parent) => {
            return await Usuario.findById(parent.usuario);
        }
    },
    Tentativa: {
        usuario: async (parent) => {
            return await Usuario.findById(parent.usuario);
        },
        exame: async (parent) => {
            return await Exame.findById(parent.exame);
        }
    }
};
