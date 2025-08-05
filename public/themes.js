document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleTheme');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;

  function actualizarIcono() {
    if (themeIcon) {
      themeIcon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
  }

  // Aplicar tema guardado
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }

  actualizarIcono();

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      actualizarIcono();
    });
  }
});
