import { useState } from 'react';
import { FileArrowUp, FileText, CheckCircle, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import './Redacao.css';

export default function Redacao() {
    const [file, setFile] = useState(null);
    const [themeCode, setThemeCode] = useState('Desafios da Inteligência Artificial na Educação');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            {/* Header */}
            <div className="page-header">
                <h1>Redação EnemBoost</h1>
                <p>Pratique a escrita, anexe seus textos e receba correções detalhadas baseadas nas competências do ENEM.</p>
            </div>

            {/* Tema em Destaque */}
            <div className="redacao-theme-card">
                <div className="theme-meta">
                    <span className="badge-outline">TEMA DA SEMANA</span>
                    <span className="deadline-text">Expira em 5 dias</span>
                </div>
                <h2>{themeCode}</h2>
                <p>
                    Escreva um texto dissertativo-argumentativo apontando perspectivas de solução para este problema com base nos textos motivadores disponíveis.
                </p>
                <div className="theme-actions">
                    <button className="btn btn-outline" style={{ backgroundColor: 'white' }}> Ler Textos Motivadores</button>
                    <button className="btn btn-primary" style={{ backgroundColor: 'var(--text-main)', color: 'white', border: 'none' }}>
                        <PencilSimpleLine weight="bold" /> Escrever Texto Online
                    </button>
                </div>
            </div>

            {/* Seção de Anexo */}
            <div className="card-section" style={{ marginTop: '40px' }}>
                <h2>Anexar Arquivo (Folha de Redação)</h2>
            </div>
            
            <div className="upload-section">
                {!file ? (
                    <div className="upload-area">
                        <FileArrowUp weight="light" className="upload-icon" />
                        <h3>Arraste sua redação digitalizada aqui</h3>
                        <p>Formatos suportados: PDF, JPG ou PNG (Max 5MB)</p>
                        
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden-input" 
                            accept=".pdf, image/jpeg, image/png"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="btn btn-outline" style={{ marginTop: '24px' }}>
                            Procurar Arquivos
                        </label>
                    </div>
                ) : (
                    <div className="file-ready-area">
                        <div className="file-info-box">
                            <div className="file-icon-wrapper">
                                <FileText weight="fill" />
                            </div>
                            <div className="file-details">
                                <h4>{file.name}</h4>
                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button className="btn-icon-trash" onClick={handleRemoveFile}>
                                <Trash weight="fill" />
                            </button>
                        </div>
                        
                        <div className="submit-box">
                            <span className="success-text"><CheckCircle weight="fill" /> Arquivo pronto para envio</span>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Mandar para Correção IA</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Redações Anteriores */}
            <div className="card-section" style={{ marginTop: '40px' }}>
                <h2>Redações Anteriores</h2>
            </div>
            <div className="history-empty-state">
                <FileText weight="light" />
                <p>Você ainda não enviou nenhuma redação para correção.</p>
            </div>
        </div>
    );
}
