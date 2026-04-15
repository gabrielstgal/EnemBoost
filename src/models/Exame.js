import mongoose from 'mongoose';

const exameSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'Por favor, adicione um título ao simulado'],
        },
        descricao: {
            type: String,
        },
        questoes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Questao',
            },
        ],
        usuario: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuario',
            required: true,
        },
        pdfArquivo: {
            type: String, 
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Exame = mongoose.model('Exame', exameSchema);
export default Exame;
