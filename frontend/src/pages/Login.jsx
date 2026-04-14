import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RocketLaunch, GoogleLogo, Student } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erro ao realizar o login.');
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
                    <h1>Bem-vindo de volta!</h1>
                    <p>Continue sua jornada rumo à aprovação.</p>

                    {error && <div style={{ color: 'white', backgroundColor: '#EF4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: '500' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
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

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Lembrar de mim
                            </label>
                            <Link to="#" className="forgot-password">Esqueceu a senha?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary btn-login">
                            Entrar na plataforma
                        </button>

                        <div className="divider">ou continue com</div>

                        <div className="social-login">
                            <button type="button" className="btn btn-social">
                                <GoogleLogo weight="fill" style={{ color: '#EA4335', fontSize: '20px' }} />
                                Entrar com Google
                            </button>
                        </div>

                        <div className="signup-link">
                            Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se grátis</Link>
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
