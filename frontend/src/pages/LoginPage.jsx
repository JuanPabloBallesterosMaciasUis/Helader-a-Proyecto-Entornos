import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, saveToken, saveUser, getToken } from '../api';

// Redirige al panel correcto según el rol
function getRedirect(rol) {
  switch ((rol || '').toUpperCase()) {
    case 'ADMIN':    return '/dashboard/usuarios';
    case 'EMPLEADO': return '/dashboard/pedidos';
    default:         return '/dashboard/catalogo';
  }
}

export default function LoginPage() {
  const navigate = useNavigate();

  // Si ya hay sesión activa, redirigir directamente
  if (getToken()) {
    const user = JSON.parse(localStorage.getItem('frosthub_user') || '{}');
    navigate(getRedirect(user?.rol), { replace: true });
    return null;
  }

  const [tab,     setTab]     = useState('login');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');

  const [reg, setReg] = useState({
    nombre: '', telefono: '', direccion: '', email: '', contrasena: ''
  });

  // ── LOGIN ─────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !pass) { setError('Completa todos los campos.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, contrasena: pass }),
      });
      saveToken(data.token);
      saveUser(data.usuario);

      // Redirigir según el rol recibido del backend
      navigate(getRedirect(data.usuario?.rol), { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  }

  // ── REGISTRO ──────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    const { nombre, telefono, direccion, email: rEmail, contrasena } = reg;
    if (!nombre || !telefono || !direccion || !rEmail || !contrasena) {
      setError('Todos los campos son obligatorios.'); return;
    }
    setLoading(true); setError('');
    try {
      await apiFetch('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ ...reg, rol: 'CLIENTE' }),
      });
      setTab('login');
      setEmail(reg.email);
      setError('');
      alert('¡Cuenta creada exitosamente! Ahora inicia sesión.');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0D1B2A 0%,#085D7D 55%,#0F7EA6 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: '#F2613F', filter: 'blur(80px)', opacity: .18,
        top: -150, right: -100, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: '#F5A623', filter: 'blur(80px)', opacity: .18,
        bottom: -120, left: -80, pointerEvents: 'none' }}/>

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,.15)', borderRadius: 24,
        padding: '3rem 2.5rem', width: 'min(440px, 92vw)',
        boxShadow: '0 32px 80px rgba(0,0,0,.4)',
        animation: 'slideUp .5s cubic-bezier(.4,0,.2,1) both',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '.5rem',
            animation: 'float 3s ease-in-out infinite' }}>🍦</span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '2rem', color: '#fff', letterSpacing: '-.02em' }}>
            FrostHub
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.875rem', marginTop: '.2rem' }}>
            Plataforma de Gestión de Helados · UIS
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '.35rem', marginBottom: '1.5rem',
          background: 'rgba(255,255,255,.07)', borderRadius: 8, padding: '.3rem' }}>
          {[
            { id: 'login',    label: '🔐 Iniciar sesión' },
            { id: 'register', label: '✨ Crear cuenta'   },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setError(''); }}
              style={{ flex: 1, padding: '.45rem', borderRadius: 6, border: 'none',
                cursor: 'pointer', transition: '.2s', fontFamily: 'DM Sans',
                fontWeight: 600, fontSize: '.875rem',
                background: tab === t.id ? 'rgba(255,255,255,.15)' : 'transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,.5)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(242,97,63,.2)', border: '1px solid rgba(242,97,63,.4)',
            color: '#ffb09a', borderRadius: 8, padding: '.75rem 1rem',
            fontSize: '.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Formulario login */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            {[
              { id: 'email', label: 'Correo electrónico', type: 'email',    val: email, set: setEmail, ph: 'correo@ejemplo.com', ac: 'username' },
              { id: 'pass',  label: 'Contraseña',         type: 'password', val: pass,  set: setPass,  ph: '••••••••',           ac: 'current-password' },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 600,
                  color: 'rgba(255,255,255,.6)', textTransform: 'uppercase',
                  letterSpacing: '.08em', marginBottom: '.4rem' }}>
                  {f.label}
                </label>
                <input type={f.type} placeholder={f.ph} value={f.val}
                  autoComplete={f.ac}
                  onChange={e => f.set(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,.08)',
                    border: '1.5px solid rgba(255,255,255,.18)', borderRadius: 8,
                    padding: '.8rem 1rem', color: '#fff', fontFamily: 'DM Sans',
                    fontSize: '.95rem', outline: 'none' }}/>
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '.9rem',
                background: 'linear-gradient(135deg,var(--coral,#F2613F),var(--coral-d,#D44E2F))',
                color: '#fff', border: 'none', borderRadius: 8,
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .6 : 1, marginTop: '.5rem' }}>
              {loading ? 'Verificando...' : '🍦 Iniciar sesión'}
            </button>
          </form>
        )}

        {/* Formulario registro */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            {[
              { key: 'nombre',     label: 'Nombre completo',    type: 'text',     ph: 'Juan Pérez'          },
              { key: 'telefono',   label: 'Teléfono',           type: 'text',     ph: '3001234567'          },
              { key: 'direccion',  label: 'Dirección',          type: 'text',     ph: 'Calle 45 #32-10'     },
              { key: 'email',      label: 'Correo electrónico', type: 'email',    ph: 'correo@ejemplo.com'  },
              { key: 'contrasena', label: 'Contraseña',         type: 'password', ph: '••••••••'            },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '.85rem' }}>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 600,
                  color: 'rgba(255,255,255,.6)', textTransform: 'uppercase',
                  letterSpacing: '.08em', marginBottom: '.35rem' }}>
                  {f.label}
                </label>
                <input type={f.type} placeholder={f.ph} value={reg[f.key]}
                  onChange={e => setReg(r => ({ ...r, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,.08)',
                    border: '1.5px solid rgba(255,255,255,.18)', borderRadius: 8,
                    padding: '.75rem 1rem', color: '#fff', fontFamily: 'DM Sans',
                    fontSize: '.9rem', outline: 'none' }}/>
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '.9rem',
                background: 'linear-gradient(135deg,var(--teal,#0F7EA6),var(--teal-d,#085D7D))',
                color: '#fff', border: 'none', borderRadius: 8,
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .6 : 1, marginTop: '.25rem' }}>
              {loading ? 'Creando cuenta...' : '✨ Crear cuenta'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem',
          fontSize: '.78rem', color: 'rgba(255,255,255,.3)' }}>
          Universidad Industrial de Santander · Proyecto Entornos
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
      `}</style>
    </div>
  );
}