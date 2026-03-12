import mongoose from 'mongoose';

const tentativaSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuario',
            required: true,
        },
        exame: {
            type: mongoose.Schema.ObjectId,
            ref: 'Exame',
            required: true,
        },
        respostas: [
            {
                questao: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Questao',
                    required: true,
                },
                opcaoSelecionada: {
                    type: String,
                    required: true,
                    enum: ['A', 'B', 'C', 'D', 'E'],
                },
                estaCorreta: {
                    type: Boolean,
                },
            },
        ],
        pontuacao: {
            type: Number,
            default: 0,
        },
        totalQuestoes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Tentativa = mongoose.model('Tentativa', tentativaSchema);
export default Tentativa;
