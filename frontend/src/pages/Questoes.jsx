import { useState, useEffect } from 'react';
import { questaoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Funnel, CheckCircle, XCircle, Plus, X } from '@phosphor-icons/react';
import './Questoes.css';

export default function Questoes() {
    const { usuario } = useAuth();
    const isAdmin = usuario?.papel === 'admin';

    const [questoes, setQuestoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // Filtro ativo
    const [filtroMateria, setFiltroMateria] = useState('');

    // Paginação
    const [pagina, setPagina] = useState(1);
    const QUESTOES_POR_PAGINA = 5;

    // Estado das respostas submetidas
    const [respostas, setRespostas] = useState({});

    // Estado temporário de opção selecionada antes de enviar
    const [selecoesTemp, setSelecoesTemp] = useState({});

    // Modal de criar questão (admin)
    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [novaQuestao, setNovaQuestao] = useState({
        texto: '',
        materia: 'Matemática',
        topico: '',
        opcaoCorreta: 'A',
        opcoes: [
            { texto: '', identificador: 'A' },
            { texto: '', identificador: 'B' },
            { texto: '', identificador: 'C' },
            { texto: '', identificador: 'D' },
            { texto: '', identificador: 'E' },
        ]
    });

    useEffect(() => {
        carregarQuestoes();
    }, [filtroMateria]);

    const carregarQuestoes = async () => {
        setCarregando(true);
        setErro(null);
        try {
            // A API não suporta filtro no serviço ainda, mas vamos buscar todas
            const res = await questaoService.obterQuestoes();
            let lista = res.dados || [];
            
            if (filtroMateria) {
                lista = lista.filter(q => q.materia === filtroMateria);
            }
            
            setQuestoes(lista);
            setPagina(1); // Resetar página
        } catch (err) {
            setErro('Erro ao carregar o banco de questões.');
        } finally {
            setCarregando(false);
        }
    };

    const handleSelecionarOpcao = (questaoId, identificador) => {
        // Não deixa trocar se já foi respondida e corrigida
        if (respostas[questaoId]) return;
        
        setSelecoesTemp({
            ...selecoesTemp,
            [questaoId]: identificador
        });
    };

    const handleResponder = async (questaoId) => {
        const respostaUsuario = selecoesTemp[questaoId];
        if (!respostaUsuario) return;

        try {
            const res = await questaoService.responderQuestao(questaoId, respostaUsuario);
            
            // Incrementa estatística local para o Dashboard
            const questoesResolvidas = Number(localStorage.getItem('questoesResolvidas') || 0);
            localStorage.setItem('questoesResolvidas', questoesResolvidas + 1);

            setRespostas({
                ...respostas,
                [questaoId]: {
                    selecionada: respostaUsuario,
                    estaCorreta: res.estaCorreta,
                    corretaReal: res.opcaoCorreta
                }
            });
        } catch (err) {
            alert('Falha ao processar a resposta.');
        }
    };

    const carregarMais = () => {
        setPagina(pagina + 1);
    };

    // Admin: criar questão
    const handleOpcaoChange = (index, valor) => {
        const novasOpcoes = [...novaQuestao.opcoes];
        novasOpcoes[index] = { ...novasOpcoes[index], texto: valor };
        setNovaQuestao({ ...novaQuestao, opcoes: novasOpcoes });
    };

    const handleCriarQuestao = async () => {
        if (!novaQuestao.texto.trim()) return alert('Preencha o enunciado.');
        if (novaQuestao.opcoes.some(o => !o.texto.trim())) return alert('Preencha todas as 5 alternativas.');

        setSalvando(true);
        try {
            await questaoService.criarQuestao(novaQuestao);
            setModalAberto(false);
            setNovaQuestao({
                texto: '', materia: 'Matemática', topico: '', opcaoCorreta: 'A',
                opcoes: [
                    { texto: '', identificador: 'A' },
                    { texto: '', identificador: 'B' },
                    { texto: '', identificador: 'C' },
                    { texto: '', identificador: 'D' },
                    { texto: '', identificador: 'E' },
                ]
            });
            carregarQuestoes();
        } catch (err) {
            alert('Erro ao criar questão: ' + err.message);
        } finally {
            setSalvando(false);
        }
    };

    const questoesExibidas = questoes.slice(0, pagina * QUESTOES_POR_PAGINA);
    const materiasDisponiveis = ['', 'Matemática', 'Linguagens', 'Natureza', 'Humanas', 'Redação'];

    return (
        <div className="container" style={{ maxWidth: '900px', padding: 0 }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Banco de Questões</h1>
                    <p>Pratique de forma direcionada. Escolha a matéria e responda instantaneamente.</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
                        <Plus weight="bold" /> Nova Questão
                    </button>
                )}
            </div>

            {/* Area de Filtros */}
            <div className="q-filters-container">
                <div className="q-filters-label">
                    <Funnel weight="fill" /> Módulo:
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

            {carregando && <div style={{marginTop: '32px', color: 'var(--primary)', fontWeight: 'bold'}}>Carregando...</div>}
            {erro && <div style={{marginTop: '32px', color: 'red'}}>{erro}</div>}
            
            {!carregando && questoes.length === 0 && (
                <div className="q-empty-state">
                    Nenhuma questão encontrada para este filtro.
                </div>
            )}

            <div className="q-list">
                {questoesExibidas.map((questao, index) => {
                    const respondida = respostas[questao._id];
                    const temp = selecoesTemp[questao._id];

                    return (
                        <div className="q-card" key={questao._id}>
                            <div className="q-card-header">
                                <span className={`q-badge q-badge-${questao.materia.toLowerCase()}`}>{questao.materia}</span>
                                <span className="q-badge-ghost">Questão {index + 1}</span>
                            </div>
                            
                            <div className="q-texto" dangerouslySetInnerHTML={{ __html: questao.texto }}></div>
                            
                            <div className="q-opcoes">
                                {questao.opcoes && questao.opcoes.map(opcao => {
                                    let btnClass = 'q-opcao-btn ';
                                    
                                    if (respondida) {
                                        // Estilização após responder
                                        if (respondida.corretaReal === opcao.identificador) {
                                            btnClass += 'correct'; // A certa fica verde sempre
                                        } else if (respondida.selecionada === opcao.identificador && !respondida.estaCorreta) {
                                            btnClass += 'wrong'; // A errada que a pessoa escolheu fica vermelha
                                        } else {
                                            btnClass += 'disabled'; // Resto desativado
                                        }
                                    } else {
                                        // Estilização temporária
                                        if (temp === opcao.identificador) {
                                            btnClass += 'selected';
                                        }
                                    }

                                    return (
                                        <button 
                                            key={opcao.identificador}
                                            className={btnClass}
                                            onClick={() => handleSelecionarOpcao(questao._id, opcao.identificador)}
                                            disabled={!!respondida}
                                        >
                                            <div className="q-letra">{opcao.identificador}</div>
                                            <div className="q-opcao-texto">{opcao.texto}</div>
                                            
                                            {respondida && respondida.corretaReal === opcao.identificador && (
                                                <div className="q-icon-result success"><CheckCircle weight="fill" /></div>
                                            )}
                                            {respondida && respondida.selecionada === opcao.identificador && !respondida.estaCorreta && (
                                                <div className="q-icon-result danger"><XCircle weight="fill" /></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="q-card-footer">
                                {respondida ? (
                                    <div className={`q-feedback ${respondida.estaCorreta ? 'f-success' : 'f-danger'}`}>
                                        {respondida.estaCorreta ? 'Você acertou! Brilhante.' : 'Você errou. Tente rever seus conceitos.'}
                                    </div>
                                ) : (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleResponder(questao._id)}
                                        disabled={!temp}
                                    >
                                        Responder
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {questoesExibidas.length < questoes.length && (
                <div className="q-carregar-mais">
                    <button className="btn btn-outline" style={{width: '100%', padding: '16px', fontSize: '15px'}} onClick={carregarMais}>
                        Carregar Mais Questões
                    </button>
                </div>
            )}

            {/* Modal Admin: Criar Questão */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cadastrar Questão</h2>
                            <button className="modal-close" onClick={() => setModalAberto(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <label className="modal-label">
                                Enunciado
                                <textarea
                                    rows={4}
                                    className="modal-input"
                                    placeholder="Digite o enunciado da questão..."
                                    value={novaQuestao.texto}
                                    onChange={e => setNovaQuestao({ ...novaQuestao, texto: e.target.value })}
                                />
                            </label>

                            <div className="modal-row">
                                <label className="modal-label">
                                    Matéria
                                    <select
                                        className="modal-input"
                                        value={novaQuestao.materia}
                                        onChange={e => setNovaQuestao({ ...novaQuestao, materia: e.target.value })}
                                    >
                                        <option value="Matemática">Matemática</option>
                                        <option value="Linguagens">Linguagens</option>
                                        <option value="Natureza">Natureza</option>
                                        <option value="Humanas">Humanas</option>
                                        <option value="Redação">Redação</option>
                                    </select>
                                </label>
                                <label className="modal-label">
                                    Tópico (opcional)
                                    <input
                                        type="text"
                                        className="modal-input"
                                        placeholder="Ex: Logaritmos"
                                        value={novaQuestao.topico}
                                        onChange={e => setNovaQuestao({ ...novaQuestao, topico: e.target.value })}
                                    />
                                </label>
                            </div>

                            <p className="modal-section-title">Alternativas</p>
                            {novaQuestao.opcoes.map((opcao, i) => (
                                <div key={opcao.identificador} className="modal-opcao-row">
                                    <span className={`modal-letra ${novaQuestao.opcaoCorreta === opcao.identificador ? 'letra-correta' : ''}`}>
                                        {opcao.identificador}
                                    </span>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Texto da alternativa ${opcao.identificador}`}
                                        value={opcao.texto}
                                        onChange={e => handleOpcaoChange(i, e.target.value)}
                                    />
                                </div>
                            ))}

                            <label className="modal-label">
                                Resposta correta
                                <select
                                    className="modal-input"
                                    value={novaQuestao.opcaoCorreta}
                                    onChange={e => setNovaQuestao({ ...novaQuestao, opcaoCorreta: e.target.value })}
                                >
                                    {['A', 'B', 'C', 'D', 'E'].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleCriarQuestao} disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Cadastrar Questão'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
