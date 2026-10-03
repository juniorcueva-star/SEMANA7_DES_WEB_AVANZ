document.getElementById('signUpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = document.getElementById('formMessage');
  message.className = 'message';
  message.textContent = 'Creando cuenta...';
  const form = new FormData(event.currentTarget);
  const user = Object.fromEntries(form.entries());
  try {
    const response = await fetch('/api/auth/signUp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'No se pudo crear la cuenta');
    message.className = 'message success';
    message.textContent = 'Cuenta creada. Redirigiendo al inicio de sesión...';
    setTimeout(() => window.location.assign('/signIn'), 1000);
  } catch (error) {
    message.textContent = error.message;
  }
});
