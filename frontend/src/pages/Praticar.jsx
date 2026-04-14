import { useState, useEffect, useRef } from 'react';
import { Calculator, BookOpen, Flask, ListNumbers, Clock, Plus, X, UploadSimple, File } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { exameService, uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Praticar.css';

export default function Praticar() {
    const { usuario } = useAuth();
    const isAdmin = usuario?.papel === 'admin';

    const [exames, setExames] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    // Modal admin
    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [arquivoPdf, setArquivoPdf] = useState(null);
    const fileInputRef = useRef(null);

    const carregarExames = async () => {
        try {
            const res = await exameService.obterExames();
            setExames(res.dados || []);
        } catch (err) {
            setErro('Não foi possível carregar os simulados no momento.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarExames();
    }, []);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files[0] || e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setArquivoPdf(file);
        } else if (file) {
            alert('Apenas arquivos PDF são permitidos.');
        }
    };

    const handleCriarSimulado = async () => {
        if (!titulo.trim()) return alert('Preencha o título do simulado.');

        setSalvando(true);
        try {
            let pdfUrl = null;
            if (arquivoPdf) {
                const uploadRes = await uploadService.enviarPdf(arquivoPdf);
                pdfUrl = uploadRes.caminhoArquivo;
            }

            await exameService.criarExame({
                titulo,
                descricao,
                questoes: [],
                ...(pdfUrl && { pdfArquivo: pdfUrl })
            });

            setModalAberto(false);
            setTitulo('');
            setDescricao('');
            setArquivoPdf(null);
            carregarExames();
        } catch (err) {
            alert('Erro ao criar simulado: ' + err.message);
        } finally {
            setSalvando(false);
        }
    };

    const examesDestaque = exames.length > 0 ? exames[0] : null;
    const examesLista = exames.length > 1 ? exames.slice(1) : exames;

    const abrirSimulado = (id) => {
        navigate(`/simulado/${id}`);
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Pratique com Simulados</h1>
                    <p>Preparamos para o ENEM com questões reais de edições anteriores e monitoramento do tempo.</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
                        <Plus weight="bold" /> Novo Simulado
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="filters">
                <button className="filter-chip active">Todos os Simulados</button>
            </div>

            {carregando && <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '24px' }}>Carregando exames do banco de dados...</div>}
            {erro && <div style={{ color: 'red', marginBottom: '24px' }}>{erro}</div>}

            {/* Featured Exam */}
            {examesDestaque && (
                <div className="featured-exam">
                    <div className="featured-content">
                        <span className="featured-label">Novidade da Semana</span>
                        <h2>{examesDestaque.titulo}</h2>
                        <p>{examesDestaque.descricao || 'Simulado completo para testar seu nível.'}</p>
                        
                        <div className="featured-stats">
                            <div className="stat-item">
                                <span>Questões</span>
                                <span>{examesDestaque.questoes?.length || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span>Tempo Sugerido</span>
                                <span>{(examesDestaque.questoes?.length || 0) * 3} min</span>
                            </div>
                        </div>
                        
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '12px 32px' }}
                            onClick={() => abrirSimulado(examesDestaque._id)}
                        >
                            Acessar Simulado
                        </button>
                    </div>
                </div>
            )}

            {/* Area Exams */}
            {examesLista.length > 0 && (
                <>
                    <div className="card-section">
                        <h2>Outros Simulados</h2>
                    </div>

                    <div className="exams-grid">
                        {examesLista.map((exame) => (
                            <div className="exam-card" key={exame._id}>
                                <div className="exam-card-header">
                                    <div className="icon-box icon-math">
                                        <ListNumbers weight="fill" />
                                    </div>
                                    <span className="badge-outline">TREINO</span>
                                </div>
                                <h3>{exame.titulo}</h3>
                                <p>{exame.descricao}</p>
                                <div className="exam-meta">
                                    <div><ListNumbers /> {exame.questoes?.length || 0} questões</div>
                                    <div><Clock /> {(exame.questoes?.length || 0) * 3}m</div>
                                </div>
                                <button className="btn btn-outline" onClick={() => abrirSimulado(exame._id)}>Acessar Simulado</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {!carregando && exames.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>Nenhum simulado disponível ainda.</p>
            )}

            {/* Progress Banner */}
            <div className="progress-banner" style={{ marginTop: '40px' }}>
                <div className="progress-banner-text">
                    <h2>Seu progresso é a nossa meta.</h2>
                    <p>Continue praticando! A consistência de simulados leva ao domínio do tempo no dia da prova.</p>
                </div>
            </div>

            {/* Modal Admin: Criar Simulado */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Novo Simulado</h2>
                            <button className="modal-close" onClick={() => setModalAberto(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <label className="modal-label">
                                Título
                                <input
                                    type="text"
                                    className="modal-input"
                                    placeholder="Ex: Simulado ENEM 2024 - Dia 1"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                />
                            </label>

                            <label className="modal-label">
                                Descrição
                                <textarea
                                    rows={3}
                                    className="modal-input"
                                    placeholder="Breve descrição do simulado..."
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                />
                            </label>

                            <p className="modal-section-title">Anexar PDF (opcional)</p>
                            <div
                                className={`upload-dropzone ${arquivoPdf ? 'has-file' : ''}`}
                                onDrop={handleFileDrop}
                                onDragOver={e => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleFileDrop}
                                />
                                {arquivoPdf ? (
                                    <div className="upload-file-info">
                                        <File size={24} />
                                        <span>{arquivoPdf.name}</span>
                                        <button className="upload-remove" onClick={e => { e.stopPropagation(); setArquivoPdf(null); }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <UploadSimple size={32} />
                                        <p>Arraste um PDF ou clique para selecionar</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleCriarSimulado} disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Criar Simulado'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
