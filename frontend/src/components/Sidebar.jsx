import { Link, useLocation } from 'react-router-dom';
import { RocketLaunch, SquaresFour, Exam, MapTrifold, PencilLine, ChartLineUp, Gear, SignOut } from '@phosphor-icons/react';

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <Link to="/" className="sidebar-logo">
                <RocketLaunch weight="fill" />
                EnemBoost
            </Link>
            
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <SquaresFour /> Dashboard
                </Link>
                <Link to="/praticar" className={`sidebar-link ${location.pathname === '/praticar' ? 'active' : ''}`}>
                    <Exam /> Simulados
                </Link>
                <Link to="/questoes" className={`sidebar-link ${location.pathname === '/questoes' ? 'active' : ''}`}>
                    <Exam /> Banco de Questões
                </Link>
                <Link to="/trilhas" className={`sidebar-link ${location.pathname === '/trilhas' ? 'active' : ''}`}>
                    <MapTrifold /> Trilhas de Estudo
                </Link>
                <Link to="/redacao" className={`sidebar-link ${location.pathname === '/redacao' ? 'active' : ''}`}>
                    <PencilLine /> Redação
                </Link>
                <Link to="/desempenho" className={`sidebar-link ${location.pathname === '/desempenho' ? 'active' : ''}`}>
                    <ChartLineUp /> Desempenho
                </Link>
            </nav>

            <div className="sidebar-bottom">
                <Link to="#" className="sidebar-link">
                    <Gear /> Configurações
                </Link>
                <Link to="/login" className="sidebar-link">
                    <SignOut /> Sair
                </Link>
            </div>
        </aside>
    );
}
