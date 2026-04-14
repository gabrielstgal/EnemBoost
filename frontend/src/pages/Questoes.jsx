import { useState, useEffect } from 'react';
import { questaoService } from '../services/api';
import { Funnel, CheckCircle, XCircle } from '@phosphor-icons/react';
import './Questoes.css';

export default function Questoes() {
    const [questoes, setQuestoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    
    // Filtro ativo
    const [filtroMateria, setFiltroMateria] = useState('');
    
    // Paginação
    const [pagina, setPagina] = useState(1);
    const QUESTOES_POR_PAGINA = 5;

    // Estado das respostas submetidas
    // { questaoId: { selecionada: 'A', estaCorreta: false, corretaReal: 'C' } }
    const [respostas, setRespostas] = useState({});
    
    // Estado temporário de opção selecionada antes de enviar
    const [selecoesTemp, setSelecoesTemp] = useState({});

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

    const questoesExibidas = questoes.slice(0, pagina * QUESTOES_POR_PAGINA);
    const materiasDisponiveis = ['', 'Matemática', 'Linguagens', 'Natureza', 'Humanas', 'Redação'];

    return (
        <div className="container" style={{ maxWidth: '900px', padding: 0 }}>
            <div className="page-header">
                <h1>Banco de Questões</h1>
                <p>Pratique de forma direcionada. Escolha a matéria e responda instantaneamente.</p>
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
        </div>
    );
}
