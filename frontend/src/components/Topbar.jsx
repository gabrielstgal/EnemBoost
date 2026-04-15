import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, SignOut, UserCircle, CaretDown } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
    const { usuario, logout } = useAuth();
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const nomeUsuario = usuario?.nome || 'Usuário';
    const emailUsuario = usuario?.email || '';
    const isAdmin = usuario?.papel === 'admin';

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickFora = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFora);
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="topbar">
            <div className="topbar-left"></div>

            <div className="topbar-right">
                <div className="topbar-actions">
                    <Bell />
                    <div className="perfil-container" ref={menuRef}>
                        <button
                            className="perfil-trigger"
                            onClick={() => setMenuAberto(!menuAberto)}
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nomeUsuario)}&background=2563EB&color=fff`}
                                alt={nomeUsuario}
                                className="user-avatar"
                            />
                            <div className="perfil-info">
                                <span className="perfil-nome">{nomeUsuario}</span>
                                <span className={`perfil-badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                                    {isAdmin ? 'Admin' : 'Estudante'}
                                </span>
                            </div>
                            <CaretDown size={14} className={`perfil-caret ${menuAberto ? 'aberto' : ''}`} />
                        </button>

                        {menuAberto && (
                            <div className="perfil-dropdown">
                                <div className="dropdown-header">
                                    <p className="dropdown-nome">{nomeUsuario}</p>
                                    <p className="dropdown-email">{emailUsuario}</p>
                                </div>
                                <div className="dropdown-divider" />
                                <Link to="/desempenho" className="dropdown-item" onClick={() => setMenuAberto(false)}>
                                    <UserCircle size={18} /> Meu Desempenho
                                </Link>
                                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                    <SignOut size={18} /> Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
