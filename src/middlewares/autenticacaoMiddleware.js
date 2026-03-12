import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const proteger = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {

            token = req.headers.authorization.split(' ')[1];


            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decodificado.id).select('-senha');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ sucesso: false, mensagem: 'Não autorizado, falha no token' });
        }
    }

    if (!token) {
        res.status(401).json({ sucesso: false, mensagem: 'Não autorizado, sem token' });
    }
};


export const autorizar = (...papeis) => {
    return (req, res, next) => {
        if (!papeis.includes(req.usuario.papel)) {
            return res.status(403).json({
                sucesso: false,
                mensagem: `O papel do usuário ${req.usuario.papel} não tem autorização para acessar esta rota`,
            });
        }
        next();
    };
};
