(async () => {
  const session = Auth.requireSession(['user']);
  if (!session) return;
  try {
    const response = await Auth.apiFetch('/api/users/me');
    const user = await response.json();
    if (!response.ok) throw new Error(user.message || 'No se pudo cargar el perfil');
    document.getElementById('welcomeName').textContent = user.name;
  } catch (error) {
    document.getElementById('welcomeName').textContent = error.message;
  }
})();
