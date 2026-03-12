import Conteudo from '../models/Conteudo.js';


export const obterConteudos = async (req, res) => {
    try {
        let query;


        if (req.query.materia) {
            query = Conteudo.find({ materia: req.query.materia });
        } else {
            query = Conteudo.find();
        }

        const conteudos = await query;

        res.status(200).json({
            sucesso: true,
            contagem: conteudos.length,
            dados: conteudos,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const obterConteudo = async (req, res) => {
    try {
        const conteudo = await Conteudo.findById(req.params.id);

        if (!conteudo) {
            return res.status(404).json({ sucesso: false, mensagem: `Conteúdo não encontrado com o id ${req.params.id}` });
        }

        res.status(200).json({
            sucesso: true,
            dados: conteudo,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const criarConteudo = async (req, res) => {
    try {

        req.body.usuario = req.usuario.id;

        const conteudo = await Conteudo.create(req.body);

        res.status(201).json({
            sucesso: true,
            dados: conteudo,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const atualizarConteudo = async (req, res) => {
    try {
        let conteudo = await Conteudo.findById(req.params.id);

        if (!conteudo) {
            return res.status(404).json({ sucesso: false, mensagem: `Conteúdo não encontrado com o id ${req.params.id}` });
        }


        if (conteudo.usuario.toString() !== req.usuario.id && req.usuario.papel !== 'admin') {
            return res.status(401).json({ sucesso: false, mensagem: `Usuário ${req.usuario.id} não está autorizado a atualizar este conteúdo` });
        }

        conteudo = await Conteudo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            sucesso: true,
            dados: conteudo,
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};


export const deletarConteudo = async (req, res) => {
    try {
        const conteudo = await Conteudo.findById(req.params.id);

        if (!conteudo) {
            return res.status(404).json({ sucesso: false, mensagem: `Conteúdo não encontrado com o id ${req.params.id}` });
        }


        if (conteudo.usuario.toString() !== req.usuario.id && req.usuario.papel !== 'admin') {
            return res.status(401).json({ sucesso: false, mensagem: `Usuário ${req.usuario.id} não está autorizado a deletar este conteúdo` });
        }

        await conteudo.deleteOne();

        res.status(200).json({
            sucesso: true,
            dados: {},
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
};
