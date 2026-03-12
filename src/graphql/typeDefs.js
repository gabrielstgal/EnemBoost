import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Usuario {
    id: ID!
    nome: String!
    email: String!
    papel: String!
  }

  type Conteudo {
    id: ID!
    titulo: String!
    descricao: String!
    corpo: String!
    materia: String!
    usuario: Usuario
  }

  type Opcao {
    texto: String!
    identificador: String!
  }

  type Questao {
    id: ID!
    texto: String!
    opcoes: [Opcao!]!
    opcaoCorreta: String!
    materia: String!
    topico: String
    usuario: Usuario
  }

  type Exame {
    id: ID!
    titulo: String!
    descricao: String
    questoes: [Questao!]!
    usuario: Usuario
  }

  type AuthData {
    _id: ID!
    nome: String!
    email: String!
    papel: String!
    token: String!
  }

  type RespostaTentativa {
    questao: ID!
    opcaoSelecionada: String!
    estaCorreta: Boolean
  }

  type Tentativa {
    id: ID!
    usuario: Usuario!
    exame: Exame!
    respostas: [RespostaTentativa!]!
    pontuacao: Float!
    totalQuestoes: Int!
  }

  type DesempenhoMateria {
    materia: String!
    totalTentativas: Int!
    respostasCorretas: Int!
    precisao: Float!
  }

  type EstatisticasPainel {
    totalExamesRealizados: Int!
    pontuacaoMedia: Float!
    tentativasRecentes: [Tentativa!]! # Poderia otimizar e retornar um subset
    desempenhoPorMateria: [DesempenhoMateria!]!
  }

 
  input RespostaInput {
    questao: ID!
    opcaoSelecionada: String!
  }

  type Query {
    # Autenticacao
    obterEu: Usuario

    # Conteudos
    obterConteudos(materia: String): [Conteudo!]!
    obterConteudo(id: ID!): Conteudo

   
    obterExames: [Exame!]!
    obterExame(id: ID!): Exame

    # Painel
    obterEstatisticasPainel: EstatisticasPainel
  }

  type Mutation {
    
    criarConteudo(titulo: String!, descricao: String!, corpo: String!, materia: String!): Conteudo

    
    enviarTentativa(exameId: ID!, respostas: [RespostaInput!]!): Tentativa
  }
`;
