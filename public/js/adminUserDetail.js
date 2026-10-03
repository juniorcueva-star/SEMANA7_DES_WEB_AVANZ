(async () => {
  if (!Auth.requireSession(['admin'])) return;
  const message = document.getElementById('detailMessage');
  const container = document.getElementById('userDetails');
  try {
    const userId = window.location.pathname.split('/').filter(Boolean).at(-1);
    const response = await Auth.apiFetch(`/api/users/${encodeURIComponent(userId)}`);
    const user = await response.json();
    if (!response.ok) throw new Error(user.message || 'No se pudo cargar el usuario');
    const values = [
      ['Nombre', `${user.name} ${user.lastName}`], ['Correo', user.email],
      ['Teléfono', user.phoneNumber], ['Nacimiento', new Date(user.birthdate).toLocaleDateString('es-PE')],
      ['Roles', user.roles.join(', ')], ['Dirección', user.address || 'No registrada'],
      ['Foto de perfil', user.url_profile || 'No registrada'], ['Fecha de registro', new Date(user.createdAt).toLocaleString('es-PE')]
    ];
    message.textContent = '';
    for (const [label, value] of values) {
      const item = document.createElement('div');
      item.className = 'detail-item';
      const heading = document.createElement('span');
      heading.textContent = label;
      const content = document.createElement('strong');
      content.textContent = value;
      item.append(heading, content);
      container.appendChild(item);
    }
  } catch (error) { message.textContent = error.message; }
})();
