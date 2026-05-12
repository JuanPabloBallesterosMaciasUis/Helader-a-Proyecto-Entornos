import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nombre: '', pais: '', email: '', telefono: '' };

export default function MarcasPage() {
  const [marcas,  setMarcas]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/marcas');
      setMarcas(data || []);
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = marcas.filter(m =>
    m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    m.pais?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setModal(true); }
  function openEdit(m)  { setForm({ ...m }); setModal(true); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.nombre) { toast('El nombre es obligatorio.', 'error'); return; }
    setSaving(true);
    try {
      if (form.idMarca) {
        await apiFetch('/marcas/' + form.idMarca, { method: 'PUT', body: JSON.stringify(form) });
        toast('Marca actualizada.');
      } else {
        await apiFetch('/marcas', { method: 'POST', body: JSON.stringify(form) });
        toast('Marca creada.');
      }
      setModal(false); load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar la marca "${nombre}"?`)) return;
    try {
      await apiFetch('/marcas/' + id, { method: 'DELETE' });
      toast('Marca eliminada.'); load();
    } catch (e) { toast(e.message, 'error'); }
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">🏷️ Marcas</h2>
          <p className="panel-subtitle">Proveedores y marcas de helados</p>
        </div>
        <button className="btn-teal" onClick={openCreate}>＋ Nueva Marca</button>
      </div>

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input placeholder="Buscar por nombre o país..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>País</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>
                <span className="spinner"/> Cargando...
              </td></tr>
            ) : !filtered.length ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <span className="ei">🏷️</span>
                  <h3>Sin marcas</h3><p>Agrega la primera marca</p>
                </div>
              </td></tr>
            ) : filtered.map(m => (
              <tr key={m.idMarca}>
                <td><code style={{ fontSize:'.7rem', color:'var(--muted)' }}>{m.idMarca?.slice(-6)}</code></td>
                <td className="cell-bold">{m.nombre}</td>
                <td>{m.pais || '—'}</td>
                <td>{m.email || '—'}</td>
                <td>{m.telefono || '—'}</td>
                <td>
                  <div style={{ display:'flex', gap:'.4rem' }}>
                    <button className="btn-sm btn-edit" onClick={() => openEdit(m)}>✏️ Editar</button>
                    <button className="btn-sm btn-delete" onClick={() => handleDelete(m.idMarca, m.nombre)}>🗑️ Borrar</button>
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
              <h2 className="modal-title">{form.idMarca ? 'Editar Marca' : 'Nueva Marca'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Nombre *</label>
                  <input value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej. Crem Helado"/>
                </div>
                <div className="form-field">
                  <label>País</label>
                  <input value={form.pais} onChange={e => setForm(f=>({...f,pais:e.target.value}))} placeholder="Colombia"/>
                </div>
                <div className="form-field">
                  <label>Teléfono</label>
                  <input value={form.telefono} onChange={e => setForm(f=>({...f,telefono:e.target.value}))} placeholder="601 000 0000"/>
                </div>
                <div className="form-field full">
                  <label>Email de contacto</label>
                  <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="contacto@marca.com"/>
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