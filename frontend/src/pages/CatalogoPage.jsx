import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch, getUser } from '../api';
import { useToast } from '../hooks/useToast';

const fmtCOP = n => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
}).format(n || 0);

const PRESENTACIONES = ['Unidad','Pack x6','Pack x12','Paquete familiar','Litro','Medio litro'];

// ── Sidebar de filtros ────────────────────────────────────────
function Sidebar({ marcas, filtros, setFiltros, precioMax }) {
  function toggleMarca(id) {
    setFiltros(f => ({
      ...f,
      marcas: f.marcas.includes(id) ? f.marcas.filter(m => m !== id) : [...f.marcas, id]
    }));
  }
  function togglePresentacion(p) {
    setFiltros(f => ({
      ...f,
      presentaciones: f.presentaciones.includes(p)
        ? f.presentaciones.filter(x => x !== p)
        : [...f.presentaciones, p]
    }));
  }

  const Sección = ({ title, icon, children }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem',
        marginBottom: '.75rem', paddingBottom: '.5rem', borderBottom: '1px solid rgba(0,0,0,.08)' }}>
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase',
          letterSpacing: '.08em', color: '#555' }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <aside style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 16,
      padding: '1.5rem', border: '1px solid rgba(0,0,0,.07)',
      boxShadow: '0 2px 12px rgba(0,0,0,.05)', alignSelf: 'flex-start',
      position: 'sticky', top: 80 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: '1.1rem', color: '#1a1a1a' }}>FILTROS</span>
        <button onClick={() => setFiltros({ marcas:[], presentaciones:[], precioMin:'', precioMax:'' })}
          style={{ fontSize: '.72rem', color: '#c0392b', background: 'none', border: 'none',
            cursor: 'pointer', fontWeight: 600 }}>Limpiar</button>
      </div>

      {/* Marcas */}
      <Sección title="Marcas" icon="🏷️">
        {marcas.map(m => (
          <label key={m.idMarca} style={{ display: 'flex', alignItems: 'center', gap: '.6rem',
            marginBottom: '.55rem', cursor: 'pointer', fontSize: '.875rem', color: '#444' }}>
            <input type="checkbox" checked={filtros.marcas.includes(m.idMarca)}
              onChange={() => toggleMarca(m.idMarca)}
              style={{ accentColor: '#c0392b', width: 15, height: 15, flexShrink: 0 }}/>
            {m.nombre}
          </label>
        ))}
      </Sección>

      {/* Precio */}
      <Sección title="Precio" icon="💰">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="number" placeholder="Mín" value={filtros.precioMin}
            onChange={e => setFiltros(f => ({ ...f, precioMin: e.target.value }))}
            style={{ width: '100%', padding: '.45rem .6rem', border: '1.5px solid rgba(0,0,0,.12)',
              borderRadius: 8, fontSize: '.8rem', outline: 'none', fontFamily: "'DM Sans'" }}/>
          <span style={{ color: '#aaa', flexShrink: 0 }}>–</span>
          <input type="number" placeholder="Máx" value={filtros.precioMax}
            onChange={e => setFiltros(f => ({ ...f, precioMax: e.target.value }))}
            style={{ width: '100%', padding: '.45rem .6rem', border: '1.5px solid rgba(0,0,0,.12)',
              borderRadius: 8, fontSize: '.8rem', outline: 'none', fontFamily: "'DM Sans'" }}/>
        </div>
        {/* Slider de precio */}
        <input type="range" min="0" max={precioMax} value={filtros.precioMax || precioMax}
          onChange={e => setFiltros(f => ({ ...f, precioMax: e.target.value }))}
          style={{ width: '100%', marginTop: '.75rem', accentColor: '#c0392b' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: '#aaa', marginTop: '.25rem' }}>
          <span>$0</span><span>{fmtCOP(precioMax)}</span>
        </div>
      </Sección>

      {/* Presentación */}
      <Sección title="Presentación" icon="📦">
        {PRESENTACIONES.map(p => (
          <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '.6rem',
            marginBottom: '.55rem', cursor: 'pointer', fontSize: '.875rem', color: '#444' }}>
            <input type="checkbox" checked={filtros.presentaciones.includes(p)}
              onChange={() => togglePresentacion(p)}
              style={{ accentColor: '#c0392b', width: 15, height: 15, flexShrink: 0 }}/>
            {p}
          </label>
        ))}
      </Sección>
    </aside>
  );
}

// ── Tarjeta producto ──────────────────────────────────────────
function ProdCard({ p, onAgregar, enCarrito }) {
  const sinStock = !p.stock || p.stock <= 0;

  return (
    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,.06)', transition: '.25s',
      border: `1.5px solid ${enCarrito ? '#c0392b' : 'rgba(0,0,0,.06)'}`,
      position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; }}>

      {/* Badge marca */}
      {p.marca?.nombre && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: '#c0392b', color: '#fff', borderRadius: 20, padding: '.2rem .65rem',
          fontSize: '.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>
          {p.marca.nombre}
        </div>
      )}

      {/* Badge en carrito */}
      {enCarrito && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2,
          background: '#27ae60', color: '#fff', borderRadius: 20, padding: '.2rem .65rem',
          fontSize: '.62rem', fontWeight: 800 }}>
          ✓ En carrito
        </div>
      )}

      {/* Imagen */}
      <div style={{ height: 190, background: 'linear-gradient(135deg,#fff5f5,#ffe4e4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '4rem', overflow: 'hidden' }}>
        {p.imagen
          ? <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : '🍦'
        }
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#c0392b',
          textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem' }}>
          {p.presentacion || 'Unidad'}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: '.95rem', lineHeight: 1.3, marginBottom: '.4rem', color: '#1a1a1a',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.nombre}
        </h3>
        {p.descripcion && (
          <p style={{ fontSize: '.75rem', color: '#888', lineHeight: 1.5, marginBottom: '.6rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.descripcion}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: '1.1rem', color: '#c0392b' }}>
            {fmtCOP(p.precio)}
          </span>
          <button onClick={() => onAgregar(p)} disabled={sinStock}
            style={{ background: sinStock ? '#eee' : '#c0392b', color: sinStock ? '#aaa' : '#fff',
              border: 'none', borderRadius: 10, padding: '.42rem .85rem',
              fontSize: '.75rem', fontWeight: 700, cursor: sinStock ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '.3rem', transition: '.2s',
              fontFamily: "'DM Sans'" }}
            onMouseEnter={e => !sinStock && (e.currentTarget.style.background = '#a93226')}
            onMouseLeave={e => !sinStock && (e.currentTarget.style.background = '#c0392b')}>
            {sinStock ? 'Sin stock' : 'Agregar 🛒'}
          </button>
        </div>

        {/* Stock indicator */}
        {!sinStock && p.stock < 10 && (
          <div style={{ marginTop: '.5rem', fontSize: '.68rem', color: '#e67e22', fontWeight: 600 }}>
            ⚠️ Últimas {p.stock} unidades
          </div>
        )}
      </div>
    </div>
  );
}

// ── Carrito drawer ────────────────────────────────────────────
function CarritoDrawer({ cart, setCart, onCheckout, checking }) {
  const total = cart.reduce((a, i) => a + i.precio * i.qty, 0);

  function changeQty(id, d) {
    setCart(c => c.map(i => i.idProducto === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  }

  return (
    <div style={{ flex: '0 0 320px', background: '#fff', borderRadius: 16,
      border: '1px solid rgba(0,0,0,.07)', boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      display: 'flex', flexDirection: 'column', alignSelf: 'flex-start',
      position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)' }}>

      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,.07)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: '1.1rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          🛒 Tu carrito
          {cart.length > 0 && (
            <span style={{ background: '#c0392b', color: '#fff', borderRadius: '50%',
              width: 20, height: 20, fontSize: '.65rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cart.reduce((a, i) => a + i.qty, 0)}
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
        {!cart.length ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#bbb' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🛒</div>
            <p style={{ fontSize: '.85rem' }}>Tu carrito está vacío</p>
          </div>
        ) : cart.map(item => (
          <div key={item.idProducto} style={{ display: 'flex', gap: '.75rem',
            alignItems: 'center', paddingBottom: '.85rem', marginBottom: '.85rem',
            borderBottom: '1px solid rgba(0,0,0,.06)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden',
              background: '#fff5f5', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {item.imagen ? <img src={item.imagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : '🍦'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '.82rem', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.nombre}
              </div>
              <div style={{ fontSize: '.72rem', color: '#c0392b', fontWeight: 700, textTransform: 'uppercase' }}>
                {item.marca?.nombre}
              </div>
              <div style={{ fontSize: '.75rem', color: '#888', marginTop: '.15rem' }}>
                {fmtCOP(item.precio)} c/u
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <button onClick={() => changeQty(item.idProducto, -1)}
                  style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,.15)',
                    background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.85rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontWeight: 700, fontSize: '.9rem', minWidth: '1.2rem', textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => changeQty(item.idProducto, 1)}
                  style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,.15)',
                    background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.85rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>＋</button>
              </div>
              <div style={{ fontWeight: 800, fontSize: '.82rem', color: '#c0392b' }}>{fmtCOP(item.precio * item.qty)}</div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,.07)', background: '#fafafa', borderRadius: '0 0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
            <span style={{ fontWeight: 600, color: '#555', fontSize: '.875rem' }}>Total</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
              fontSize: '1.2rem', color: '#c0392b' }}>{fmtCOP(total)}</span>
          </div>
          <button onClick={onCheckout} disabled={checking}
            style={{ width: '100%', padding: '.8rem', background: '#c0392b', color: '#fff',
              border: 'none', borderRadius: 12, fontFamily: "'DM Sans'", fontWeight: 800,
              fontSize: '.95rem', cursor: 'pointer', transition: '.2s',
              opacity: checking ? .6 : 1 }}
            onMouseEnter={e => !checking && (e.currentTarget.style.background = '#a93226')}
            onMouseLeave={e => !checking && (e.currentTarget.style.background = '#c0392b')}>
            {checking ? 'Procesando...' : 'Confirmar pedido →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Página principal del catálogo ─────────────────────────────
export default function CatalogoPage() {
  const user  = getUser();
  const [productos,  setProductos]  = useState([]);
  const [marcas,     setMarcas]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [ordenar,    setOrdenar]    = useState('default');
  const [cart,       setCart]       = useState([]);
  const [checking,   setChecking]   = useState(false);
  const [pedidoOk,   setPedidoOk]   = useState(null);
  const [direccion,  setDireccion]  = useState(user?.direccion || '');
  const [showDir,    setShowDir]    = useState(false);
  const [filtros, setFiltros] = useState({ marcas: [], presentaciones: [], precioMin: '', precioMax: '' });
  const { toast, ToastContainer } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([apiFetch('/productos'), apiFetch('/marcas')]);
      setProductos(p || []); setMarcas(m || []);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Precio máximo para el slider
  const precioMax = Math.max(...productos.map(p => p.precio || 0), 100000);

  // Filtrado
  let filtered = productos.filter(p => {
    if (filtros.marcas.length && !filtros.marcas.includes(p.marca?.idMarca)) return false;
    if (filtros.presentaciones.length && !filtros.presentaciones.includes(p.presentacion)) return false;
    if (filtros.precioMin && (p.precio || 0) < parseFloat(filtros.precioMin)) return false;
    if (filtros.precioMax && (p.precio || 0) > parseFloat(filtros.precioMax)) return false;
    if (search && !p.nombre?.toLowerCase().includes(search.toLowerCase()) &&
        !p.descripcion?.toLowerCase().includes(search.toLowerCase()) &&
        !p.marca?.nombre?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Ordenar
  if (ordenar === 'precio-asc')  filtered = [...filtered].sort((a, b) => (a.precio||0) - (b.precio||0));
  if (ordenar === 'precio-desc') filtered = [...filtered].sort((a, b) => (b.precio||0) - (a.precio||0));
  if (ordenar === 'nombre')      filtered = [...filtered].sort((a, b) => a.nombre?.localeCompare(b.nombre));

  // Carrito
  function addToCart(p) {
    setCart(c => {
      const ex = c.find(i => i.idProducto === p.idProducto);
      if (ex) {
        if (ex.qty >= p.stock) { toast('Stock máximo alcanzado', 'error'); return c; }
        return c.map(i => i.idProducto === p.idProducto ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...c, { ...p, qty: 1 }];
    });
    toast(`"${p.nombre}" agregado 🛒`);
  }

  async function handleCheckout() {
    if (!cart.length) return;
    if (!showDir) { setShowDir(true); return; }
    if (!direccion.trim()) { toast('Ingresa una dirección de entrega', 'error'); return; }
    setChecking(true);
    try {
      const total = cart.reduce((a, i) => a + i.precio * i.qty, 0);
      const pedido = await apiFetch('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, direccion: user.direccion },
          estado: 'PENDIENTE',
          direccionEntrega: direccion,
          total,
          fechaPedido: new Date().toISOString(),
        }),
      });
      await Promise.all(cart.map(item =>
        apiFetch('/detalles-pedidos', {
          method: 'POST',
          body: JSON.stringify({
            pedido: { idPedido: pedido.idPedido },
            producto: { idProducto: item.idProducto, nombre: item.nombre, precio: item.precio },
            cantidad: item.qty,
            precioUnitario: item.precio,
            subtotal: item.precio * item.qty,
          }),
        }).catch(() => {})
      ));
      setPedidoOk(pedido);
      setCart([]);
      setShowDir(false);
      toast('¡Pedido confirmado! 🍦', 'success');
    } catch (e) { toast(e.message, 'error'); }
    finally { setChecking(false); }
  }

  const activeFilters = filtros.marcas.length + filtros.presentaciones.length +
    (filtros.precioMin ? 1 : 0) + (filtros.precioMax ? 1 : 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,.07)', padding: '1.25rem 2rem',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="panel-title" style={{ fontFamily: "'Playfair Display', serif", marginRight: 'auto' }}>
          🍦 Catálogo de Helados
        </div>

        {/* Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem',
          background: '#f5f5f5', borderRadius: 24, padding: '.5rem 1rem', minWidth: 260 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Buscar sabores, marcas..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none',
              fontFamily: "'DM Sans'", fontSize: '.9rem', flex: 1 }}/>
        </div>

        {/* Ordenar */}
        <select value={ordenar} onChange={e => setOrdenar(e.target.value)}
          style={{ padding: '.5rem .9rem', border: '1.5px solid rgba(0,0,0,.12)', borderRadius: 10,
            fontFamily: "'DM Sans'", fontSize: '.875rem', outline: 'none', background: '#fff' }}>
          <option value="default">Ordenar por</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A–Z</option>
        </select>

        <span style={{ color: '#888', fontSize: '.85rem' }}>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          {activeFilters > 0 && <span style={{ marginLeft: '.5rem', background: '#c0392b', color: '#fff',
            borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '.65rem', fontWeight: 800 }}>{activeFilters}</span>}
        </span>
      </div>

      {/* ── Banner pedido ok ── */}
      {pedidoOk && (
        <div style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', borderBottom: '1px solid #a5d6a7',
          padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🚚</span>
          <div>
            <strong style={{ color: '#1b5e20' }}>¡Pedido confirmado!</strong>
            <span style={{ color: '#2e7d32', fontSize: '.875rem', marginLeft: '.5rem' }}>
              Será entregado en: <strong>{pedidoOk.direccionEntrega}</strong>
            </span>
          </div>
          <button onClick={() => setPedidoOk(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', fontSize: '1.2rem' }}>✕</button>
        </div>
      )}

      {/* ── Layout principal ── */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem', alignItems: 'flex-start', maxWidth: 1400, margin: '0 auto' }}>

        {/* Sidebar */}
        <Sidebar marcas={marcas} filtros={filtros} setFiltros={setFiltros} precioMax={precioMax}/>

        {/* Productos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧊</div>
              Cargando catálogo...
            </div>
          ) : !filtered.length ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '.5rem', color: '#555' }}>Sin resultados</h3>
              <p style={{ fontSize: '.875rem' }}>Prueba con otros filtros o busca otro término</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' }}>
              {filtered.map(p => (
                <ProdCard key={p.idProducto} p={p} onAgregar={addToCart}
                  enCarrito={cart.some(i => i.idProducto === p.idProducto)}/>
              ))}
            </div>
          )}
        </div>

        {/* Carrito sticky */}
        <div>
          <CarritoDrawer cart={cart} setCart={setCart} onCheckout={handleCheckout} checking={checking}/>

          {/* Dirección de entrega */}
          {showDir && (
            <div style={{ marginTop: '1rem', background: '#fff', borderRadius: 12,
              padding: '1rem', border: '1px solid rgba(0,0,0,.08)' }}>
              <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700,
                color: '#555', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>
                📍 Dirección de entrega
              </label>
              <input value={direccion} onChange={e => setDireccion(e.target.value)}
                placeholder="Calle 45 #32-10, Bucaramanga"
                style={{ width: '100%', padding: '.65rem .9rem', border: '1.5px solid rgba(0,0,0,.12)',
                  borderRadius: 8, fontFamily: "'DM Sans'", fontSize: '.875rem', outline: 'none',
                  marginBottom: '.75rem' }}/>
              <button onClick={handleCheckout} disabled={checking}
                style={{ width: '100%', padding: '.75rem', background: '#c0392b', color: '#fff',
                  border: 'none', borderRadius: 10, fontFamily: "'DM Sans'", fontWeight: 800,
                  fontSize: '.9rem', cursor: 'pointer' }}>
                {checking ? 'Procesando...' : 'Confirmar pedido 🍦'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer/>
    </div>
  );
}