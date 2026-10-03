const TOKEN_KEY = 'jwtToken';
let expiryTimer;

function getTokenPayload(token) {
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(encoded).split('').map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
  } catch {
    return null;
  }
}

function getValidSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp || payload.exp <= Date.now() / 1000) {
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return { token, payload };
}

function requireSession(roles = []) {
  const session = getValidSession();
  if (!session) {
    window.location.replace('/signIn');
    return null;
  }
  if (roles.length && !roles.some((role) => (session.payload.roles || []).includes(role))) {
    window.location.replace('/403');
    return null;
  }
  return session;
}

async function apiFetch(url, options = {}) {
  const session = getValidSession();
  if (!session) {
    window.location.replace('/signIn');
    throw new Error('La sesión terminó. Inicia sesión otra vez.');
  }
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session.token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.replace('/signIn');
    throw new Error('La sesión terminó. Inicia sesión otra vez.');
  }
  return response;
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.M) {
    if (document.querySelectorAll('.sidenav').length) M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.updateTextFields();
  }
  const session = getValidSession();
  document.querySelectorAll('.sign-out').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.assign('/signIn');
  }));
  if (session?.payload.roles?.includes('admin')) {
    document.querySelectorAll('.admin-link').forEach((element) => {
      element.style.display = element.tagName === 'LI' ? 'list-item' : 'block';
    });
  }
  if (session) {
    const remainingMs = Math.max(0, session.payload.exp * 1000 - Date.now());
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(() => {
      sessionStorage.removeItem(TOKEN_KEY);
      window.location.replace('/signIn');
    }, Math.min(remainingMs, 2147483647));
  }
  const protectedPage = document.querySelector('[data-requires-role]');
  if (protectedPage) requireSession([protectedPage.dataset.requiresRole]);
});

window.Auth = { TOKEN_KEY, getValidSession, requireSession, apiFetch };
