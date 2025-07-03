const url = 'https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec';

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const spinner = document.getElementById('spinner');

const fechaInput = document.getElementById('fecha');
const hoy = new Date();
const dd = String(hoy.getDate()).padStart(2, '0');
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const yy = String(hoy.getFullYear()).slice(-2);
fechaInput.value = `${dd}/${mm}/${yy}`;

// Mostrar/Ocultar Spinner
function mostrarSpinner(mostrar) {
  spinner.style.display = mostrar ? 'block' : 'none';
}

// Buscar nombre por DNI
const dniInput = document.getElementById('dni');
dniInput.addEventListener('blur', async () => {
  const dni = dniInput.value.trim();
  if (!dni) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarDNI=${dni}`);
    const nombre = await res.text();
    if (!nombre.includes('ERROR')) {
      document.getElementById('nombre').value = nombre;
    }
  } catch (err) {
    console.error('Error buscando DNI:', err);
  }
  mostrarSpinner(false);
});

// Buscar armazón
const armazonInput = document.getElementById('numero_armazon');
armazonInput.addEventListener('blur', async () => {
  const codigo = armazonInput.value.trim();
  if (!codigo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarArmazon=${codigo}`);
    const data = await res.json();
    if (data.detalle && data.precio) {
      document.getElementById('armazon_detalle').value = data.detalle;
      const precioArmazonField = document.getElementById('precio_armazon');
      precioArmazonField.removeAttribute('readonly');
      precioArmazonField.value = `$${parseInt(data.precio)}`;
      calcularTotal();
    }
  } catch (err) {
    console.error('Error buscando armazón:', err);
  }
  mostrarSpinner(false);
});

// Buscar precio del cristal
const cristalInput = document.getElementById('cristal');
cristalInput.addEventListener('blur', async () => {
  const tipo = cristalInput.value.trim();
  if (!tipo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarCristal=${tipo}`);
    const precio = await res.text();
    if (!precio.includes('ERROR')) {
      const precioCristalField = document.getElementById('precio_cristal');
      precioCristalField.removeAttribute('readonly');
      precioCristalField.value = `$${parseInt(precio)}`;
      calcularTotal();
    }
  } catch (err) {
    console.error('Error buscando precio cristal:', err);
  }
  mostrarSpinner(false);
});

// Calcular Total y Saldo
const senaInput = document.getElementById('sena');
senaInput.addEventListener('input', calcularTotal);

function calcularTotal() {
  const precioCristal = parseInt((document.getElementById('precio_cristal').value || '').replace(/\D/g, '')) || 0;
  const precioArmazon = parseInt((document.getElementById('precio_armazon').value || '').replace(/\D/g, '')) || 0;
  const sena = parseInt(senaInput.value.replace(/\D/g, '')) || 0;
  const total = precioCristal + precioArmazon;
  const saldo = total - sena;
  document.getElementById('total').value = `$${total}`;
  document.getElementById('saldo').value = `$${saldo}`;
}

// Obtener número de trabajo
async function generarProximoNumeroTrabajo() {
  try {
    const res = await fetch(`${url}?proximoTrabajo=1`);
    const numero = await res.text();
    document.getElementById('numero_trabajo').value = numero;
  } catch (err) {
    console.error('Error obteniendo número de trabajo:', err);
  }
}

// Evitar envío con Enter
form.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const tag = e.target.tagName.toLowerCase();
    if (tag !== 'textarea') {
      e.preventDefault();
    }
  }
});

// Enviar formulario solo al hacer click en Guardar
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = '';
  mensaje.className = '';

  const formData = new FormData(form);
  const mayusForm = new FormData();
  for (const [key, value] of formData.entries()) {
    mayusForm.append(key, value.toUpperCase());
  }

  mostrarSpinner(true);
  try {
    const res = await fetch(url, { method: 'POST', body: mayusForm });
    const text = await res.text();
    mensaje.textContent = text;
    mensaje.className = text.includes('✅') ? 'ok' : 'error';
    if (text.includes('✅')) {
      form.reset();
      fechaInput.value = `${dd}/${mm}/${yy}`;
      generarProximoNumeroTrabajo();
    }
  } catch (err) {
    mensaje.textContent = '❌ Error de red o conexión';
    mensaje.className = 'error';
  }
  mostrarSpinner(false);
});

generarProximoNumeroTrabajo();
