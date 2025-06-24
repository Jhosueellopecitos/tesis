// script.js

console.log("🟢 Página cargada:", window.location.pathname);

// Registro
const registroForm = document.getElementById('registroForm');
if (registroForm) {
  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const res = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena })
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
    const contrasena = loginForm.querySelector('input[type="password"]').value;

    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
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

// Solicitar permisos de notificaciones
if (window.Notification && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Cargar tareas
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
    item.innerHTML = `
      <span>${t.titulo} - ${new Date(t.fecha_limite).toLocaleDateString()}${t.estado === 'completada' ? ' ✅' : ''}</span>
      <div class="botones-tarea">
        ${t.estado !== 'completada' ? `<button class="completar" data-id="${t._id}" data-titulo="${t.titulo}">✅</button>` : ''}
        <button class="editar" data-id="${t._id}">✏️</button>
        <button class="eliminar" data-id="${t._id}">🗑️</button>
      </div>
    `;
    lista.appendChild(item);
  });

  verificarRecordatorios(tareas);

  // Funcionalidad botones
  document.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (confirm('¿Eliminar esta tarea?')) {
        await fetch(`http://localhost:3000/api/tareas/${id}`, {
          method: 'DELETE'
        });
        cargarTareas();
      }
    });
  });

  document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      console.log("🟡 Editando tarea:", e.target.dataset.id);
      const id = e.target.dataset.id;
      const res = await fetch(`http://localhost:3000/api/tareas/detalle/${id}`);
      const tarea = await res.json();

      document.getElementById('tarea_id').value = tarea._id;
      document.getElementById('titulo').value = tarea.titulo;
      document.getElementById('descripcion').value = tarea.descripcion;

      const localDate = new Date(tarea.fecha_limite);
      const offset = localDate.getTimezoneOffset();
      const localISOString = new Date(localDate.getTime() - offset * 60000).toISOString().slice(0, 16);
      document.getElementById('fecha').value = localISOString;

      document.getElementById('recordatorio').checked = tarea.recordatorio_activado;

      document.getElementById('modalTitulo').textContent = 'Editar tarea';
      document.getElementById('modalTarea').style.display = 'block';
    });
  });

  document.querySelectorAll('.completar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const titulo = e.target.dataset.titulo;
      const usuario_id = localStorage.getItem('usuario_id');
      const timestamp = new Date().toISOString();

      try {
        const res = await fetch(`http://localhost:3000/api/tareas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'completada' })
        });

        if (res.ok) {
          console.log('✅ Tarea marcada como completada');

          // Guardar en el registro local
          let registros = JSON.parse(localStorage.getItem('registroTareas')) || [];
          registros.push({ titulo, fecha: timestamp });
          localStorage.setItem('registroTareas', JSON.stringify(registros));

          cargarTareas();
        } else {
          console.error('❌ Error al actualizar la tarea');
        }
      } catch (err) {
        console.error('Error al enviar la solicitud:', err);
      }
    });
  });
}

// Mostrar registros (reemplaza tareas en menú lateral)
if (window.location.pathname.includes('registro.html')) {
  const contenedor = document.getElementById('registroTareas');
  const registros = JSON.parse(localStorage.getItem('registroTareas')) || [];
  contenedor.innerHTML = '';
  registros.forEach(r => {
    const item = document.createElement('li');
    const fechaLocal = new Date(r.fecha).toLocaleString();
    item.textContent = `${r.titulo} completada el ${fechaLocal}`;
    contenedor.appendChild(item);
  });
}

// Referencias al modal
const modal = document.getElementById('modalTarea');
const modalTitulo = document.getElementById('modalTitulo');
const formModal = document.getElementById('formTarea');
const btnCerrarModal = document.getElementById('cerrarModal');
const btnAbrirModal = document.getElementById('btnNuevaTarea');

window.addEventListener('load', () => {
  document.getElementById('modalTarea').style.display = 'none';
});

// Abrir modal al hacer clic en "+"
if (btnAbrirModal) {
  btnAbrirModal.addEventListener('click', () => {
    console.log("🟡 Botón de nueva tarea presionado");
    modalTitulo.textContent = 'Nueva tarea';
    formModal.reset(); // limpia el formulario
    document.getElementById('tarea_id').value = ''; // asegura que no hay ID de edición
    modal.style.display = 'flex'; // muestra el modal centrado
  });
}




// Cerrar modal al hacer clic en "X"
if (btnCerrarModal) {
  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Enviar formulario (crear o actualizar tarea)
formModal?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tarea_id = document.getElementById('tarea_id').value;
  const tarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    fecha_limite: document.getElementById('fecha').value,
    estado: 'pendiente',
    recordatorio_activado: document.getElementById('recordatorio').checked,
    usuario_id: localStorage.getItem('usuario_id')
  };

  let res;
  if (tarea_id) {
    // Modo edición
    res = await fetch(`http://localhost:3000/api/tareas/${tarea_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea)
    });
  } else {
    // Modo creación
    res = await fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea)
    });
  }

  if (res.ok) {
    modal.style.display = 'none';
    cargarTareas(); // vuelve a cargar la lista de tareas
  } else {
    alert('Error al guardar la tarea');
  }
});



// Cerrar sesión
document.getElementById('cerrarSesion')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
});

// Mostrar nombre en perfil
if (window.location.pathname.includes('perfil.html')) {
  const nombre = localStorage.getItem('nombre');
  document.getElementById('nombreUsuario').textContent = nombre || 'No disponible';
}

// Verificar recordatorios
function verificarRecordatorios(tareas) {
  const ahora = new Date();
  let yaNotificadas = JSON.parse(localStorage.getItem('tareasNotificadas') || '[]');

  tareas.forEach(t => {
    if (t.recordatorio_activado) {
      const fechaTarea = new Date(t.fecha_limite);
      const diferenciaMin = (fechaTarea - ahora) / (1000 * 60);

      if (diferenciaMin >= 0 && diferenciaMin <= 1 && !yaNotificadas.includes(t._id)) {
        if (Notification.permission === 'granted') {
          new Notification(`⏰ Recordatorio: ${t.titulo}`, {
            body: `Tienes esta tarea programada para ahora.`,
            icon: 'icono.png'
          });

          yaNotificadas.push(t._id);
          localStorage.setItem('tareasNotificadas', JSON.stringify(yaNotificadas));
        }
      }
    }
  });
}

// Ejecutar cargarTareas en dashboard
if (window.location.pathname.includes('dashboard.html')) {
  cargarTareas();
  setInterval(cargarTareas, 60000);
}
