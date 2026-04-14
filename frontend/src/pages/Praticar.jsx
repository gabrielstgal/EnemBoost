import { useState, useEffect } from 'react';
import { Calculator, BookOpen, Flask, ListNumbers, Clock } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { exameService } from '../services/api';
import './Praticar.css';

export default function Praticar() {
    const [exames, setExames] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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

        carregarExames();
    }, []);

    const examesDestaque = exames.length > 0 ? exames[0] : null;
    const examesLista = exames.length > 1 ? exames.slice(1) : exames;

    const abrirSimulado = (id) => {
        navigate(`/simulado/${id}`);
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            <div className="page-header">
                <h1>Pratique com Simulados</h1>
                <p>Preparamos para o ENEM com questões reais de edições anteriores e monitoramento do tempo.</p>
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

        </div>
    );
}
