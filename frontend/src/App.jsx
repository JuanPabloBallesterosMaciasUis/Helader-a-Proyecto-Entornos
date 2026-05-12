import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getUser, getToken, removeToken } from './api';
import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import UsuariosPage  from './pages/UsuariosPage';
import MarcasPage    from './pages/MarcasPage';
import ProductosPage from './pages/ProductosPage';
import CatalogoPage  from './pages/CatalogoPage';
import PedidosPage   from './pages/PedidosPage';

// ── Redirige al panel correcto según el rol ───────────────────
export function redirectByRole(rol) {
  switch ((rol || '').toUpperCase()) {
    case 'ADMIN':    return '/dashboard/usuarios';
    case 'EMPLEADO': return '/dashboard/pedidos';
    default:         return '/dashboard/catalogo';   // CLIENTE
  }
}

// ── Ruta protegida ────────────────────────────────────────────
function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace/>;
}

// ── Menú según rol ────────────────────────────────────────────
function getNavItems(rol) {
  if (rol === 'ADMIN') return [
    { path: '/dashboard',           label: '🏠 Inicio'    },
    { path: '/dashboard/usuarios',  label: '👥 Usuarios'  },
    { path: '/dashboard/marcas',    label: '🏷️ Marcas'    },
    { path: '/dashboard/productos', label: '🧊 Productos' },
    { path: '/dashboard/pedidos',   label: '📊 Pedidos'   },
  ];
  if (rol === 'EMPLEADO') return [
    { path: '/dashboard',           label: '🏠 Inicio'    },
    { path: '/dashboard/productos', label: '🧊 Inventario'},
    { path: '/dashboard/pedidos',   label: '📋 Pedidos'   },
  ];
  return [
    { path: '/dashboard',           label: '🏠 Inicio'     },
    { path: '/dashboard/catalogo',  label: '🍦 Catálogo'   },
    { path: '/dashboard/pedidos',   label: '📦 Mis Pedidos' },
  ];
}

// ── Tarjeta de acceso rápido ──────────────────────────────────
function QuickCard({ icon, title, desc, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background: '#fff', borderRadius: 14, padding: '1.5rem',
        border: '1px solid rgba(0,0,0,.07)', cursor: 'pointer', transition: '.22s' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--teal)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,.07)';
        e.currentTarget.style.boxShadow = '';
      }}>
      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '.75rem' }}>{icon}</span>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700,
        fontSize: '1rem', marginBottom: '.3rem', color: 'var(--dark)' }}>{title}</h3>
      <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{desc}</p>
    </div>
  );
}

// ── Home del dashboard ────────────────────────────────────────
function HomePage({ user, rol, navigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,var(--dark),var(--mid))',
        borderRadius: 20, padding: '3rem', color: '#fff', marginBottom: '2rem',
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '2rem', top: '50%',
          transform: 'translateY(-50%)', fontSize: '7rem', opacity: .12 }}>🍦</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.5rem,4vw,2.2rem)', lineHeight: 1.2, marginBottom: '.75rem' }}>
          Bienvenido, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,.6)', lineHeight: 1.6, maxWidth: 500 }}>
          {rol === 'ADMIN'    && 'Administra usuarios, marcas, productos y pedidos desde aquí.'}
          {rol === 'EMPLEADO' && 'Consulta el inventario y gestiona los pedidos de los clientes.'}
          {rol === 'CLIENTE'  && 'Explora nuestro catálogo de helados y realiza tus pedidos.'}
        </p>
      </div>

      {/* Cards rápidas */}
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '1rem' }}>
        {rol === 'ADMIN' && <>
          <QuickCard icon="👥" title="Usuarios"  desc="Crear y gestionar cuentas"  onClick={() => navigate('/dashboard/usuarios')}/>
          <QuickCard icon="🏷️" title="Marcas"    desc="Gestionar proveedores"      onClick={() => navigate('/dashboard/marcas')}/>
          <QuickCard icon="🧊" title="Productos" desc="Catálogo e inventario"      onClick={() => navigate('/dashboard/productos')}/>
          <QuickCard icon="📊" title="Pedidos"   desc="Todas las órdenes"          onClick={() => navigate('/dashboard/pedidos')}/>
        </>}
        {rol === 'EMPLEADO' && <>
          <QuickCard icon="📋" title="Gestionar Pedidos" desc="Confirmar y despachar órdenes" onClick={() => navigate('/dashboard/pedidos')}/>
          <QuickCard icon="🧊" title="Ver Inventario"    desc="Consulta disponibilidad"       onClick={() => navigate('/dashboard/productos')}/>
        </>}
        {rol === 'CLIENTE' && <>
          <QuickCard icon="🍦" title="Ver Catálogo"    desc="Explorar y comprar helados"  onClick={() => navigate('/dashboard/catalogo')}/>
          <QuickCard icon="📦" title="Mis Pedidos"     desc="Estado de tus compras"        onClick={() => navigate('/dashboard/pedidos')}/>
        </>}
      </div>
    </div>
  );
}

// ── Layout del dashboard (topbar + contenido) ─────────────────
function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = getUser();
  const rol      = (user?.rol || 'CLIENTE').toUpperCase();
  const items    = getNavItems(rol);

  function logout() { removeToken(); navigate('/'); }

  const rolStyle = {
    ADMIN:    { background: 'rgba(123,45,139,.25)', color: '#c47fd4' },
    EMPLEADO: { background: 'rgba(245,166,35,.25)', color: '#f5a623' },
    CLIENTE:  { background: 'rgba(15,126,166,.25)', color: '#7dd3f0' },
  }[rol] || {};

  function isActive(path) {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',
      background: 'var(--cream)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* TOPBAR */}
      <nav style={{ background: 'var(--dark)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'center',
        padding: '0 2rem', height: 64, gap: '1rem',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,.25)' }}>

        {/* Brand */}
        <div onClick={() => navigate('/')}
          style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem',
            color: '#fff', display: 'flex', alignItems: 'center', gap: '.5rem',
            cursor: 'pointer' }}>
          🍦 FrostHub
          <span style={{ width: 8, height: 8, background: 'var(--coral)',
            borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }}/>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', gap: '.2rem', marginLeft: '2rem',
          flex: 1, flexWrap: 'wrap' }}>
          {items.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ padding: '.45rem 1rem', borderRadius: 6, border: 'none',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                fontSize: '.875rem', fontWeight: 500, transition: '.2s',
                background: isActive(item.path) ? 'rgba(242,97,63,.18)' : 'transparent',
                color: isActive(item.path) ? 'var(--coral)' : 'rgba(255,255,255,.5)' }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Usuario + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginLeft: 'auto' }}>
          <div style={{ background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.1)', borderRadius: 20,
            padding: '.35rem .9rem .35rem .5rem',
            display: 'flex', alignItems: 'center', gap: '.5rem',
            fontSize: '.8rem', color: 'rgba(255,255,255,.75)' }}>
            <div style={{ width: 28, height: 28,
              background: 'linear-gradient(135deg,var(--teal),var(--berry))',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '.7rem', color: '#fff' }}>
              {user?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            {user?.nombre?.split(' ')[0] || 'Usuario'}
          </div>

          <span style={{ padding: '.2rem .7rem', borderRadius: 20, fontSize: '.68rem',
            fontWeight: 800, textTransform: 'uppercase', ...rolStyle }}>
            {rol}
          </span>

          <button onClick={logout}
            style={{ background: 'rgba(242,97,63,.15)',
              border: '1px solid rgba(242,97,63,.3)', color: 'var(--coral)',
              borderRadius: 6, padding: '.4rem .9rem', fontSize: '.8rem',
              fontFamily: 'DM Sans', cursor: 'pointer', transition: '.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,97,63,.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(242,97,63,.15)'}>
            Salir
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div style={{ flex: 1, padding: '2rem',
        maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route index element={<HomePage user={user} rol={rol} navigate={navigate}/>}/>
          <Route path="usuarios"  element={<UsuariosPage/>}/>
          <Route path="marcas"    element={<MarcasPage/>}/>
          <Route path="productos" element={<ProductosPage/>}/>
          <Route path="catalogo"  element={<CatalogoPage/>}/>
          <Route path="pedidos"   element={<PedidosPage/>}/>
        </Routes>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.4); opacity:.7; }
        }
      `}</style>
    </div>
  );
}

// ── Rutas de la aplicación ────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"      element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* Protegidas */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout/>
          </ProtectedRoute>
        }/>

        {/* Cualquier otra → inicio */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}