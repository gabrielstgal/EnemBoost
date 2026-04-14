import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { proteger, autorizar } from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

// Garantir que a pasta de uploads exista
const uploadDir = 'uploads/simulados';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer (Storage)
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir); 
    },
    filename(req, file, cb) {
        // Nome único baseado na data
        cb(null, `simulado-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Filtro de upload para aceitar apenas PDFs
const checkFileType = (file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas arquivos PDF são permitidos.'));
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Rota de Upload do PDF (Apenas para Admins)
router.post('/', proteger, autorizar('admin'), upload.single('pdfArquivo'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado' });
    }

    res.status(200).json({
        sucesso: true,
        mensagem: 'PDF enviado com sucesso',
        caminhoArquivo: `/${req.file.path.replace(/\\/g, '/')}` // Normalizar caminhos Windows
    });
});

export default router;
