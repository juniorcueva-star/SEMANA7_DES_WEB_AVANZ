(async () => {
  if (!Auth.requireSession(['user'])) return;
  const form = document.getElementById('profileForm');
  const message = document.getElementById('formMessage');
  const fields = ['name', 'lastName', 'email', 'phoneNumber', 'birthdate', 'url_profile', 'address'];
  function fill(user) {
    for (const field of fields) {
      const input = form.elements.namedItem(field);
      if (input && user[field]) input.value = field === 'birthdate' ? new Date(user[field]).toISOString().slice(0, 10) : user[field];
    }
    M.updateTextFields();
    document.getElementById('profileName').textContent = `${user.name} ${user.lastName}`;
    document.getElementById('profileRole').textContent = `Rol: ${user.roles.join(', ')}`;
    const birthdate = new Date(user.birthdate);
    let age = new Date().getFullYear() - birthdate.getFullYear();
    const beforeBirthday = new Date().getMonth() < birthdate.getMonth() || (new Date().getMonth() === birthdate.getMonth() && new Date().getDate() < birthdate.getDate());
    if (beforeBirthday) age -= 1;
    document.getElementById('profileAge').textContent = `Edad: ${age} años`;
    if (user.url_profile) document.getElementById('profileImage').src = user.url_profile;
  }
  try {
    const response = await Auth.apiFetch('/api/users/me');
    const user = await response.json();
    if (!response.ok) throw new Error(user.message || 'No se pudo cargar el perfil');
    fill(user);
  } catch (error) { message.textContent = error.message; }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const update = Object.fromEntries(formData.entries());
    delete update.email;
    message.className = 'message';
    message.textContent = 'Guardando cambios...';
    try {
      const response = await Auth.apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify(update) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo actualizar el perfil');
      fill(result);
      message.className = 'message success';
      message.textContent = 'Perfil actualizado correctamente.';
    } catch (error) { message.textContent = error.message; }
  });
})();
