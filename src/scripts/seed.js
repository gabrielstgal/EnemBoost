import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import Usuario from '../models/Usuario.js';
import Conteudo from '../models/Conteudo.js';
import Questao from '../models/Questao.js';
import Exame from '../models/Exame.js';

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Conectado para o Seed'))
    .catch((err) => {
        console.error('Falha ao conectar no MongoDB:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        console.log('Iniciando o apagão e reconstrução do Banco de Dados (Mock Data)...');

        
        await Conteudo.deleteMany();
        await Questao.deleteMany();
        await Exame.deleteMany();

        
        const usuarioExistente = await Usuario.findOne();
        if (!usuarioExistente) {
            console.error('Nenhum usuário encontrado! Crie uma conta no site primeiro para executar o Seed.');
            process.exit(1);
        }
        const adminId = usuarioExistente._id;

        console.log(`Usando o usuário ${usuarioExistente.email} como autor.`);

        
        const conteudosInjetados = await Conteudo.insertMany([
            {
                titulo: 'Matemática Básica: Frações e Porcentagem',
                descricao: 'Domine a base da matemática para gabaritar cálculos rápidos no ENEM.',
                corpo: 'A porcentagem é frequentemente usada.... (AQUI FICA TEXTO COMPLETO)',
                materia: 'Matemática',
                usuario: adminId
            },
            {
                titulo: 'Geometria Espacial: Principais Fórmulas',
                descricao: 'Aprenda os segredos para calcular Volume de prismas e cilindros.',
                corpo: 'Volume do cilindro = pi * R² * H...',
                materia: 'Matemática',
                usuario: adminId
            },
            {
                titulo: 'Interpretação de Texto Avançada',
                descricao: 'Como acertar questões sem nem ler o texto principal inteiro.',
                corpo: 'Na prova de Linguagens, foque sempre na fonte do texto e na pergunta raiz...',
                materia: 'Linguagens',
                usuario: adminId
            },
            {
                titulo: 'Química Orgânica I',
                descricao: 'Identificação de Funções Orgânicas clássicas.',
                corpo: 'Lembre-se: Álcool (OH ligado a carbono saturado), Fenol...',
                materia: 'Natureza',
                usuario: adminId
            },
            {
                titulo: 'Revolução Industrial e Impactos',
                descricao: 'Compreenda as fases da revolução e as mudanças no capitalismo.',
                corpo: 'A Primeira Revolução Industrial foi marcada pelo carvão e têxteis...',
                materia: 'Humanas',
                usuario: adminId
            },
            {
                titulo: 'Estrutura da Dissertação Nota 1000',
                descricao: 'Introdução, Desenvolvimento e Conclusão com PIFAGC.',
                corpo: 'Sempre mencione o Agente, Ação, Meio, Efeito e Detalhamento na conclusão.',
                materia: 'Redação',
                usuario: adminId
            }
        ]);
        console.log(`✅ ${conteudosInjetados.length} Conteúdos criados.`);

        
        
        const novasQuestoes = [
            {
                texto: "A Lei de Lavoisier afirma que na natureza, nada se cria, nada se perde, tudo se transforma. Qual princípio essa lei está diretamente descrevendo?",
                opcoes: [
                    { texto: "Conservação das massas", identificador: 'A' },
                    { texto: "Conservação de energia mecânica", identificador: 'B' },
                    { texto: "Proporções definidas de Proust", identificador: 'C' },
                    { texto: "Conservação do momento linear", identificador: 'D' },
                    { texto: "Segunda lei da termodinâmica", identificador: 'E' }
                ],
                opcaoCorreta: 'A', materia: 'Natureza', topico: 'Química', usuario: adminId
            },
            {
                texto: "Durante a Era Vargas, uma das principais características do Estado Novo (1937-1945) foi:",
                opcoes: [
                    { texto: "Abertura democrática e livre associação.", identificador: 'A' },
                    { texto: "Fortalecimento do poder executivo e forte censura (DIP).", identificador: 'B' },
                    { texto: "Descentralização do poder para os governadores.", identificador: 'C' },
                    { texto: "Adoção do neoliberalismo econômico no Brasil.", identificador: 'D' },
                    { texto: "Abolição dos direitos trabalhistas recém-criados.", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Humanas', topico: 'História do Brasil', usuario: adminId
            },
            {
                texto: "No Romantismo brasileiro, a primeira geração (indianista) tinha como principal figura projetada:",
                opcoes: [
                    { texto: "O escravo em busca da abolição urbana.", identificador: 'A' },
                    { texto: "O cidadão urbano angustiado com o tédio.", identificador: 'B' },
                    { texto: "A figura do indígena como o grande herói nacional.", identificador: 'C' },
                    { texto: "O cangaceiro nordestino sobrevivendo às secas.", identificador: 'D' },
                    { texto: "O bandeirante europeu heróico e destemido.", identificador: 'E' }
                ],
                opcaoCorreta: 'C', materia: 'Linguagens', topico: 'Escolas Literárias', usuario: adminId
            },
            {
                texto: "Se log(2) = 0,30, então qual o valor aproximado de log(20)?",
                opcoes: [
                    { texto: "0,60", identificador: 'A' },
                    { texto: "1,30", identificador: 'B' },
                    { texto: "3,00", identificador: 'C' },
                    { texto: "2,30", identificador: 'D' },
                    { texto: "10,30", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Matemática', topico: 'Logaritmos', usuario: adminId
            },
            {
                texto: "Qual o bioma bioma mais devastado do Brasil, restando hoje pouco mais de 12% da sua cobertura original de floresta densa próxima ao litoral?",
                opcoes: [
                    { texto: "Cerrado", identificador: 'A' },
                    { texto: "Mata de Araucárias", identificador: 'B' },
                    { texto: "Caatinga", identificador: 'C' },
                    { texto: "Floresta Amazônica", identificador: 'D' },
                    { texto: "Mata Atlântica", identificador: 'E' }
                ],
                opcaoCorreta: 'E', materia: 'Humanas', topico: 'Geografia do Brasil', usuario: adminId
            },
            {
                texto: "A competência 1 da Redação do ENEM avalia especificamente:",
                opcoes: [
                    { texto: "A proposta de intervenção detalhada.", identificador: 'A' },
                    { texto: "Compreender e desenvolver o tema sem fugir dele.", identificador: 'B' },
                    { texto: "Demonstrar domínio da norma-padrão da língua escrita.", identificador: 'C' },
                    { texto: "Selecionar, organizar e relacionar argumentos em defesa de um ponto.", identificador: 'D' },
                    { texto: "Uso correto de conectivos e coesão textual.", identificador: 'E' }
                ],
                opcaoCorreta: 'C', materia: 'Redação', topico: 'Competências', usuario: adminId
            },
            {
                texto: "A organela celular responsável pela respiração aeróbica e produção de ATP nas células eucarióticas é a:",
                opcoes: [
                    { texto: "Mitocôndria", identificador: 'A' },
                    { texto: "Complexo de Golgi", identificador: 'B' },
                    { texto: "Cloroplasto", identificador: 'C' },
                    { texto: "Retículo endoplasmático rugoso", identificador: 'D' },
                    { texto: "Lisossomos", identificador: 'E' }
                ],
                opcaoCorreta: 'A', materia: 'Natureza', topico: 'Biologia Celular', usuario: adminId
            },
            {
                texto: "Quanto vale a soma das raízes da equação do segundo grau x² - 5x + 6 = 0?",
                opcoes: [
                    { texto: "6", identificador: 'A' },
                    { texto: "-5", identificador: 'B' },
                    { texto: "5", identificador: 'C' },
                    { texto: "-6", identificador: 'D' },
                    { texto: "1", identificador: 'E' }
                ],
                opcaoCorreta: 'C', materia: 'Matemática', topico: 'Equações', usuario: adminId
            },
            {
                texto: "A Guerra Fria caracterizou-se principalmente por:",
                opcoes: [
                    { texto: "Uso extensivo de armas nucleares contra alvos civis.", identificador: 'A' },
                    { texto: "Corrida armamentista e espacial entre EUA e URSS.", identificador: 'B' },
                    { texto: "Paz armada exclusiva na Europa ocidental.", identificador: 'C' },
                    { texto: "Declínio absoluto da influência das superpotências.", identificador: 'D' },
                    { texto: "Colaboração franca do bloco socialista com o capitalista.", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Humanas', topico: 'História Geral', usuario: adminId
            },
            {
                texto: "Determine a velocidade escalar média de um atleta que corre os 100m rasos em 10 segundos (em m/s).",
                opcoes: [
                    { texto: "10 m/s", identificador: 'A' },
                    { texto: "1 m/s", identificador: 'B' },
                    { texto: "100 m/s", identificador: 'C' },
                    { texto: "8 m/s", identificador: 'D' },
                    { texto: "12 m/s", identificador: 'E' }
                ],
                opcaoCorreta: 'A', materia: 'Natureza', topico: 'Física / Cinemática', usuario: adminId
            },
            {
                texto: "O autor de Dom Casmurro que introduziu de forma consolidada o Realismo no Brasil foi:",
                opcoes: [
                    { texto: "Graciliano Ramos", identificador: 'A' },
                    { texto: "Carlos Drummond de Andrade", identificador: 'B' },
                    { texto: "Olavo Bilac", identificador: 'C' },
                    { texto: "José de Alencar", identificador: 'D' },
                    { texto: "Machado de Assis", identificador: 'E' }
                ],
                opcaoCorreta: 'E', materia: 'Linguagens', topico: 'Literatura', usuario: adminId
            },
            {
                texto: "Qual é o menor número primo páreo?",
                opcoes: [
                    { texto: "1", identificador: 'A' },
                    { texto: "2", identificador: 'B' },
                    { texto: "4", identificador: 'C' },
                    { texto: "Inexistente", identificador: 'D' },
                    { texto: "0", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Matemática', topico: 'Aritmética', usuario: adminId
            },
            {
                texto: "A competência 5 do ENEM, uma das mais temidas, requer do candidato:",
                opcoes: [
                    { texto: "O uso perfeito das regras de pontuação.", identificador: 'A' },
                    { texto: "A criação de uma proposta de intervenção social respeitando os direitos humanos.", identificador: 'B' },
                    { texto: "O desenvolvimento amplo do repertório sociocultural sem embasamento de terceiros.", identificador: 'C' },
                    { texto: "O fechamento do texto com uma citação de autor conhecido.", identificador: 'D' },
                    { texto: "Ausência de clichês motivacionais na argumentação da tese central.", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Redação', topico: 'Competências', usuario: adminId
            },
            {
                texto: "Correntes marítimas frias que chegam aos litorais ocidentais de países costumam causar o surgimento de:",
                opcoes: [
                    { texto: "Florestas úmidas intensas com muita chuva.", identificador: 'A' },
                    { texto: "Desertos ou áreas áridas próximas da costa.", identificador: 'B' },
                    { texto: "Cordilheiras e dobramentos geológicos jovens.", identificador: 'C' },
                    { texto: "Vulcões inativos na placa do leito marítimo.", identificador: 'D' },
                    { texto: "Diminuição expressiva da pesca predatória litorânea.", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Humanas', topico: 'Geografia Geral', usuario: adminId
            },
            {
                texto: "As funções inorgânicas principais resumem-se em 4 grandes grupos:",
                opcoes: [
                    { texto: "Ácidos, Bases, Sais e Óxidos", identificador: 'A' },
                    { texto: "Cetonas, Álcoois, Sais e Peróxidos", identificador: 'B' },
                    { texto: "Sais inorgânicos, Proteínas, Ácidos e Aminas", identificador: 'C' },
                    { texto: "Ácidos, Ésteres, Carboidratos e Gases Nobres", identificador: 'D' },
                    { texto: "Bases, Óxidos, Hidrocarbonetos e Aldeídos", identificador: 'E' }
                ],
                opcaoCorreta: 'A', materia: 'Natureza', topico: 'Química', usuario: adminId
            },
            {
                texto: "Numa progressão aritmética onde a razão é 3 e o primeiro termo (a1) é 2, qual será o quinto termo (a5)?",
                opcoes: [
                    { texto: "11", identificador: 'A' },
                    { texto: "14", identificador: 'B' },
                    { texto: "8", identificador: 'C' },
                    { texto: "17", identificador: 'D' },
                    { texto: "5", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Matemática', topico: 'Progressões', usuario: adminId
            },
            {
                texto: "Modernismo - Semana da Arte Moderna (1922) visava fundamentalmente:",
                opcoes: [
                    { texto: "Importar de forma definitiva as normas clássicas portuguesas para o século XX.", identificador: 'A' },
                    { texto: "Retomar o misticismo e a escola parnasiana das métricas poéticas.", identificador: 'B' },
                    { texto: "Abolir o teatro e as artes cênicas do calendário cultural oficial pátrio.", identificador: 'C' },
                    { texto: "Romper com os modelos europeus engessados e criar uma identidade artística genuinamente brasileira.", identificador: 'D' },
                    { texto: "Instaurar protestos radicais apenas de caráter religioso contra as igrejas de Minas.", identificador: 'E' }
                ],
                opcaoCorreta: 'D', materia: 'Linguagens', topico: 'Modernismo Brasileiro', usuario: adminId
            },
            {
                texto: "Ao se misturar luzes no modelo RGB, as três cores primárias sobrepostas formam:",
                opcoes: [
                    { texto: "O Preto (Absorção de todas as cores).", identificador: 'A' },
                    { texto: "O Branco (Junção de todos os espectros visíveis).", identificador: 'B' },
                    { texto: "Um Cinza denso de neutralidade neutra.", identificador: 'C' },
                    { texto: "Uma refração prismática espelhada e infinita.", identificador: 'D' },
                    { texto: "O Marrom esverdeado orgânico de reflexão curta.", identificador: 'E' }
                ],
                opcaoCorreta: 'B', materia: 'Natureza', topico: 'Física / Óptica', usuario: adminId
            },
            {
                texto: "Quem foi o principal pensador do Contrato Social, defendendo que 'o homem nasce bom, mas a sociedade o corrompe'?",
                opcoes: [
                    { texto: "Thomas Hobbes", identificador: 'A' },
                    { texto: "John Locke", identificador: 'B' },
                    { texto: "Immanuel Kant", identificador: 'C' },
                    { texto: "Jean-Jacques Rousseau", identificador: 'D' },
                    { texto: "Aristóteles", identificador: 'E' }
                ],
                opcaoCorreta: 'D', materia: 'Humanas', topico: 'Filosofia', usuario: adminId
            },
            {
                texto: "Em um triângulo retângulo cujos catetos medem 3cm e 4cm, qual a medida da hipotenusa?",
                opcoes: [
                    { texto: "5cm.", identificador: 'A' },
                    { texto: "7cm.", identificador: 'B' },
                    { texto: "6cm.", identificador: 'C' },
                    { texto: "25cm.", identificador: 'D' },
                    { texto: "3,5cm.", identificador: 'E' }
                ],
                opcaoCorreta: 'A', materia: 'Matemática', topico: 'Geometria Plana', usuario: adminId
            }
        ];

        const questoesInjetadas = await Questao.insertMany([
            {
                texto: 'Uma loja vende um produto por R$ 100,00 com 20% de desconto. Qual o valor final?',
                opcoes: [
                    { texto: 'R$ 80,00', identificador: 'A' },
                    { texto: 'R$ 120,00', identificador: 'B' },
                    { texto: 'R$ 90,00', identificador: 'C' },
                    { texto: 'R$ 85,00', identificador: 'D' },
                    { texto: 'R$ 75,00', identificador: 'E' }
                ],
                opcaoCorreta: 'A',
                materia: 'Matemática',
                topico: 'Porcentagem',
                usuario: adminId
            },
            {
                texto: 'Em qual das reações abaixo formamos um Éster?',
                opcoes: [
                    { texto: 'Ácido carboxílico + Álcool', identificador: 'A' },
                    { texto: 'Álcool + Aldeído', identificador: 'B' },
                    { texto: 'Fenol + Cetona', identificador: 'C' },
                    { texto: 'Amina + Amida', identificador: 'D' },
                    { texto: 'Hidrocarboneto + Oxigênio', identificador: 'E' }
                ],
                opcaoCorreta: 'A',
                materia: 'Natureza',
                topico: 'Esterificação',
                usuario: adminId
            },
            {
                texto: 'Identifique a figura de linguagem na frase: "A cidade respira aliviada."',
                opcoes: [
                    { texto: 'Eufeumismo', identificador: 'A' },
                    { texto: 'Metonímia', identificador: 'B' },
                    { texto: 'Pleonasmo', identificador: 'C' },
                    { texto: 'Prosopopeia/Personificação', identificador: 'D' },
                    { texto: 'Hipérbole', identificador: 'E' }
                ],
                opcaoCorreta: 'D',
                materia: 'Linguagens',
                topico: 'Figuras de Linguagem',
                usuario: adminId
            },
            ...novasQuestoes,
        ]);
        console.log(`✅ ${questoesInjetadas.length} Questões criadas.`);

        
        const idQuestoes = questoesInjetadas.map(q => q._id);

        await Exame.create({
            titulo: 'Simulado Diagnóstico Nacional',
            descricao: 'Um simulado rápido para testar seus conhecimentos nas principais áreas estratégicas do ENEM.',
            questoes: [idQuestoes[0], idQuestoes[1], idQuestoes[2]], 
            usuario: adminId
        });

        await Exame.create({
            titulo: 'Teste Rápido de Matemática e Física',
            descricao: 'Focado apenas em exatas para testar resistência nos cálculos longos.',
            questoes: [idQuestoes[0]],
            usuario: adminId
        });
        
        console.log(`✅ 2 Simulados criados.`);
        console.log('\nSeed finalizado com EXCELÊNCIA! Você já pode acessar as rotas do frontend.');
        process.exit();
        
    } catch (err) {
        console.error('Erro no Seed:', err);
        process.exit(1);
    }
};

seedData();
