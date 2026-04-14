import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Praticar from './pages/Praticar';
import Simulado from './pages/Simulado';
import Questoes from './pages/Questoes';
import Trilhas from './pages/Trilhas';
import Redacao from './pages/Redacao';
import Desempenho from './pages/Desempenho';
import Admin from './pages/Admin';
import Layout from './components/Layout';

// Componente para proteger rotas privadas
function PrivateRoute() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando dados...</div>;

  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/praticar" element={<Praticar />} />
            <Route path="/simulado/:id" element={<Simulado />} />
            <Route path="/questoes" element={<Questoes />} />
            <Route path="/trilhas" element={<Trilhas />} />
            <Route path="/redacao" element={<Redacao />} />
            <Route path="/desempenho" element={<Desempenho />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
