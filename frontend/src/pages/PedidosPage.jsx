import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getUser } from '../api';
import { useToast } from '../hooks/useToast';

const fmtCOP  = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n||0);
const fmtDate = d => d ? new Date(d).toLocaleString('es-CO',{dateStyle:'short',timeStyle:'short'}) : '—';

const ESTADOS = ['PENDIENTE','CONFIRMADO','ENVIADO','LISTO_PARA_ENTREGAR'];
const BADGE_COLORS = {
  PENDIENTE:           { bg:'rgba(245,166,35,.15)',  color:'#92600a' },
  CONFIRMADO:          { bg:'rgba(15,126,166,.15)',   color:'#085D7D' },
  ENVIADO:             { bg:'rgba(123,45,139,.15)',   color:'#5b1d6b' },
  LISTO_PARA_ENTREGAR: { bg:'rgba(22,163,74,.15)',    color:'#15803d' },
};

function EstadoBadge({ estado }) {
  const s = estado?.toUpperCase() || 'PENDIENTE';
  const c = BADGE_COLORS[s] || BADGE_COLORS.PENDIENTE;
  return (
    <span style={{ padding:'.2rem .65rem', borderRadius:20, fontSize:'.72rem', fontWeight:600, background:c.bg, color:c.color }}>
      {s.replace(/_/g,' ')}
    </span>
  );
}

// Vista para EMPLEADO y ADMIN
function GestionPedidos() {
  const [pedidos,  setPedidos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('PENDIENTE');
  const [detalle,  setDetalle]  = useState(null);      // pedido seleccionado
  const [items,    setItems]    = useState([]);
  const [loadingD, setLoadingD] = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = tab === 'TODOS' ? '/pedidos' : '/pedidos/estado/' + tab;
      setPedidos(await apiFetch(url) || []);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  async function verDetalle(pedido) {
    setDetalle(pedido); setLoadingD(true); setItems([]);
    try {
      const d = await apiFetch('/detalles-pedidos/pedido/' + pedido.idPedido);
      setItems(d || []);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoadingD(false); }
  }

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await apiFetch('/pedidos/' + id + '/estado', { method:'PATCH', body: JSON.stringify({ estado: nuevoEstado }) });
      toast('Estado actualizado a ' + nuevoEstado.replace(/_/g,' '));
      setDetalle(null); load();
    } catch (e) { toast(e.message, 'error'); }
  }

  const tabs = ['PENDIENTE','CONFIRMADO','ENVIADO','LISTO_PARA_ENTREGAR','TODOS'];

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">📋 Gestión de Pedidos</h2>
          <p className="panel-subtitle">Actualiza el estado de los pedidos de los clientes</p>
        </div>
        <button className="btn-teal" onClick={load} style={{ background:'linear-gradient(135deg,#16a34a,#15803d)' }}>↺ Actualizar</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'.35rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'.45rem 1rem', borderRadius:6, border:'none', cursor:'pointer',
              background: tab===t ? 'var(--dark)' : '#fff',
              color: tab===t ? '#fff' : 'var(--muted)',
              fontFamily:'DM Sans', fontWeight:500, fontSize:'.8rem',
              boxShadow: tab===t ? 'none' : '0 1px 4px rgba(0,0,0,.08)' }}>
            {t.replace(/_/g,' ')}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Dirección entrega</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}><span className="spinner"/> Cargando...</td></tr>
            ) : !pedidos.length ? (
              <tr><td colSpan="7"><div className="empty-state"><span className="ei">📋</span><h3>Sin pedidos</h3></div></td></tr>
            ) : pedidos.map(p => (
              <tr key={p.idPedido}>
                <td><code style={{ fontSize:'.7rem' }}>#{p.idPedido?.slice(-6)}</code></td>
                <td className="cell-bold">{p.usuario?.nombre || '—'}</td>
                <td>{p.direccionEntrega || '—'}</td>
                <td style={{ fontSize:'.8rem' }}>{fmtDate(p.fechaPedido)}</td>
                <td>{fmtCOP(p.total)}</td>
                <td><EstadoBadge estado={p.estado}/></td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => verDetalle(p)}>👁️ Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal detalle + cambio estado */}
      {detalle && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setDetalle(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Pedido #{detalle.idPedido?.slice(-6)}</h2>
              <button className="modal-close" onClick={() => setDetalle(null)}>✕</button>
            </div>

            {/* Info */}
            {[
              ['👤 Cliente',   detalle.usuario?.nombre],
              ['📧 Email',     detalle.usuario?.email],
              ['📍 Dirección', detalle.direccionEntrega || detalle.usuario?.direccion],
              ['📅 Fecha',     fmtDate(detalle.fechaPedido)],
            ].map(([label, val]) => (
              <div key={label} style={{ display:'flex', gap:'.5rem', padding:'.5rem .9rem', borderRadius:8, background:'rgba(15,126,166,.07)', marginBottom:'.4rem', fontSize:'.85rem' }}>
                <strong style={{ color:'var(--teal)', flexShrink:0 }}>{label}:</strong> {val || '—'}
              </div>
            ))}

            {/* Items */}
            <div style={{ margin:'1rem 0' }}>
              {loadingD ? <div style={{ textAlign:'center', padding:'1rem', color:'var(--muted)' }}><span className="spinner"/></div>
              : items.map((d, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'.6rem .9rem', background:'var(--cream)', borderRadius:8, marginBottom:'.4rem', fontSize:'.875rem', gap:'.5rem' }}>
                  <span style={{ fontWeight:600, flex:1 }}>{d.producto?.nombre || 'Producto'}</span>
                  <span style={{ color:'var(--muted)', fontSize:'.8rem' }}>x{d.cantidad}</span>
                  <span style={{ fontWeight:700 }}>{fmtCOP(d.subtotal)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'.75rem .9rem', background:'var(--dark)', borderRadius:8, color:'#fff', fontWeight:700, marginTop:'.5rem' }}>
                <span>Total</span><span>{fmtCOP(detalle.total)}</span>
              </div>
            </div>

            {/* Estado actual */}
            <div style={{ marginBottom:'1rem' }}>
              <p style={{ fontSize:'.78rem', fontWeight:600, color:'var(--mid)', textTransform:'uppercase', marginBottom:'.5rem' }}>Estado actual</p>
              <EstadoBadge estado={detalle.estado}/>
            </div>

            {/* Botones de cambio de estado */}
            <p style={{ fontSize:'.78rem', fontWeight:600, color:'var(--mid)', textTransform:'uppercase', marginBottom:'.5rem' }}>Cambiar estado a:</p>
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
              {ESTADOS.filter(e => e !== detalle.estado?.toUpperCase()).map(e => (
                <button key={e} onClick={() => cambiarEstado(detalle.idPedido, e)}
                  style={{ padding:'.45rem 1rem', borderRadius:6, border:'none', cursor:'pointer',
                    background: e==='LISTO_PARA_ENTREGAR' ? 'var(--green)' : e==='ENVIADO' ? 'var(--berry)' : e==='CONFIRMADO' ? 'var(--teal)' : 'var(--gold)',
                    color:'#fff', fontFamily:'Syne', fontWeight:600, fontSize:'.8rem' }}>
                  {e.replace(/_/g,' ')}
                </button>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}

// Vista para CLIENTE — mis pedidos
function MisPedidos() {
  const user = getUser();
  const [pedidos,  setPedidos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [abierto,  setAbierto]  = useState(null);
  const [items,    setItems]    = useState({});
  const { toast, ToastContainer } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPedidos(await apiFetch('/pedidos/usuario/' + user.id) || []);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleDetalle(idPedido) {
    if (abierto === idPedido) { setAbierto(null); return; }
    setAbierto(idPedido);
    if (!items[idPedido]) {
      try {
        const d = await apiFetch('/detalles-pedidos/pedido/' + idPedido);
        setItems(prev => ({ ...prev, [idPedido]: d || [] }));
      } catch (e) {}
    }
  }

  const despachados = pedidos.filter(p => p.estado?.toUpperCase() === 'LISTO_PARA_ENTREGAR');

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">📦 Mis Pedidos</h2>
          <p className="panel-subtitle">Historial y estado de tus compras</p>
        </div>
        <button className="btn-teal" onClick={load} style={{ background:'linear-gradient(135deg,#16a34a,#15803d)' }}>↺ Actualizar</button>
      </div>

      {/* Banner listo para entregar */}
      {despachados.length > 0 && (
        <div style={{ background:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', border:'1px solid #a5d6a7',
          borderRadius:14, padding:'1.5rem 2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1.25rem' }}>
          <span style={{ fontSize:'2.5rem', animation:'bounce .8s ease infinite alternate' }}>🚚</span>
          <div>
            <h3 style={{ fontFamily:'Syne', fontWeight:700, color:'#1b5e20', marginBottom:'.3rem' }}>
              ¡Tu pedido está listo para entregar!
            </h3>
            <p style={{ fontSize:'.875rem', color:'#2e7d32' }}>
              Dirección: <strong>{despachados[0].direccionEntrega || user?.direccion || '—'}</strong>
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}><span className="spinner"/> Cargando...</div>
      ) : !pedidos.length ? (
        <div className="empty-state"><span className="ei">📦</span><h3>Sin pedidos</h3><p>¡Explora el catálogo y haz tu primer pedido!</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {pedidos.map(p => {
            const estado = p.estado?.toUpperCase() || 'PENDIENTE';
            const colorBorde = estado==='LISTO_PARA_ENTREGAR' ? 'var(--green)' : estado==='ENVIADO' ? 'var(--berry)' : estado==='CONFIRMADO' ? 'var(--teal)' : 'var(--gold)';
            return (
              <div key={p.idPedido} style={{ background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,.07)', borderLeft:`4px solid ${colorBorde}`, overflow:'hidden' }}>
                <div onClick={() => toggleDetalle(p.idPedido)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', cursor:'pointer', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:'1rem' }}>Pedido #{p.idPedido?.slice(-6)}</div>
                    <div style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:'.15rem' }}>📅 {fmtDate(p.fechaPedido)}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                    <EstadoBadge estado={p.estado}/>
                    <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:'1.1rem' }}>{fmtCOP(p.total)}</span>
                    <span style={{ color:'var(--muted)', fontSize:'1.2rem' }}>{abierto===p.idPedido ? '▴' : '▾'}</span>
                  </div>
                </div>

                {abierto === p.idPedido && (
                  <div style={{ padding:'0 1.5rem 1.25rem', borderTop:'1px solid rgba(0,0,0,.06)', paddingTop:'1rem' }}>
                    {estado === 'LISTO_PARA_ENTREGAR' && (
                      <div style={{ background:'rgba(22,163,74,.08)', border:'1px solid rgba(22,163,74,.2)', borderRadius:8, padding:'.75rem 1rem', marginBottom:'.75rem', fontSize:'.875rem', color:'#15803d' }}>
                        🚚 <strong>¡Listo para entregar!</strong> Tu pedido llegará a: <strong>{p.direccionEntrega || user?.direccion}</strong>
                      </div>
                    )}
                    <div style={{ padding:'.75rem 1rem', background:'rgba(15,126,166,.07)', borderRadius:8, fontSize:'.85rem', marginBottom:'.75rem' }}>
                      <strong style={{ color:'var(--teal)' }}>📍 Dirección:</strong> {p.direccionEntrega || user?.direccion || 'No especificada'}
                    </div>
                    {(items[p.idPedido] || []).map((d, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.5rem 0', borderBottom:'1px solid rgba(0,0,0,.05)', fontSize:'.875rem' }}>
                        <div style={{ width:36, height:36, borderRadius:6, background:'var(--frost)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', overflow:'hidden', flexShrink:0 }}>
                          {d.producto?.imagen ? <img src={d.producto.imagen} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '🍦'}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600 }}>{d.producto?.nombre || 'Producto'}</div>
                        </div>
                        <div style={{ color:'var(--muted)' }}>x{d.cantidad}</div>
                        <div style={{ fontWeight:700 }}>{fmtCOP(d.subtotal)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ToastContainer/>
      <style>{`@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

export default function PedidosPage() {
  const user = getUser();
  const rol  = (user?.rol || 'CLIENTE').toUpperCase();
  return rol === 'CLIENTE' ? <MisPedidos/> : <GestionPedidos/>;
}