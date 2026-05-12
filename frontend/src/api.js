const API_URL = import.meta.env.VITE_API_URL;

// Utilidades de token
export const saveToken = t =>
  localStorage.setItem('frosthub_token', t);

export const getToken = () =>
  localStorage.getItem('frosthub_token');

export const removeToken = () => {
  localStorage.removeItem('frosthub_token');
  localStorage.removeItem('frosthub_user');
};

export const saveUser = u =>
  localStorage.setItem('frosthub_user', JSON.stringify(u));

export const getUser = () => {
  const s = localStorage.getItem('frosthub_user');
  return s ? JSON.parse(s) : null;
};

// Fetch con JWT automático
export async function apiFetch(path, opts = {}) {

  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  };

  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    ...opts,
    headers
  });

  if (res.status === 401 || res.status === 403) {

    if (path !== '/auth/login') {
      removeToken();
      window.location.href = '/';
    }

    const e = await res.json().catch(() => ({}));

    throw new Error(e.error || 'No autorizado');
  }

  if (!res.ok) {

    const e = await res.json().catch(() => ({
      error: 'Error del servidor'
    }));

    throw new Error(e.error || `Error ${res.status}`);
  }

  if (res.status === 204 || opts.method === 'DELETE') {
    return null;
  }

  return res.json();
}