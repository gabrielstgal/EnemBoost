import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import connectDB from './src/config/db.js';
import Usuario from './src/models/Usuario.js';

import { typeDefs } from './src/graphql/typeDefs.js';
import { resolvers } from './src/graphql/resolvers.js';


import autenticacaoRoutes from './src/routes/autenticacaoRoutes.js';
import conteudoRoutes from './src/routes/conteudoRoutes.js';
import questaoRoutes from './src/routes/questaoRoutes.js';
import exameRoutes from './src/routes/exameRoutes.js';
import painelRoutes from './src/routes/painelRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import path from 'path';

dotenv.config();

connectDB();

const app = express();


app.use(express.json());


app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', autenticacaoRoutes);
app.use('/api/conteudos', conteudoRoutes);
app.use('/api/questoes', questaoRoutes);
app.use('/api/exames', exameRoutes);
app.use('/api/painel', painelRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
});


const getUsuarioFromToken = async (token) => {
    if (!token) return null;
    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        return await Usuario.findById(decodificado.id).select('-senha');
    } catch (error) {
        return null; 
    }
};


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
     
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

       
        const usuario = await getUsuarioFromToken(token);

        return { usuario };
    }
});

const startServer = async () => {
    await apolloServer.start();

    apolloServer.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`REST API on http://localhost:${PORT}/api`);
        console.log(`GraphQL API on http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
};

startServer();
