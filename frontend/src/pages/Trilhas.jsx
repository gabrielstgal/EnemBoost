import { useState, useEffect } from 'react';
import { ChartDonut, CheckSquareOffset, CalendarCheck, TrendUp, PlayCircle, BookOpen } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { conteudoService } from '../services/api';
import './Trilhas.css';

export default function Trilhas() {
    const [conteudos, setConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarTrilhas = async () => {
            try {
                const res = await conteudoService.obterConteudos();
                setConteudos(res.dados || []);
            } catch (err) {
                setErro('Não foi possível carregar os conteúdos no momento.');
            } finally {
                setCarregando(false);
            }
        };

        carregarTrilhas();
    }, []);

    // Agrupar os conteúdos por Matéria de forma única para criar os \"Cards\" de trilhas
    const materiasUnicas = [...new Set(conteudos.map(c => c.materia))];

    // Helper para gerar as cores/ícones baseados na matéria
    const getMateriaClass = (materia) => {
        const map = {
            'Matemática': 'tc-math',
            'Linguagens': 'tc-lang',
            'Natureza': 'tc-nature',
            'Humanas': 'tc-human',
            'Redação': 'tc-essay'
        };
        return map[materia] || 'tc-math';
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            <div className="page-header">
                <h1>Minhas Trilhas</h1>
                <p>Sua rota de progresso e domínio do edital do ENEM.</p>
            </div>

            {/* Stats Row estático por enquanto (Até conectarmos a progressão) */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-card-title">
                        Progresso Geral
                        <ChartDonut weight="fill" style={{ color: 'var(--primary)', fontSize: '20px' }} />
                    </div>
                    <div className="stat-value">
                        64%
                        <span className="stat-sub text-green"><TrendUp /> +5% esta semana</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">
                        Questões Respondidas
                        <CheckSquareOffset weight="fill" style={{ color: 'var(--color-nature)', fontSize: '20px' }} />
                    </div>
                    <div className="stat-value">
                        1,248
                        <span className="stat-sub text-red" style={{ opacity: 0.8 }}>-12% na taxa de erro</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">
                        Dias de Estudo
                        <CalendarCheck weight="fill" style={{ color: 'var(--color-human)', fontSize: '20px' }} />
                    </div>
                    <div className="stat-value">
                        15 <span style={{ fontSize: '16px', marginLeft: '-4px' }}>dias</span>
                        <span className="stat-sub text-green">em uma rodada!</span>
                    </div>
                </div>
            </div>

            {/* Trails Grid dinâmico */}
            <div className="card-section">
                <h2>Trilhas em Andamento</h2>
                {carregando && <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Carregando...</span>}
            </div>

            {erro ? (
                <div style={{ color: 'red', marginBottom: '40px' }}>{erro}</div>
            ) : (
                <div className="trails-grid">
                    {materiasUnicas.length === 0 && !carregando ? (
                        <p style={{ color: 'var(--text-muted)' }}>Nenhuma trilha disponível no momento.</p>
                    ) : (
                        materiasUnicas.map(materia => (
                            <div className={`trail-card ${getMateriaClass(materia)}`} key={materia}>
                                <div className="trail-header">
                                    <div className="trail-title">Trilha de {materia}</div>
                                    <div className="trail-badge">FOCADO</div>
                                </div>
                                <div className="trail-progress-info">
                                    <span>Em progresso</span>
                                    <span>0%</span>
                                </div>
                                <div className="trail-progress-bar">
                                    <div className="trail-progress-fill" style={{ width: '0%' }}></div>
                                </div>
                                <button className="btn">Continuar</button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Next Steps dinâmico (Lista todos os conteúdos do BD) */}
            <div className="card-section">
                <h2>Próximos Passos (Aulas)</h2>
            </div>

            <div className="steps-list">
                {conteudos.length === 0 && !carregando ? (
                    <p style={{ color: 'var(--text-muted)' }}>Nenhum conteúdo listado.</p>
                ) : (
                    conteudos.map((conteudo) => (
                        <div className="step-item" key={conteudo._id}>
                            <div className="step-info">
                                <div className="step-icon si-blue">
                                    <BookOpen weight="fill" />
                                </div>
                                <div className="step-text">
                                    <h4>{conteudo.titulo}</h4>
                                    <p>{conteudo.materia} &bull; {conteudo.descricao}</p>
                                </div>
                            </div>
                            <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>Iniciar</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
