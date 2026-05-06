import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nombre:'', email:'', contrasena:'', telefono:'', direccion:'', rol:'CLIENTE' };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const { toast, ToastContainer } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/usuarios');
      setUsuarios(data || []);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setModal(true); }
  function openEdit(u)  {
    setForm({ ...u, contrasena: '' });
    setModal(true);
  }
  function closeModal() { setModal(false); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.nombre || !form.email) { toast('Nombre y email son obligatorios.', 'error'); return; }
    setSaving(true);
    try {
      if (form.id) {
        await apiFetch('/usuarios/' + form.id, { method:'PUT', body: JSON.stringify(form) });
        toast('Usuario actualizado.');
      } else {
        await apiFetch('/usuarios', { method:'POST', body: JSON.stringify(form) });
        toast('Usuario creado.');
      }
      closeModal();
      load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, nombre) {
    if (!confirm(`¿Eliminar a "${nombre}"?`)) return;
    try {
      await apiFetch('/usuarios/' + id, { method:'DELETE' });
      toast('Usuario eliminado.');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  const rolBadge = (rol) => {
    const cls = { ADMIN:'badge-admin', CLIENTE:'badge-cliente', EMPLEADO:'badge-empleado' };
    return <span className={`badge ${cls[rol] || 'badge-cliente'}`}>{rol}</span>;
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">👥 Usuarios</h2>
          <p className="panel-subtitle">Gestión de cuentas del sistema (MongoDB)</p>
        </div>
        <button className="btn-teal" onClick={openCreate}>＋ Nuevo Usuario</button>
      </div>

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input placeholder="Buscar por nombre o email..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Email</th>
              <th>Teléfono</th><th>Dirección</th><th>Rol</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>
                <span className="spinner"/> Cargando...
              </td></tr>
            ) : !filtered.length ? (
              <tr><td colSpan="7">
                <div className="empty-state">
                  <span className="ei">👤</span>
                  <h3>Sin usuarios</h3>
                  <p>Crea el primer usuario</p>
                </div>
              </td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td><code style={{ fontSize:'.7rem', color:'var(--muted)' }}>{u.id?.slice(-6)}</code></td>
                <td className="cell-bold">{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.telefono || '—'}</td>
                <td>{u.direccion || '—'}</td>
                <td>{rolBadge(u.rol)}</td>
                <td>
                  <div style={{ display:'flex', gap:'.4rem' }}>
                    <button className="btn-sm btn-edit" onClick={() => openEdit(u)}>✏️ Editar</button>
                    <button className="btn-sm btn-delete" onClick={() => handleDelete(u.id, u.nombre)}>🗑️ Borrar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{form.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Nombre completo *</label>
                  <input value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} placeholder="Juan Pérez"/>
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="correo@mail.com"/>
                </div>
                <div className="form-field">
                  <label>Contraseña {form.id ? '(dejar vacío = no cambiar)' : '*'}</label>
                  <input type="password" value={form.contrasena} onChange={e => setForm(f=>({...f,contrasena:e.target.value}))} placeholder="••••••••"/>
                </div>
                <div className="form-field">
                  <label>Teléfono</label>
                  <input value={form.telefono} onChange={e => setForm(f=>({...f,telefono:e.target.value}))} placeholder="3001234567"/>
                </div>
                <div className="form-field">
                  <label>Rol</label>
                  <select value={form.rol} onChange={e => setForm(f=>({...f,rol:e.target.value}))}>
                    <option value="CLIENTE">Cliente</option>
                    <option value="EMPLEADO">Empleado</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="form-field full">
                  <label>Dirección</label>
                  <input value={form.direccion} onChange={e => setForm(f=>({...f,direccion:e.target.value}))} placeholder="Calle, Ciudad"/>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <span className="spinner"/> : '💾 Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}