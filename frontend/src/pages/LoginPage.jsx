import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, saveToken, saveUser } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('login');  // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Login state
  const [email, setEmail]   = useState('');
  const [pass,  setPass]    = useState('');

  // Register state
  const [reg, setReg] = useState({
    nombre: '', telefono: '', direccion: '', email: '', contrasena: ''
  });

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  }

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
      alert('¡Cuenta creada! Ahora inicia sesión.');
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'#F2613F', filter:'blur(80px)', opacity:.2, top:-150, right:-100 }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'#F5A623', filter:'blur(80px)', opacity:.2, bottom:-120, left:-80 }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,.07)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,.15)',
        borderRadius: 24,
        padding: '3rem 2.5rem',
        width: 'min(440px, 92vw)',
        boxShadow: '0 32px 80px rgba(0,0,0,.4)',
      }}>
        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <span style={{ fontSize:'3rem', display:'block', marginBottom:'.5rem', animation:'float 3s ease-in-out infinite' }}>🍦</span>
          <h1 style={{ fontFamily:'Syne', fontWeight:800, fontSize:'2rem', color:'#fff', letterSpacing:'-.02em' }}>FrostHub</h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.875rem', marginTop:'.2rem' }}>Plataforma de Gestión de Helados · UIS</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', background:'rgba(255,255,255,.08)', borderRadius:8, padding:'.3rem' }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{
                flex:1, padding:'.45rem', borderRadius:6, border:'none', cursor:'pointer',
                background: tab===t ? 'rgba(255,255,255,.15)' : 'transparent',
                color: tab===t ? '#fff' : 'rgba(255,255,255,.5)',
                fontFamily:'DM Sans', fontWeight:600, fontSize:'.875rem', transition:'.2s'
              }}>
              {t === 'login' ? '🔐 Iniciar sesión' : '✨ Crear cuenta'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="username"/>
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••" value={pass}
                onChange={e => setPass(e.target.value)} autoComplete="current-password"/>
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner"/> : '🍦 Iniciar sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {[
              { id:'nombre',    label:'Nombre completo',    type:'text',     ph:'Juan Pérez' },
              { id:'telefono',  label:'Teléfono',           type:'text',     ph:'3001234567' },
              { id:'direccion', label:'Dirección',          type:'text',     ph:'Calle 45 #32-10' },
              { id:'email',     label:'Correo electrónico', type:'email',    ph:'correo@ejemplo.com' },
              { id:'contrasena',label:'Contraseña',         type:'password', ph:'••••••••' },
            ].map(f => (
              <div className="field" key={f.id}>
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.ph}
                  value={reg[f.id]}
                  onChange={e => setReg(r => ({ ...r, [f.id]: e.target.value }))}/>
              </div>
            ))}
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ background:'linear-gradient(135deg,#0F7EA6,#085D7D)' }}>
              {loading ? <span className="spinner"/> : '✨ Crear cuenta'}
            </button>
          </form>
        )}

        <div style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.78rem', color:'rgba(255,255,255,.3)' }}>
          Universidad Industrial de Santander · Proyecto Entornos
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}