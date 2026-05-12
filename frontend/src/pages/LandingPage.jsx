import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// URL del backend hardcodeada — funciona en producción sin variables de entorno
const BACKEND = 'https://helader-a-proyecto-entornos.onrender.com';

const fmtCOP = n => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
}).format(n || 0);

// ── Carrusel estable ──────────────────────────────────────────
function Carrusel({ productos }) {
  const [idx, setIdx] = useState(0);
  const pausedRef     = useRef(false);

  // useEffect con array vacío — el timer se maneja con ref, no recrea en cada render
  useEffect(() => {
    if (!productos.length) return;
    const interval = setInterval(() => {
      if (!pausedRef.current) {
        setIdx(i => (i + 1) % productos.length);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [productos.length]); // solo se recrea si cambia el número de productos

  if (!productos.length) return (
    <div style={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,.4)', fontSize: '1rem' }}>
      <span style={{ marginRight: '.5rem' }}>🧊</span> Cargando productos...
    </div>
  );

  const p = productos[idx];

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      style={{ position: 'relative', width: '100%' }}>

      {/* Slide */}
      <div key={p.idProducto}
        style={{ display: 'flex', alignItems: 'center', gap: '3rem', padding: '1.5rem 3rem',
          animation: 'slideInR .4s cubic-bezier(.4,0,.2,1)' }}>

        {/* Imagen */}
        <div style={{ flex: '0 0 300px', height: 300, borderRadius: 20,
          background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          {p.imagen
            ? <img src={p.imagen} alt={p.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}/>
            : <span style={{ fontSize: '6rem' }}>🍦</span>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {p.marca?.nombre && (
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.15)',
              borderRadius: 20, padding: '.3rem .9rem', fontSize: '.75rem', fontWeight: 700,
              color: 'rgba(255,255,255,.9)', textTransform: 'uppercase', letterSpacing: '.1em',
              marginBottom: '.75rem' }}>
              {p.marca.nombre}
            </div>
          )}
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#fff', lineHeight: 1.2,
            marginBottom: '.75rem' }}>
            {p.nombre}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.95rem', lineHeight: 1.6,
            marginBottom: '1.5rem', maxWidth: 380,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden' }}>
            {p.descripcion || 'Delicioso helado artesanal de primera calidad.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem',
              fontWeight: 800, color: '#fff' }}>{fmtCOP(p.precio)}</span>
            {p.presentacion && (
              <span style={{ background: 'rgba(255,255,255,.1)', borderRadius: 8,
                padding: '.3rem .7rem', fontSize: '.8rem', color: 'rgba(255,255,255,.7)' }}>
                {p.presentacion}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón anterior */}
      <button
        onClick={() => setIdx(i => (i - 1 + productos.length) % productos.length)}
        style={{ position: 'absolute', left: 0, top: '45%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.2)', borderRadius: '50%',
          width: 40, height: 40, cursor: 'pointer', color: '#fff', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ‹
      </button>

      {/* Botón siguiente */}
      <button
        onClick={() => setIdx(i => (i + 1) % productos.length)}
        style={{ position: 'absolute', right: 0, top: '45%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.2)', borderRadius: '50%',
          width: 40, height: 40, cursor: 'pointer', color: '#fff', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ›
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.25rem' }}>
        {productos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: 'none',
              cursor: 'pointer', transition: 'width .3s',
              background: i === idx ? '#fff' : 'rgba(255,255,255,.3)', padding: 0 }}/>
        ))}
      </div>
    </div>
  );
}

// ── Tarjeta de producto ───────────────────────────────────────
function ProdCard({ p, onAgregar }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,.07)', transition: '.25s',
      border: '1px solid rgba(0,0,0,.06)', position: 'relative', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,27,42,.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)'; }}>

      {/* Badge marca */}
      {p.marca?.nombre && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'var(--teal)', color: '#fff', borderRadius: 20,
          padding: '.2rem .65rem', fontSize: '.62rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '.06em' }}>
          {p.marca.nombre}
        </div>
      )}

      {/* Imagen */}
      <div style={{ height: 180, background: 'linear-gradient(135deg,var(--frost),var(--ice))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '3.5rem', overflow: 'hidden' }}>
        {p.imagen
          ? <img src={p.imagen} alt={p.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : '🍦'
        }
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--teal)',
          textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem' }}>
          {p.presentacion || 'Unidad'}
        </div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.95rem',
          lineHeight: 1.3, marginBottom: '.5rem', color: 'var(--dark)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.nombre}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.05rem', color: 'var(--teal)' }}>
            {fmtCOP(p.precio)}
          </span>
          <button onClick={() => onAgregar(p)}
            style={{ background: 'linear-gradient(135deg,var(--coral),var(--coral-d))',
              color: '#fff', border: 'none', borderRadius: 8, padding: '.4rem .85rem',
              fontSize: '.75rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif' }}>
            Agregar 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Landing Page principal ────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [marcas,    setMarcas]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const catalogoRef = useRef(null);

  // Una sola carga, sin dependencias que cambien
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [resP, resM] = await Promise.all([
          fetch(`${BACKEND}/api/productos`),
          fetch(`${BACKEND}/api/marcas`),
        ]);
        if (cancelled) return;
        if (resP.ok) setProductos(await resP.json());
        if (resM.ok) setMarcas(await resM.json());
      } catch (e) {
        // Backend no disponible — mostrar vacío sin crashear
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; }; // cleanup evita setState en componente desmontado
  }, []); // ← array vacío: solo se ejecuta UNA vez al montar

  function handleAgregar() {
    navigate('/login');
  }

  const conImagen  = productos.filter(p => p.imagen);
  const carruselPs = conImagen.length >= 3 ? conImagen : productos;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav style={{ background: 'var(--dark)', padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 20px rgba(13,27,42,.4)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'var(--teal)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🍦
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem',
            color: '#fff', letterSpacing: '-.01em' }}>
            FrostHub
          </span>
          <span style={{ width: 8, height: 8, background: 'var(--coral)', borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite' }}/>
        </div>

        <div style={{ flex: 1, maxWidth: 400, margin: '0 2rem',
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,.08)', borderRadius: 24,
          padding: '.45rem 1rem', gap: '.5rem',
          border: '1px solid rgba(255,255,255,.12)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,.5)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Buscar sabores..."
            onClick={() => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })}
            readOnly
            style={{ border: 'none', background: 'transparent', outline: 'none',
              color: '#fff', fontFamily: 'DM Sans', fontSize: '.875rem', flex: 1,
              cursor: 'pointer' }}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <button
            onClick={() => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.8)',
              borderRadius: 8, padding: '.45rem 1rem', fontFamily: 'DM Sans',
              fontSize: '.875rem', fontWeight: 500, cursor: 'pointer' }}>
            Ver catálogo
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background: 'linear-gradient(135deg,var(--teal),var(--teal-d))',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '.45rem 1.2rem', fontFamily: 'Syne, sans-serif',
              fontSize: '.875rem', fontWeight: 700, cursor: 'pointer' }}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── HERO + CARRUSEL ────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,var(--dark) 0%,var(--teal-d) 60%,var(--teal) 100%)',
        padding: '3rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          background: 'rgba(255,255,255,.04)', borderRadius: '50%', filter: 'blur(60px)' }}/>
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 300, height: 300,
          background: 'rgba(245,166,35,.07)', borderRadius: '50%', filter: 'blur(60px)' }}/>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.1)',
              borderRadius: 20, padding: '.35rem 1rem', fontSize: '.78rem', fontWeight: 700,
              color: 'rgba(255,255,255,.8)', textTransform: 'uppercase', letterSpacing: '.1em',
              marginBottom: '1rem' }}>
              ✨ Helados pre-empacados premium
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#fff', lineHeight: 1.15,
              marginBottom: '.75rem' }}>
              El sabor perfecto<br/>
              <span style={{ color: 'rgba(255,220,100,1)' }}>para cada momento</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1rem', maxWidth: 480,
              margin: '0 auto', lineHeight: 1.6 }}>
              Descubre nuestra selección de helados de las mejores marcas.
              Inicia sesión para hacer tu pedido.
            </p>
          </div>

          <Carrusel productos={loading ? [] : carruselPs.slice(0, 10)}/>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center',
            marginTop: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#fff', color: 'var(--teal-d)', border: 'none',
                borderRadius: 12, padding: '.8rem 2rem', fontFamily: 'Syne, sans-serif',
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
              Ver todos los helados →
            </button>
            <button onClick={() => navigate('/login')}
              style={{ background: 'rgba(255,255,255,.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,.25)', borderRadius: 12,
                padding: '.8rem 2rem', fontFamily: 'Syne, sans-serif',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Iniciar sesión para comprar
            </button>
          </div>
        </div>
      </section>

      {/* ── FRANJA DE MARCAS ───────────────────── */}
      {marcas.length > 0 && (
        <section style={{ background: '#fff', padding: '1.25rem 2rem',
          borderBottom: '1px solid rgba(0,0,0,.06)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex',
            alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '.1em', flexShrink: 0 }}>
              Marcas disponibles:
            </span>
            {marcas.map(m => (
              <div key={m.idMarca}
                style={{ background: 'var(--frost)', border: '1px solid var(--ice)',
                  borderRadius: 8, padding: '.4rem 1rem',
                  fontSize: '.85rem', fontWeight: 600, color: 'var(--teal-d)' }}>
                {m.nombre}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── GRID DE PRODUCTOS ──────────────────── */}
      <section ref={catalogoRef}
        style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem',
          marginBottom: '2rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.75rem', color: 'var(--dark)' }}>
            Nuestros helados
          </h2>
          {!loading && (
            <span style={{ color: 'var(--muted)', fontSize: '.875rem' }}>
              {productos.length} productos disponibles
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍦</div>
            Cargando catálogo...
          </div>
        ) : productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧊</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '.5rem' }}>
              Sin productos aún
            </h3>
            <p style={{ fontSize: '.875rem' }}>
              Inicia sesión como admin para agregar productos al catálogo.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
            {productos.slice(0, 12).map(p => (
              <ProdCard key={p.idProducto} p={p} onAgregar={handleAgregar}/>
            ))}
          </div>
        )}

        {productos.length > 12 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={() => navigate('/login')}
              style={{ background: 'linear-gradient(135deg,var(--teal),var(--teal-d))',
                color: '#fff', border: 'none', borderRadius: 12, padding: '.85rem 2.5rem',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', boxShadow: '0 6px 20px rgba(15,126,166,.35)' }}>
              Ver todos los {productos.length} helados →
            </button>
          </div>
        )}
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,.4)',
        padding: '2rem', textAlign: 'center', fontSize: '.85rem' }}>
        <div style={{ marginBottom: '.5rem', fontFamily: 'Syne, sans-serif',
          fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>🍦 FrostHub</div>
        Universidad Industrial de Santander · Proyecto Entornos
      </footer>

      <style>{`
        @keyframes slideInR {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.4); opacity: .7; }
        }
      `}</style>
    </div>
  );
}