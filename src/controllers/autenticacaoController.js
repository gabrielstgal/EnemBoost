import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';


const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


export const registrar = async (req, res) => {
    try {
        const { nome, email, senha, papel } = req.body;


        const usuarioExiste = await Usuario.findOne({ email });

        if (usuarioExiste) {
            return res.status(400).json({ sucesso: false, mensagem: 'Usuário já existe' });
        }

        const usuario = await Usuario.create({
            nome,
            email,
            senha,
            papel
        });

        if (usuario) {
            res.status(201).json({
                sucesso: true,
                dados: {
                    _id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    papel: usuario.papel,
                    token: gerarToken(usuario._id),
                },
            });
        } else {
            res.status(400).json({ sucesso: false, mensagem: 'Dados de usuário inválidos' });
        }
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        
        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: 'Por favor, forneça um e-mail e uma senha' });
        }

        
        const usuario = await Usuario.findOne({ email }).select('+senha');

        if (!usuario) {
            return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
        }

       
        const aSenhaCorresponde = await usuario.compararSenha(senha);

        if (!aSenhaCorresponde) {
            return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
        }

        
        res.status(200).json({
            sucesso: true,
            dados: {
                _id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                papel: usuario.papel,
                token: gerarToken(usuario._id), 
            },
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const obterEu = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        res.status(200).json({
            sucesso: true,
            dados: usuario,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};
