import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        // Tentar revalidar o login caso já tenha um token ao abrir a aba
        const revalidarSessao = async () => {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined') {
                try {
                    const response = await authService.obterEu();
                    setUsuario(response.dados);
                } catch (error) {
                    console.error("Sessão expirada ou erro no token:", error.message);
                    localStorage.removeItem('token');
                }
            }
            setCarregando(false);
        };
        
        revalidarSessao();
    }, []);

    const login = async (email, senha) => {
        const res = await authService.login(email, senha);
        localStorage.setItem('token', res.dados.token);
        setUsuario(res.dados);
        return res;
    };

    const registrar = async (nome, email, senha) => {
        const res = await authService.registrar(nome, email, senha);
        localStorage.setItem('token', res.dados.token);
        setUsuario(res.dados);
        return res;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, registrar, logout, carregando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
