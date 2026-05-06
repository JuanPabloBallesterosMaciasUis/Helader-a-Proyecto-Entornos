import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getUser, getToken, removeToken } from './api';
import LoginPage    from './pages/LoginPage';
import UsuariosPage from './pages/UsuariosPage';

// Protege rutas — si no hay token redirige al login
function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/" replace />;
}

// Layout del dashboard con topbar
function DashboardLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();
  const rol       = (user?.rol || 'CLIENTE').toUpperCase();

  function logout() {
    removeToken();
    navigate('/');
  }

  const navItems = [
    { path:'/dashboard',          label:'🏠 Inicio' },
    { path:'/dashboard/usuarios', label:'👥 Usuarios' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <nav className="topbar">
        <div className="topbar-brand">
          🍦 FrostHub <span className="brand-dot"/>
        </div>
        <div className="topbar-nav">
          {navItems.map(item => (
            <button key={item.path}
              className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="topbar-right">
          <div className="user-chip">
            <div className="user-avatar">{user?.nombre?.[0]?.toUpperCase() || 'U'}</div>
            <span>{user?.nombre?.split(' ')[0] || 'Usuario'}</span>
          </div>
          <span className={`role-badge role-${rol.toLowerCase()}`}>{rol}</span>
          <button className="btn-logout" onClick={logout}>Salir</button>
        </div>
      </nav>

      <div className="dash-body">
        <Routes>
          <Route index element={<HomePage user={user} navigate={navigate}/>}/>
          <Route path="usuarios" element={<UsuariosPage/>}/>
        </Routes>
      </div>
    </div>
  );
}

// Página de inicio del dashboard
function HomePage({ user, navigate }) {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg,var(--dark),var(--mid))',
        borderRadius: 20,
        padding: '3rem',
        color: '#fff',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', right:'2rem', top:'50%', transform:'translateY(-50%)', fontSize:'7rem', opacity:.15 }}>🍦</div>
        <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:'2.2rem', lineHeight:1.2, marginBottom:'.75rem' }}>
          Bienvenido, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋
        </h2>
        <p style={{ color:'rgba(255,255,255,.6)', lineHeight:1.6 }}>
          Plataforma de gestión de helados · Base de datos MongoDB Atlas
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
        <div onClick={() => navigate('/dashboard/usuarios')} style={{
          background:'#fff', borderRadius:14, padding:'1.5rem',
          border:'1px solid rgba(0,0,0,.07)', cursor:'pointer',
          transition:'.22s cubic-bezier(.4,0,.2,1)',
        }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform=''}>
          <span style={{ fontSize:'2rem', display:'block', marginBottom:'.75rem' }}>👥</span>
          <h3 style={{ fontFamily:'Syne', fontWeight:700, marginBottom:'.3rem' }}>Usuarios</h3>
          <p style={{ fontSize:'.8rem', color:'var(--muted)' }}>CRUD completo · MongoDB</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}