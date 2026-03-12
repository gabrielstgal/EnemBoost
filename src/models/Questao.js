import mongoose from 'mongoose';

const questaoSchema = new mongoose.Schema(
    {
        texto: {
            type: String,
            required: [true, 'Por favor, adicione o texto da questão'],
        },
        opcoes: [
            {
                texto: { type: String, required: true },
                identificador: {
                    type: String,
                    required: true,
                    enum: ['A', 'B', 'C', 'D', 'E'],
                },
            },
        ],
        opcaoCorreta: {
            type: String,
            required: true,
            enum: ['A', 'B', 'C', 'D', 'E'],
        },
        materia: {
            type: String,
            required: [true, 'Por favor, adicione uma matéria'],
            enum: ['Matemática', 'Linguagens', 'Natureza', 'Humanas', 'Redação'],
        },
        topico: {
            type: String,
        },
        usuario: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuario',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Questao = mongoose.model('Questao', questaoSchema);
export default Questao;
