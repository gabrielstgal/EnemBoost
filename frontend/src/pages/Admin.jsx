import { useState, useRef } from 'react';
import { UploadSimple, FilePdf, CheckCircle, WarningCircle, Books } from '@phosphor-icons/react';
import { uploadService, exameService } from '../services/api';
import './Admin.css';

export default function Admin() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [arquivoLocal, setArquivoLocal] = useState(null);

    const [status, setStatus] = useState('idle'); // idle, uploading, sucess, error
    const [mensagem, setMensagem] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setArquivoLocal(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        
        if (!titulo) {
            setStatus('error');
            setMensagem('O título do simulado é obrigatório.');
            return;
        }

        setStatus('uploading');
        setMensagem('Enviando dados e arquivo...');

        try {
            let pdfUrlSalva = null;

            // 1. Faz upload do Arquivo primeiro
            if (arquivoLocal) {
                const resUpload = await uploadService.enviarPdf(arquivoLocal);
                pdfUrlSalva = resUpload.caminhoArquivo; // devolve a String /uploads/...
            }

            // 2. Cria o Exame atrelando a URL do PDF (se existir)
            await exameService.criarExame({
                titulo,
                descricao,
                questoes: [], // Array vazio pra simplificar na geracao avulsa com PDF
                pdfArquivo: pdfUrlSalva
            });

            setStatus('success');
            setMensagem('Simulado e arquivo salvos com sucesso!');
            
            // Limpa o form
            setTitulo('');
            setDescricao('');
            setArquivoLocal(null);
            
            setTimeout(() => {
                setStatus('idle');
                setMensagem('');
            }, 3000);

        } catch (error) {
            setStatus('error');
            setMensagem(error.message || 'Erro ao comunicar com o servidor.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: 0 }}>
            <div className="page-header highlight-admin">
                <h1>Painel do Coordenador</h1>
                <p>Nesta área exclusiva, adicione material pedagógico avançado à plataforma.</p>
            </div>

            <div className="admin-box">
                <div className="admin-box-header">
                    <Books size={24} weight="fill" />
                    <h2>Criar Novo Simulado Digital</h2>
                </div>

                <form onSubmit={handleSalvar} className="admin-form">
                    <div className="form-group">
                        <label>Título do Simulado</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Ex: Simulado Nacional ENEM 2024"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição Opcional</label>
                        <textarea 
                            className="input-field" 
                            placeholder="Descreva sobre o que é este teste..."
                            rows="3"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className="form-group upload-segment">
                        <label>Caderno de Questões (PDF)</label>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        
                        <div 
                            className={`upload-dropzone ${arquivoLocal ? 'has-file' : ''}`}
                            onClick={handleUploadClick}
                        >
                            {arquivoLocal ? (
                                <>
                                    <FilePdf size={48} weight="duotone" color="#EF4444" />
                                    <div className="file-info">
                                        <span className="file-name">{arquivoLocal.name}</span>
                                        <span className="file-size">{(arquivoLocal.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <span className="change-file-btn">Trocar arquivo</span>
                                </>
                            ) : (
                                <>
                                    <UploadSimple size={48} weight="light" color="var(--primary)" />
                                    <span className="upload-title">Clique para anexar o PDF da Prova</span>
                                    <span className="upload-sub">Tamanho máximo: 15MB. Formato: .pdf</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="admin-actions">
                        {status === 'success' && (
                            <div className="status-badge success-badge">
                                <CheckCircle weight="fill" /> {mensagem}
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="status-badge error-badge">
                                <WarningCircle weight="fill" /> {mensagem}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className={`btn btn-primary ${status === 'uploading' ? 'btn-loading' : ''}`}
                            disabled={status === 'uploading'}
                        >
                            {status === 'uploading' ? 'Publicando...' : 'Publicar Simulado Oficial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
