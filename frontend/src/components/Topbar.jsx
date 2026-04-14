import { Link } from 'react-router-dom';
import { MagnifyingGlass, Bell } from '@phosphor-icons/react';

export default function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="topbar-links">
                    <Link to="/praticar">Simulados</Link>
                    <Link to="/desempenho">Desempenho</Link>
                    <Link to="#">Materiais</Link>
                </div>
            </div>
            
            <div className="topbar-right">
                <div className="search-bar">
                    <MagnifyingGlass />
                    <input type="text" placeholder="Buscar..." />
                </div>
                <div className="topbar-actions">
                    <Bell />
                    <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" className="user-avatar" />
                </div>
            </div>
        </header>
    );
}
