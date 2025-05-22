// Registro
const registroForm = document.getElementById('registroForm');
if (registroForm) {
  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    const res = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contraseña })
    });

    const data = await res.json();
    alert('Registro exitoso');
    window.location.href = 'index.html';
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = loginForm.querySelector('input[type="email"]').value;
    const contraseña = loginForm.querySelector('input[type="password"]').value;

        const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña })
    });

    const data = await res.json();

    if (data._id) {
      localStorage.setItem('usuario_id', data._id);
      localStorage.setItem('nombre', data.nombre); 
      window.location.href = 'dashboard.html';
    } else {
      alert(data.mensaje || 'Error en el inicio de sesión');
    }

  });
}
//Dashboard
document.getElementById('btnNuevaTarea')?.addEventListener('click', () => {
  window.location.href = 'task-form.html';
});
async function cargarTareas() {
  const usuario_id = localStorage.getItem('usuario_id');
  if (!usuario_id) {
    alert('Usuario no identificado. Inicia sesión.');
    return;
  }

  const res = await fetch(`http://localhost:3000/api/tareas/${usuario_id}`);
  const tareas = await res.json();

  const lista = document.getElementById('listaTareas');
  lista.innerHTML = '';

  tareas.forEach(t => {
    const item = document.createElement('li');
    item.textContent = `${t.titulo} - ${new Date(t.fecha_limite).toLocaleDateString()}`;
    lista.appendChild(item);
  });
}

if (window.location.pathname.includes('dashboard.html')) {
  cargarTareas();
}
// Crear tarea
const formTarea = document.getElementById('formTarea');
if (formTarea) {
  formTarea.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tarea = {
      titulo: document.getElementById('titulo').value,
      descripcion: document.getElementById('descripcion').value,
      fecha_limite: document.getElementById('fecha').value,
      estado: 'pendiente',
      recordatorio_activado: document.getElementById('recordatorio').checked,
      usuario_id: localStorage.getItem('usuario_id')
    };

    const res = await fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea)
    });

    if (res.ok) {
      alert('Tarea guardada');
      window.location.href = 'dashboard.html';
    }
  });
}

//Boton para cerrar sesion

document.getElementById('cerrarSesion')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
});

//Perfil del usuario

if (window.location.pathname.includes('perfil.html')) {
  const nombre = localStorage.getItem('nombre');
  document.getElementById('nombreUsuario').textContent = nombre || 'No disponible';
}

