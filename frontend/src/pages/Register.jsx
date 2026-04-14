import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RocketLaunch, GoogleLogo, Student } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Podemos reaproveitar o layout de login

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { registrar } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await registrar(nome, email, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Erro ao realizar o cadastro. Verifique os dados.');
        }
    };

    return (
        <div className="login-layout">
            <div className="login-form-container">
                <Link to="/" className="login-header">
                    <RocketLaunch weight="fill" />
                    EnemBoost
                </Link>

                <div className="login-box">
                    <h1>Crie sua conta!</h1>
                    <p>Inicie sua jornada rumo à aprovação.</p>

                    {error && <div style={{ color: 'white', backgroundColor: '#EF4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: '500' }}>{error}</div>}
                    {success && <div style={{ color: 'white', backgroundColor: '#10B981', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: '500' }}>⭐ Conta criada com sucesso! Redirecionando...</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome Completo</label>
                            <input 
                                type="text" 
                                id="nome" 
                                className="form-control" 
                                placeholder="Seu nome" 
                                required 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control" 
                                placeholder="seu@email.com" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="••••••••" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-login">
                            Cadastrar Grátis
                        </button>

                        <div className="divider">ou cadastre com</div>

                        <div className="social-login">
                            <button type="button" className="btn btn-social">
                                <GoogleLogo weight="fill" style={{ color: '#EA4335', fontSize: '20px' }} />
                                Cadastrar com Google
                            </button>
                        </div>

                        <div className="signup-link">
                            Já tem uma conta? <Link to="/login">Faça Login</Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="login-banner">
                <div className="banner-content">
                    <Student weight="fill" className="banner-icon" />
                    <h2>O seu futuro começa aqui.</h2>
                    <p>Junte-se aos milhares de estudantes que utilizam Inteligência Artificial para otimizar os estudos e garantir a vaga na universidade dos sonhos.</p>
                </div>
            </div>
        </div>
    );
}
