import { useState, useEffect } from 'react';
import { ChartLineUp, ChartBar, Target, Trophy, Clock, Brain, ListNumbers } from '@phosphor-icons/react';
import { exameService } from '../services/api';
import './Desempenho.css';

export default function Desempenho() {
    const [tentativas, setTentativas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarDesempenho = async () => {
            try {
                const res = await exameService.obterMinhasTentativas();
                setTentativas(res.dados || []);
            } catch (err) {
                setErro('Não foi possível carregar seu histórico de simulados.');
            } finally {
                setCarregando(false);
            }
        };

        carregarDesempenho();
    }, []);

    
    const totalSimulados = tentativas.length;
    
    let mediaAcertos = 0;
    let totalQuestoes = 0;
    let totalAcertos = 0;
    let melhorNota = 0;

    if (totalSimulados > 0) {
        const somaNotas = tentativas.reduce((acc, t) => acc + t.pontuacao, 0);
        mediaAcertos = (somaNotas / totalSimulados).toFixed(1);

        totalQuestoes = tentativas.reduce((acc, t) => acc + t.totalQuestoes, 0);
        
        tentativas.forEach(t => {
            const acertosNesta = t.respostas.filter(r => r.estaCorreta).length;
            totalAcertos += acertosNesta;
            if (t.pontuacao > melhorNota) melhorNota = t.pontuacao;
        });
    }

    const formatarData = (dataString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            <div className="page-header">
                <h1>Painel de Desempenho</h1>
                <p>Acompanhe sua evolução e identifique as matérias que precisam de mais dedicação.</p>
            </div>

            {carregando && <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Carregando estatísticas...</div>}
            {erro && <div style={{ color: 'red' }}>{erro}</div>}

            {!carregando && !erro && (
                <>
                    {}
                    <div className="metrics-grid">
                        <div className="metric-card master">
                            <div className="metric-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                <ChartLineUp weight="fill" />
                            </div>
                            <div className="metric-content">
                                <h3>Média Geral</h3>
                                <div className="metric-value">{mediaAcertos}%</div>
                                <p>Últimos {totalSimulados} simulados</p>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                                <Trophy weight="fill" />
                            </div>
                            <div className="metric-content">
                                <h3>Recorde Pessoal</h3>
                                <div className="metric-value">{melhorNota.toFixed(1)}%</div>
                                <p>A sua melhor pontuação</p>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                                <Target weight="fill" />
                            </div>
                            <div className="metric-content">
                                <h3>Total de Acertos</h3>
                                <div className="metric-value">{totalAcertos} <span style={{fontSize: '16px', color: 'var(--text-muted)'}}>/ {totalQuestoes}</span></div>
                                <p>Questões resolvidas</p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="history-section">
                        <h2>Trajetória de Evolução</h2>
                        <p className="history-sub">Acompanhe visualmente o rendimento de cada ciclo de estudos realizado.</p>

                        {totalSimulados === 0 ? (
                            <div className="empty-history">
                                <Brain weight="light" size={48} />
                                <p>Você ainda não realizou nenhum simulado.</p>
                                <button className="btn btn-primary" style={{marginTop: '16px'}}>Acessar Praticar</button>
                            </div>
                        ) : (
                            <div className="timeline-container">
                                {tentativas.map((tentativa, idx) => {
                                    const examNnome = tentativa.exame?.titulo || 'Simulado Avulso';
                                    const acertosNesta = tentativa.respostas.filter(r => r.estaCorreta).length;
                                    
                                    
                                    let progressColor = 'var(--primary)';
                                    if(tentativa.pontuacao >= 80) progressColor = '#10B981';
                                    else if(tentativa.pontuacao <= 40) progressColor = '#EF4444';

                                    return (
                                        <div className="timeline-item" key={tentativa._id || idx}>
                                            <div className="tl-grade-badge" style={{ borderColor: progressColor, color: progressColor }}>
                                                {tentativa.pontuacao.toFixed(0)}%
                                            </div>
                                            
                                            <div className="tl-content">
                                                <div className="tl-header">
                                                    <h4>{examNnome}</h4>
                                                    <span className="tl-date"><Clock /> {formatarData(tentativa.criadoEm || new Date())}</span>
                                                </div>
                                                
                                                <div className="tl-body">
                                                    <div className="tl-stats">
                                                        <span><ListNumbers weight="bold" /> {acertosNesta} de {tentativa.totalQuestoes} Acertos</span>
                                                    </div>
                                                    
                                                    {}
                                                    <div className="tl-bar-bg">
                                                        <div 
                                                            className="tl-bar-fill" 
                                                            style={{ width: `${tentativa.pontuacao}%`, backgroundColor: progressColor }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
