import { Link } from 'react-router-dom';
import { RocketLaunch, CheckCircle, Student, ChartLineUp, MapTrifold, PencilLine, BookOpenText } from '@phosphor-icons/react';

export default function Landing() {
    return (
        <div>
            <header className="navbar">
                <div className="container nav-container">
                    <div className="logo">
                        <RocketLaunch weight="fill" />
                        <span>EnemBoost</span>
                    </div>
                    <nav className="nav-links">
                        <Link to="/" className="active">Início</Link>
                        <Link to="#">Recursos</Link>
                        <Link to="/trilhas">Trilhas de Estudo</Link>
                        <Link to="#">Redação</Link>
                        <Link to="/desempenho">Desempenho</Link>
                    </nav>
                    <div className="nav-actions">
                        <Link to="/login" className="btn btn-ghost">Entrar</Link>
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="hero container">
                    <div className="hero-content">
                        <div className="badge badge-blue">
                            <CheckCircle weight="fill" />
                            Aprovado por +10.000 estudantes
                        </div>
                        <h1>Aumente sua nota no <span>ENEM com inteligência</span></h1>
                        <p>Simulados inteligentes, análise de desempenho em tempo real e trilhas personalizadas baseadas nos seus pontos fracos para você garantir a sua vaga.</p>
                        <div className="hero-actions">
                            <Link to="/praticar" className="btn btn-primary">Começar agora</Link>
                            <Link to="/praticar" className="btn btn-outline">Fazer simulado grátis</Link>
                        </div>
                    </div>
                    <div className="hero-image-wrapper">
                        <Student weight="fill" className="hero-image-placeholder" style={{ fontSize: '100px', color: 'var(--primary)' }} />
                        <div className="floating-badge">
                            <CheckCircle weight="fill" style={{ fontSize: '24px', color: 'var(--secondary)' }} />
                            <div className="floating-badge-text">
                                <strong>+120 pontos</strong>
                                <span>Média de evolução</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features">
                    <div className="container">
                        <div className="features-header">
                            <div className="subtitle">Por que escolher o EnemBoost?</div>
                            <h2>Nossa tecnologia foca no seu resultado</h2>
                            <p>Combinamos ciência de dados com as melhores práticas de estudo para criar uma experiência de aprendizado única.</p>
                        </div>
                        
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon"><ChartLineUp weight="fill" /></div>
                                <h3>Análise de Desempenho</h3>
                                <p>Gráficos interativos mostram seus pontos fortes e fracos, direcionando seu estudo para o que realmente importa.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><MapTrifold weight="fill" /></div>
                                <h3>Trilhas Inteligentes</h3>
                                <p>Sua jornada é personalizada de acordo com seu rendimento. Foque nos assuntos que mais caem e que você precisa melhorar.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><PencilLine weight="fill" /></div>
                                <h3>Trilhas de Redação</h3>
                                <p>Temas inéditos toda semana e correções detalhadas indicando os desvios segundo as competências do MEC.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><BookOpenText weight="fill" /></div>
                                <h3>Simulados Realistas</h3>
                                <p>Questões no modelo TRI, com cronômetro para você treinar a gestão de tempo real da prova.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section container">
                    <div className="cta-box">
                        <h2>Pronto para ser aprovado na universidade dos sonhos?</h2>
                        <p>Junte-se a milhares de estudantes que já deixaram o método tradicional para trás. Comece a estudar do jeito certo, hoje mesmo.</p>
                        <Link to="/praticar" className="btn btn-light">Fazer meu primeiro simulado agora</Link>
                    </div>
                </section>
            </main>

            <footer className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', backgroundColor: 'transparent', padding: '60px 0', borderTop: '1px solid var(--border)' }}>
                    <div className="footer-logo">
                        <RocketLaunch weight="fill" style={{ color: 'var(--primary)', fontSize: '28px' }} />
                        <span style={{ fontSize: '22px', fontWeight: '800' }}>EnemBoost</span>
                    </div>
                    <div className="footer-links" style={{ gap: '40px', fontWeight: '500' }}>
                        <Link to="#">Recursos</Link>
                        <Link to="#">Termos e Privacidade</Link>
                        <Link to="#">Central de Ajuda</Link>
                        <Link to="#">Fale Conosco</Link>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '16px' }}>
                        &copy; 2026 EnemBoost Labs. Plataforma de Inteligência Educacional.
                    </div>
                </div>
            </footer>
        </div>
    );
}
