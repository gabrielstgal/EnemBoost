import { useState, useEffect } from 'react';
import { Target, Fire, CheckCircle, TrendUp, Calculator, BookBookmark, PenNib, ClockCounterClockwise } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { painelService } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const { usuario } = useAuth();
    const [estatisticas, setEstatisticas] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await painelService.obterEstatisticas();
                setEstatisticas(res.dados);
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const simuladosFeitos = estatisticas?.totalExamesRealizados || 0;
    const mediaScore = estatisticas?.pontuacaoMedia || 0;

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            {}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h1>Olá, {usuario?.nome || 'Estudante'}! 👋</h1>
                    <p>Você tem tarefas pendentes para hoje. Vamos começar?</p>
                </div>
                <Link to="/trilhas" className="btn btn-primary" style={{ background: 'white', color: 'var(--text-main)' }}>Ir para trilhas</Link>
            </div>

            {}
            <div className="quick-stats-grid">
                <div className="stat-card">
                    <div className="stat-card-title">Meta Diária <Target weight="fill" style={{ color: 'var(--color-human)', fontSize: '18px' }} /></div>
                    <div className="stat-value" style={{ fontSize: '24px' }}>2h / 3h <span style={{ fontSize: '12px', marginLeft: '8px' }} className="text-green">Em andamento</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Ofensiva <Fire weight="fill" style={{ color: 'var(--color-nature)', fontSize: '18px' }} /></div>
                    <div className="stat-value" style={{ fontSize: '24px' }}>5 Dias <span style={{ fontSize: '12px', marginLeft: '8px' }} className="text-muted">Seguidos</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Simulados Feitos <CheckCircle weight="fill" style={{ color: 'var(--secondary)', fontSize: '18px' }} /></div>
                    <div className="stat-value" style={{ fontSize: '24px' }}>
                        {loadingStats ? '...' : simuladosFeitos} 
                        <span style={{ fontSize: '12px', marginLeft: '8px' }} className="text-muted">Total</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Questões do Banco <TrendUp weight="fill" style={{ color: 'var(--primary)', fontSize: '18px' }} /></div>
                    <div className="stat-value" style={{ fontSize: '24px' }}>
                        {localStorage.getItem('questoesResolvidas') || 0}
                        <span style={{ fontSize: '12px', marginLeft: '8px' }} className="text-green">Resolvidas</span>
                    </div>
                </div>
            </div>

            {}
            <div className="dashboard-grid">
                {}
                <div>
                    <div className="card-section">
                        <h2>Continue de onde parou</h2>
                    </div>
                    <div className="resume-card">
                        <div className="resume-icon">
                            <Calculator weight="fill" />
                        </div>
                        <div className="resume-info">
                            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>Matemática • Trilha Básica</span>
                            <h3>Probabilidade e Estatística I</h3>
                            <p>Você parou no exercício 12 de 20. Faltam aproximadamente 15 minutos para concluir o módulo.</p>
                            <button className="btn btn-primary">Retomar Atividade</button>
                        </div>
                    </div>
                </div>

                {}
                <div>
                    <div className="card-section">
                        <h2>Horas de Estudo</h2>
                    </div>
                    <div className="mini-chart">
                        <div className="mini-chart-header">
                            <span className="mini-chart-title">Esta semana</span>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>12.5h total</span>
                        </div>
                        <div className="bars-container">
                            <div className="bar-col"><div className="bar-pill" style={{ height: '40%' }}></div><span>S</span></div>
                            <div className="bar-col"><div className="bar-pill" style={{ height: '60%' }}></div><span>T</span></div>
                            <div className="bar-col"><div className="bar-pill" style={{ height: '30%' }}></div><span>Q</span></div>
                            <div className="bar-col"><div className="bar-pill active" style={{ height: '90%' }}></div><span style={{ color: 'var(--text-main)' }}>Q</span></div>
                            <div className="bar-col"><div className="bar-pill" style={{ height: '0%' }}></div><span>S</span></div>
                            <div className="bar-col"><div className="bar-pill" style={{ height: '0%' }}></div><span>S</span></div>
                            <div className="bar-col"><div className="bar-pill" style={{ height: '0%' }}></div><span>D</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="card-section">
                <h2>Recomendado para você</h2>
                <Link to="#" className="view-all">Ver todas</Link>
            </div>
            <div className="recommendations">
                <div className="exam-card">
                    <div className="exam-card-header">
                        <div className="icon-box" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                            <BookBookmark weight="fill" />
                        </div>
                        <span className="badge-outline">REVISÃO</span>
                    </div>
                    <h3 style={{ fontSize: '15px' }}>Cinemática: Queda Livre</h3>
                    <p>Notamos que você errou algumas questões neste tema no último simulado.</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Revisar conteúdo</button>
                </div>
                
                <div className="exam-card">
                    <div className="exam-card-header">
                        <div className="icon-box" style={{ background: '#F3E8FF', color: '#9333EA' }}>
                            <PenNib weight="fill" />
                        </div>
                        <span className="badge-outline">NOVO</span>
                    </div>
                    <h3 style={{ fontSize: '15px' }}>Redação: Desafios da IA</h3>
                    <p>Tema inédito liberado nesta semana. Pratique seus argumentos.</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Fazer redação</button>
                </div>

                <div className="exam-card">
                    <div className="exam-card-header">
                        <div className="icon-box" style={{ background: '#ECFDF5', color: '#10B981' }}>
                            <ClockCounterClockwise weight="fill" />
                        </div>
                        <span className="badge-outline">SIMULADO</span>
                    </div>
                    <h3 style={{ fontSize: '15px' }}>Simulado de Linguagens #2</h3>
                    <p>45 questões. Otimize seu tempo de leitura com este treino.</p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Iniciar</button>
                </div>
            </div>
        </div>
    );
}
