(async () => {
  if (!Auth.requireSession(['admin'])) return;
  const table = document.getElementById('usersTable');
  const message = document.getElementById('usersMessage');
  try {
    const response = await Auth.apiFetch('/api/users');
    const users = await response.json();
    if (!response.ok) throw new Error(users.message || 'No se pudo cargar la lista');
    message.textContent = users.length ? '' : 'Todavía no hay usuarios registrados.';
    for (const user of users) {
      const row = document.createElement('tr');
      const values = [`${user.name} ${user.lastName}`, user.email, user.phoneNumber, user.roles.join(', '), new Date(user.createdAt).toLocaleDateString('es-PE')];
      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      }
      const action = document.createElement('td');
      const link = document.createElement('a');
      link.className = 'btn-small blue darken-3';
      link.href = `/admin/users/${encodeURIComponent(user.id)}`;
      link.textContent = 'Ver datos';
      action.appendChild(link);
      row.appendChild(action);
      table.appendChild(row);
    }
  } catch (error) { message.textContent = error.message; }
})();
