import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'Por favor, adicione um nome'],
        },
        email: {
            type: String,
            required: [true, 'Por favor, adicione um email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Por favor, adicione um email válido',
            ],
        },
        senha: {
            type: String,
            required: [true, 'Por favor, adicione uma senha'],
            minlength: 6,
            select: false,
        },
        papel: {
            type: String,
            enum: ['estudante', 'admin'],
            default: 'estudante',
        },
    },
    {
        timestamps: true,
    }
);


usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});


usuarioSchema.methods.compararSenha = async function (senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
