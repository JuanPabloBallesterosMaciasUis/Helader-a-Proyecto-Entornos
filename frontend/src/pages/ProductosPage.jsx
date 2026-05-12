import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nombre:'', descripcion:'', precio:'', stock:'', presentacion:'Unidad', marca:null, imagen:'' };
const PRESENTACIONES = ['Unidad','Pack x6','Pack x12','Paquete familiar','Litro','Medio litro'];

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [marcas,    setMarcas]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
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

  const filtered = productos.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.marca?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.presentacion?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setModal(true); }
  function openEdit(p) {
    setForm({ ...p, precio: p.precio ?? '', stock: p.stock ?? '', marca: p.marca || null });
    setModal(true);
  }

  function handleImage(e) {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('Imagen mayor a 2MB', 'error'); return; }
    const r = new FileReader();
    r.onload = ev => setForm(f => ({ ...f, imagen: ev.target.result }));
    r.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.nombre) { toast('El nombre es obligatorio.', 'error'); return; }
    setSaving(true);
    const body = {
      ...form,
      precio: parseFloat(form.precio) || 0,
      stock:  parseInt(form.stock)  || 0,
    };
    try {
      if (form.idProducto) {
        await apiFetch('/productos/' + form.idProducto, { method: 'PUT', body: JSON.stringify(body) });
        toast('Producto actualizado.');
      } else {
        await apiFetch('/productos', { method: 'POST', body: JSON.stringify(body) });
        toast('Producto creado.');
      }
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await apiFetch('/productos/' + id, { method: 'DELETE' });
      toast('Producto eliminado.'); load();
    } catch (e) { toast(e.message, 'error'); }
  }

  function stockBadge(s) {
    if (!s || s === 0) return <span className="badge badge-stock-out">Sin stock</span>;
    if (s < 10)        return <span className="badge badge-stock-low">{s} uds.</span>;
    return              <span className="badge badge-stock-ok">{s} uds.</span>;
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">🧊 Productos</h2>
          <p className="panel-subtitle">Administración del catálogo de helados</p>
        </div>
        <button className="btn-teal" onClick={openCreate}>＋ Nuevo Producto</button>
      </div>

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input placeholder="Buscar por nombre, marca o presentación..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Img</th><th>Nombre</th><th>Marca</th><th>Precio</th><th>Stock</th><th>Presentación</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>
                <span className="spinner"/> Cargando...
              </td></tr>
            ) : !filtered.length ? (
              <tr><td colSpan="7">
                <div className="empty-state"><span className="ei">🧊</span><h3>Sin productos</h3></div>
              </td></tr>
            ) : filtered.map(p => (
              <tr key={p.idProducto}>
                <td>
                  {p.imagen
                    ? <img src={p.imagen} alt={p.nombre} style={{ width:40, height:40, borderRadius:6, objectFit:'cover' }}/>
                    : <div style={{ width:40, height:40, borderRadius:6, background:'var(--frost)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>🍦</div>
                  }
                </td>
                <td className="cell-bold">{p.nombre}</td>
                <td>{p.marca?.nombre || '—'}</td>
                <td>{new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(p.precio||0)}</td>
                <td>{stockBadge(p.stock)}</td>
                <td>{p.presentacion || '—'}</td>
                <td>
                  <div style={{ display:'flex', gap:'.4rem' }}>
                    <button className="btn-sm btn-edit" onClick={() => openEdit(p)}>✏️</button>
                    <button className="btn-sm btn-delete" onClick={() => handleDelete(p.idProducto, p.nombre)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{form.idProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                {/* Imagen */}
                <div className="form-field full">
                  <label>Imagen del producto</label>
                  <div onClick={() => document.getElementById('img-input').click()}
                    style={{ border:'2px dashed rgba(15,126,166,.3)', borderRadius:8, padding:'1.5rem', textAlign:'center', cursor:'pointer', background:'rgba(15,126,166,.03)' }}>
                    <input id="img-input" type="file" accept="image/*" style={{ display:'none' }} onChange={handleImage}/>
                    {form.imagen
                      ? <img src={form.imagen} alt="preview" style={{ maxHeight:140, borderRadius:8, objectFit:'cover' }}/>
                      : <><span style={{ fontSize:'2rem', display:'block', marginBottom:'.5rem' }}>📸</span>
                          <p style={{ fontSize:'.85rem', color:'var(--muted)' }}>Haz clic para subir · JPG, PNG · Máx 2MB</p></>
                    }
                  </div>
                </div>

                <div className="form-field full">
                  <label>Nombre *</label>
                  <input value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej. Paleta de Fresa"/>
                </div>
                <div className="form-field">
                  <label>Precio (COP) *</label>
                  <input type="number" value={form.precio} onChange={e => setForm(f=>({...f,precio:e.target.value}))} placeholder="3500" min="0" step="100"/>
                </div>
                <div className="form-field">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} placeholder="100" min="0"/>
                </div>
                <div className="form-field">
                  <label>Presentación</label>
                  <select value={form.presentacion} onChange={e => setForm(f=>({...f,presentacion:e.target.value}))}>
                    {PRESENTACIONES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Marca</label>
                  <select
                    value={form.marca?.idMarca || ''}
                    onChange={e => {
                      const m = marcas.find(x => x.idMarca === e.target.value);
                      setForm(f => ({ ...f, marca: m || null }));
                    }}>
                    <option value="">Sin marca</option>
                    {marcas.map(m => <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>)}
                  </select>
                </div>
                <div className="form-field full">
                  <label>Descripción</label>
                  <textarea value={form.descripcion} onChange={e => setForm(f=>({...f,descripcion:e.target.value}))}
                    placeholder="Describe el producto..." style={{ resize:'vertical', minHeight:80, padding:'.7rem .9rem', border:'1.5px solid rgba(0,0,0,.12)', borderRadius:8, fontFamily:'DM Sans', fontSize:'.9rem', background:'var(--cream)' }}/>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <span className="spinner"/> : '💾 Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}