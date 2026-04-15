import { useState, useEffect } from 'react';
import { BookOpen, Funnel, Plus, X, PlayCircle, GraduationCap, Calculator, Globe, Leaf, UsersThree, PenNib } from '@phosphor-icons/react';
import { conteudoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Trilhas.css';

const MATERIAS = [
    { nome: 'Matemática', classe: 'tc-math', icon: Calculator },
    { nome: 'Linguagens', classe: 'tc-lang', icon: Globe },
    { nome: 'Natureza', classe: 'tc-nature', icon: Leaf },
    { nome: 'Humanas', classe: 'tc-human', icon: UsersThree },
    { nome: 'Redação', classe: 'tc-essay', icon: PenNib },
];

export default function Trilhas() {
    const { usuario } = useAuth();
    const isAdmin = usuario?.papel === 'admin';

    const [conteudos, setConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [filtroMateria, setFiltroMateria] = useState('');

    // Modal admin
    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [novoConteudo, setNovoConteudo] = useState({
        titulo: '',
        descricao: '',
        corpo: '',
        materia: 'Matemática',
    });

    // Conteúdo expandido
    const [conteudoAberto, setConteudoAberto] = useState(null);

    const carregarTrilhas = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const res = await conteudoService.obterConteudos();
            setConteudos(res.dados || []);
        } catch (err) {
            setErro('Não foi possível carregar os conteúdos no momento.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarTrilhas();
    }, []);

    const handleCriarConteudo = async () => {
        if (!novoConteudo.titulo.trim()) return alert('Preencha o título.');
        if (!novoConteudo.descricao.trim()) return alert('Preencha a descrição.');
        if (!novoConteudo.corpo.trim()) return alert('Preencha o corpo do conteúdo.');

        setSalvando(true);
        try {
            await conteudoService.criarConteudo(novoConteudo);
            setModalAberto(false);
            setNovoConteudo({ titulo: '', descricao: '', corpo: '', materia: 'Matemática' });
            carregarTrilhas();
        } catch (err) {
            alert('Erro ao criar conteúdo: ' + err.message);
        } finally {
            setSalvando(false);
        }
    };

    // Contagem por matéria
    const contagemPorMateria = {};
    conteudos.forEach(c => {
        contagemPorMateria[c.materia] = (contagemPorMateria[c.materia] || 0) + 1;
    });

    // Filtrar conteúdos
    const conteudosFiltrados = filtroMateria
        ? conteudos.filter(c => c.materia === filtroMateria)
        : conteudos;

    const materiasDisponiveis = ['', ...MATERIAS.map(m => m.nome)];

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Trilhas de Estudo</h1>
                    <p>Explore os conteúdos organizados por área de conhecimento do ENEM.</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
                        <Plus weight="bold" /> Novo Conteúdo
                    </button>
                )}
            </div>

            {/* Cards de Trilhas por Matéria */}
            <div className="trails-grid">
                {MATERIAS.map(materia => {
                    const Icon = materia.icon;
                    const count = contagemPorMateria[materia.nome] || 0;
                    const isActive = filtroMateria === materia.nome;

                    return (
                        <div
                            className={`trail-card ${materia.classe} ${isActive ? 'trail-active' : ''}`}
                            key={materia.nome}
                            onClick={() => setFiltroMateria(isActive ? '' : materia.nome)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="trail-icon-wrapper">
                                <Icon weight="fill" size={28} />
                            </div>
                            <div className="trail-title">{materia.nome}</div>
                            <div className="trail-count">
                                {count} {count === 1 ? 'conteúdo' : 'conteúdos'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filtros */}
            <div className="q-filters-container">
                <div className="q-filters-label">
                    <Funnel weight="fill" /> Filtrar:
                </div>
                <div className="q-filters-list">
                    {materiasDisponiveis.map(materia => (
                        <button
                            key={materia}
                            className={`q-filter-btn ${filtroMateria === materia ? 'active' : ''}`}
                            onClick={() => setFiltroMateria(materia)}
                        >
                            {materia === '' ? 'Todas as Matérias' : materia}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estados de carregamento e erro */}
            {carregando && <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '24px' }}>Carregando conteúdos...</div>}
            {erro && <div style={{ color: 'red', marginBottom: '24px' }}>{erro}</div>}

            {/* Lista de Conteúdos */}
            <div className="card-section">
                <h2>
                    {filtroMateria ? `Conteúdos de ${filtroMateria}` : 'Todos os Conteúdos'}
                    <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '12px' }}>
                        ({conteudosFiltrados.length})
                    </span>
                </h2>
            </div>

            {!carregando && conteudosFiltrados.length === 0 && (
                <div className="trilhas-empty-state">
                    <GraduationCap size={48} weight="light" />
                    <p>Nenhum conteúdo disponível{filtroMateria ? ` para ${filtroMateria}` : ''} no momento.</p>
                    {isAdmin && <p style={{ fontSize: '13px' }}>Clique em "Novo Conteúdo" para adicionar.</p>}
                </div>
            )}

            <div className="steps-list">
                {conteudosFiltrados.map((conteudo) => {
                    const materiaInfo = MATERIAS.find(m => m.nome === conteudo.materia);
                    const isAberto = conteudoAberto === conteudo._id;

                    return (
                        <div className="step-item-wrapper" key={conteudo._id}>
                            <div
                                className={`step-item ${isAberto ? 'step-aberto' : ''}`}
                                onClick={() => setConteudoAberto(isAberto ? null : conteudo._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="step-info">
                                    <div className={`step-icon si-${materiaInfo?.classe?.replace('tc-', '') || 'blue'}`}>
                                        <BookOpen weight="fill" />
                                    </div>
                                    <div className="step-text">
                                        <h4>{conteudo.titulo}</h4>
                                        <p>
                                            <span className={`step-materia-badge ${materiaInfo?.classe || ''}`}>{conteudo.materia}</span>
                                            {conteudo.descricao}
                                        </p>
                                    </div>
                                </div>
                                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                                    {isAberto ? 'Fechar' : 'Ver Conteúdo'}
                                </button>
                            </div>
                            {isAberto && (
                                <div className="step-corpo">
                                    <div className="step-corpo-content" dangerouslySetInnerHTML={{ __html: conteudo.corpo }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal Admin: Criar Conteúdo */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Novo Conteúdo</h2>
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
                                    placeholder="Ex: Probabilidade e Estatística"
                                    value={novoConteudo.titulo}
                                    onChange={e => setNovoConteudo({ ...novoConteudo, titulo: e.target.value })}
                                />
                            </label>

                            <label className="modal-label">
                                Matéria
                                <select
                                    className="modal-input"
                                    value={novoConteudo.materia}
                                    onChange={e => setNovoConteudo({ ...novoConteudo, materia: e.target.value })}
                                >
                                    {MATERIAS.map(m => (
                                        <option key={m.nome} value={m.nome}>{m.nome}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="modal-label">
                                Descrição
                                <textarea
                                    rows={2}
                                    className="modal-input"
                                    placeholder="Breve descrição do conteúdo..."
                                    value={novoConteudo.descricao}
                                    onChange={e => setNovoConteudo({ ...novoConteudo, descricao: e.target.value })}
                                />
                            </label>

                            <label className="modal-label">
                                Corpo do Conteúdo
                                <textarea
                                    rows={8}
                                    className="modal-input"
                                    placeholder="Escreva o conteúdo completo aqui (aceita HTML)..."
                                    value={novoConteudo.corpo}
                                    onChange={e => setNovoConteudo({ ...novoConteudo, corpo: e.target.value })}
                                />
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleCriarConteudo} disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Criar Conteúdo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
