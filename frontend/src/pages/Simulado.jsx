import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, CaretRight, DownloadSimple, Clock, Question, CheckCircle } from '@phosphor-icons/react';
import { exameService } from '../services/api';
import './Simulado.css';

export default function Simulado() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [exame, setExame] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    
    // States for exam flow
    const [fase, setFase] = useState('intro'); // 'intro', 'prova', 'resultado'
    const [questaoAtualIdx, setQuestaoAtualIdx] = useState(0);
    const [respostas, setRespostas] = useState({}); // { questaoId: 'A' }
    const [enviando, setEnviando] = useState(false);
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        const carregarExame = async () => {
            try {
                const res = await exameService.obterExamePorId(id);
                setExame(res.dados);
            } catch (err) {
                setErro('Não foi possível carregar o simulado.');
            } finally {
                setCarregando(false);
            }
        };

        carregarExame();
    }, [id]);

    const iniciarProva = () => {
        setFase('prova');
    };

    const selecionarOpcao = (questaoId, identificador) => {
        setRespostas({
            ...respostas,
            [questaoId]: identificador
        });
    };

    const proximaQuestao = () => {
        if (questaoAtualIdx < exame.questoes.length - 1) {
            setQuestaoAtualIdx(questaoAtualIdx + 1);
        }
    };

    const questaoAnterior = () => {
        if (questaoAtualIdx > 0) {
            setQuestaoAtualIdx(questaoAtualIdx - 1);
        }
    };

    const enviarSimulado = async () => {
        setEnviando(true);
        try {
            // Formatar respostas no formato exigido pelo backend
            const respostasArray = Object.keys(respostas).map(qId => ({
                questao: qId,
                opcaoSelecionada: respostas[qId]
            }));

            // notaFinal não é necessária, o backend calcula sozinho de acordo com exameController
            const res = await exameService.enviarTentativa(id, 0, respostasArray);
            setResultado(res.dados);
            setFase('resultado');
        } catch (err) {
            alert('Erro ao enviar o simulado: ' + err.message);
        } finally {
            setEnviando(false);
        }
    };

    const gerarPdfFake = () => {
        alert('Baixando PDF do Simulado: ' + exame.titulo);
        // Na prática, aqui seria implementado um html2pdf ou a entrega de um arquivo estático s3
    };

    if (carregando) return <div className="simulado-container"><h2>Carregando simulado...</h2></div>;
    if (erro) return <div className="simulado-container"><h2 style={{color: 'red'}}>{erro}</h2></div>;
    if (!exame) return <div className="simulado-container"><h2>Simulado não encontrado.</h2></div>;

    const questaoAtual = exame.questoes[questaoAtualIdx];
    const totalRespondidas = Object.keys(respostas).length;
    const progressoProgcentagem = (totalRespondidas / exame.questoes.length) * 100;

    return (
        <div className="simulado-container">
            {fase === 'intro' && (
                <div className="simulado-intro">
                    <button className="btn btn-ghost btn-back" onClick={() => navigate('/praticar')}>
                        <CaretLeft /> Voltar para Simulados
                    </button>
                    
                    <div className="intro-card">
                        <div className="intro-badge">SIMULADO ENCODED</div>
                        <h1>{exame.titulo}</h1>
                        <p>{exame.descricao}</p>
                        
                        <div className="intro-meta">
                            <div className="meta-item">
                                <Question weight="fill" />
                                <div>
                                    <strong>{exame.questoes.length}</strong>
                                    <span>Questões</span>
                                </div>
                            </div>
                            <div className="meta-item">
                                <Clock weight="fill" />
                                <div>
                                    <strong>{exame.questoes.length * 3} min</strong>
                                    <span>Tempo Estimado</span>
                                </div>
                            </div>
                        </div>

                        <div className="intro-actions">
                            <button className="btn btn-primary btn-large" onClick={iniciarProva}>
                                Fazer Simulado Online
                            </button>
                            <button className="btn btn-outline btn-large" onClick={gerarPdfFake}>
                                <DownloadSimple /> Baixar Caderno em PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {fase === 'prova' && questaoAtual && (
                <div className="simulado-prova">
                    <div className="prova-header">
                        <div className="prova-progress-text">
                            Questão {questaoAtualIdx + 1} de {exame.questoes.length}
                        </div>
                        <div className="prova-progress-bar">
                            <div className="prova-progress-fill" style={{ width: `${progressoProgcentagem}%` }}></div>
                        </div>
                    </div>

                    <div className="questao-card">
                        <div className="questao-meta">
                            <span className="badge-matter">{questaoAtual.materia}</span>
                            <span className="badge-topic">{questaoAtual.topico}</span>
                        </div>
                        
                        <div className="questao-texto" dangerouslySetInnerHTML={{ __html: questaoAtual.texto }}></div>
                        
                        <div className="opcoes-lista">
                            {questaoAtual.opcoes && questaoAtual.opcoes.map((opcao) => {
                                const selecionada = respostas[questaoAtual._id] === opcao.identificador;
                                return (
                                    <button 
                                        key={opcao.identificador}
                                        className={`opcao-btn ${selecionada ? 'selecionada' : ''}`}
                                        onClick={() => selecionarOpcao(questaoAtual._id, opcao.identificador)}
                                    >
                                        <div className="opcao-letra">{opcao.identificador}</div>
                                        <div className="opcao-texto">{opcao.texto}</div>
                                    </button>
                                );
                            })}
                            
                            {(!questaoAtual.opcoes || questaoAtual.opcoes.length === 0) && (
                                <div style={{color: 'red', marginTop: '20px'}}>
                                    Atenção: O Administrador cadastrou o título das questões desta prova pelo Painel, mas se esqueceu de registrar as Múltiplas Escolhas (Alternativas A,B,C,D,E)! Portanto, não é possível responder.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prova-footer">
                        <button className="btn btn-outline" onClick={questaoAnterior} disabled={questaoAtualIdx === 0}>
                            Anterior
                        </button>
                        
                        {questaoAtualIdx < exame.questoes.length - 1 ? (
                            <button className="btn btn-primary" onClick={proximaQuestao}>
                                Próxima <CaretRight />
                            </button>
                        ) : (
                            <button 
                                className="btn btn-success" 
                                onClick={enviarSimulado} 
                                disabled={enviando || totalRespondidas < exame.questoes.length}
                            >
                                {enviando ? 'Enviando...' : 'Finalizar Simulado'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {fase === 'resultado' && resultado && (
                <div className="simulado-resultado">
                    <div className="resultado-card">
                        <div className="resultado-icone">
                            <CheckCircle weight="fill" />
                        </div>
                        <h2>Simulado Concluído!</h2>
                        <p>Suas respostas foram enviadas e computadas com sucesso.</p>

                        <div className="resultado-score">
                            <div className="score-valor">{resultado.pontuacao.toFixed(1)}%</div>
                            <div className="score-label">Taxa de Acertos</div>
                        </div>

                        <div className="resultado-stats">
                            <div className="rs-item">
                                <strong>{resultado.respostas.filter(r => r.estaCorreta).length}</strong>
                                <span>Acertos</span>
                            </div>
                            <div className="rs-item">
                                <strong>{resultado.totalQuestoes}</strong>
                                <span>Total</span>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-large" onClick={() => navigate('/dashboard')}>
                            Voltar para o Início
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
