import mongoose from 'mongoose';

const conteudoSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'Por favor, adicione um título para o conteúdo'],
            trim: true,
            maxlength: [100, 'O título não pode ter mais de 100 caracteres'],
        },
        descricao: {
            type: String,
            required: [true, 'Por favor, adicione uma descrição'],
            maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
        },
        corpo: {
            type: String,
            required: [true, 'Por favor, adicione o corpo do conteúdo'],
        },
        materia: {
            type: String,
            required: [true, 'Por favor, adicione uma matéria'],
            enum: [
                'Matemática',
                'Linguagens',
                'Natureza',
                'Humanas',
                'Redação',
            ],
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

const Conteudo = mongoose.model('Conteudo', conteudoSchema);
export default Conteudo;
