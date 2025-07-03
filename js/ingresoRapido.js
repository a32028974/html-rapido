const url = 'https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec';

const hoy = new Date();
const dd = String(hoy.getDate()).padStart(2, '0');
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const yy = String(hoy.getFullYear()).slice(-2);
const fechaHoy = `${dd}/${mm}/${yy}`;
document.getElementById('fecha').value = fechaHoy;

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');

const precioCristal = document.getElementById('precio_cristal');
const precioArmazon = document.getElementById('precio_armazon');
const total = document.getElementById('total');
const sena = document.getElementById('sena');
const saldo = document.getElementById('saldo');

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
      body: mayusForm
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

// Buscar armazón
const numeroArmazon = document.getElementById('numero_armazon');
numeroArmazon.addEventListener('blur', async () => {
  const num = numeroArmazon.value.trim();
  if (!num) return;

  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarArmazon=${num}`);
    const text = await res.text();
    if (text && !text.includes("ERROR")) {
      document.getElementById('armazon_detalle').value = text;
    }
  } catch (err) {
    console.error('Error buscando armazón', err);
  }
  mostrarSpinner(false);
});

// Buscar nombre por DNI
const dni = document.getElementById('dni');
dni.addEventListener('blur', async () => {
  const valor = dni.value.trim();
  if (!valor) return;

  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarDNI=${valor}`);
    const nombre = await res.text();
    if (nombre && !nombre.includes("ERROR")) {
      document.getElementById('nombre').value = nombre;
    }
  } catch (err) {
    console.error('Error buscando DNI', err);
  }
  mostrarSpinner(false);
});

// Generar número de trabajo
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

// Mostrar u ocultar spinner
function mostrarSpinner(mostrar) {
  const spinner = document.getElementById('spinner');
  spinner.style.display = mostrar ? 'block' : 'none';
}

// Formateo de precios con $ y sin decimales
function parsearPrecio(valor) {
  const numero = parseInt(valor.replace(/[^\d]/g, '')) || 0;
  return numero;
}

function formatear(valor) {
  return '$' + parsearPrecio(valor);
}

precioCristal.addEventListener('blur', () => {
  precioCristal.value = formatear(precioCristal.value);
  actualizarTotales();
});

precioArmazon.addEventListener('blur', () => {
  precioArmazon.value = formatear(precioArmazon.value);
  actualizarTotales();
});

sena.addEventListener('blur', () => {
  sena.value = formatear(sena.value);
  actualizarTotales();
});

function actualizarTotales() {
  const cristal = parsearPrecio(precioCristal.value);
  const armazon = parsearPrecio(precioArmazon.value);
  const seña = parsearPrecio(sena.value);

  const suma = cristal + armazon;
  const restante = suma - seña;

  total.value = '$' + suma;
  saldo.value = '$' + (restante > 0 ? restante : 0);
}
