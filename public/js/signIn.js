document.getElementById('signInForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = document.getElementById('formMessage');
  message.className = 'message';
  message.textContent = 'Validando datos...';
  const form = new FormData(event.currentTarget);
  try {
    const response = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'No se pudo iniciar sesión');
    sessionStorage.setItem(Auth.TOKEN_KEY, result.token);
    const payload = JSON.parse(decodeURIComponent(atob(result.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
    window.location.assign(payload.roles?.includes('admin') ? '/dashboard/admin' : '/dashboard/user');
  } catch (error) {
    message.textContent = error.message;
  }
});
