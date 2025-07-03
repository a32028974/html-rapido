const url =
  'https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec';

const hoy = new Date();
const dd = String(hoy.getDate()).padStart(2, '0');
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const yy = String(hoy.getFullYear()).slice(-2);
const fechaHoy = `${dd}/${mm}/${yy}`;
document.getElementById('fecha').value = fechaHoy;

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = '';
  mensaje.className = '';

  const formData = new FormData(form);
  const mayusForm = new FormData();

  for (const [key, value] of formData.entries()) {
    mayusForm.append(key, value.toUpperCase());
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: mayusForm,
    });

    const text = await res.text();
    mensaje.textContent = text;
    mensaje.className = text.includes('✅') ? 'ok' : 'error';

    if (text.includes('✅')) {
      form.reset();
      document.getElementById('fecha').value = fechaHoy;
      generarProximoNumeroTrabajo();
    }
  } catch (err) {
    mensaje.textContent = '❌ Error de red o conexión';
    mensaje.className = 'error';
  }
});

document.getElementById('numero_armazon').addEventListener('blur', async () => {
  const num = document.getElementById('numero_armazon').value.trim();
  if (!num) return;
  try {
    const res = await fetch(`${url}?buscarArmazon=${num}`);
    const text = await res.text();
    if (text && !text.includes('ERROR')) {
      document.getElementById('armazon_detalle').value = text;
    }
  } catch (err) {
    console.error('Error buscando armazón', err);
  }
});

document.getElementById('dni').addEventListener('blur', async () => {
  const dni = document.getElementById('dni').value.trim();
  if (!dni) return;
  try {
    const res = await fetch(`${url}?buscarDNI=${dni}`);
    const nombre = await res.text();
    if (nombre && !nombre.includes('ERROR')) {
      document.getElementById('nombre').value = nombre;
    }
  } catch (err) {
    console.error('Error buscando DNI', err);
  }
});

async function generarProximoNumeroTrabajo() {
  try {
    const res = await fetch(`${url}?proximoTrabajo=1`);
    const numero = await res.text();
    document.getElementById('numero_trabajo').value = numero;
  } catch (err) {
    console.error('Error al obtener número de trabajo', err);
  }
}

generarProximoNumeroTrabajo();
