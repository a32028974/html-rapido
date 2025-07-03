const url = 'https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec';

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const spinner = document.getElementById('spinner');
const printBtn = document.getElementById('btn-imprimir');
const clearBtn = document.getElementById('btn-limpiar');

const fechaInput = document.getElementById('fecha');
const hoy = new Date();
const dd = String(hoy.getDate()).padStart(2, '0');
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const yy = String(hoy.getFullYear()).slice(-2);
fechaInput.value = `${dd}/${mm}/${yy}`;

function mostrarSpinner(mostrar) {
  spinner.style.display = mostrar ? 'block' : 'none';
}

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

const armazonInput = document.getElementById('numero_armazon');
armazonInput.addEventListener('blur', async () => {
  const codigo = armazonInput.value.trim();
  if (!codigo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarArmazon=${codigo}`);
    const data = await res.json();
    if (data && data.modelo) {
      document.getElementById('armazon_detalle').value = data.modelo;
    }
    const precioArmazonField = document.getElementById('precio_armazon');
    precioArmazonField.removeAttribute('readonly');
    precioArmazonField.value = data.precio ? `$${parseInt(data.precio) || 0}` : '';
    calcularTotal();
  } catch (err) {
    console.error('Error buscando armazón:', err);
  }
  mostrarSpinner(false);
});

const cristalInput = document.getElementById('cristal');
cristalInput.addEventListener('blur', async () => {
  const tipo = cristalInput.value.trim();
  if (!tipo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarCristal=${tipo}`);
    const precio = await res.text();
    const precioCristalField = document.getElementById('precio_cristal');
    precioCristalField.removeAttribute('readonly');
    precioCristalField.value = `$${parseInt(precio) || 0}`;
    calcularTotal();
  } catch (err) {
    console.error('Error buscando precio cristal:', err);
  }
  mostrarSpinner(false);
});

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

function llenarSelect(id, min, max, step) {
  const select = document.getElementById(id);
  if (!select) return;
  for (let v = min; v <= max; v += step) {
    const option = document.createElement('option');
    option.value = option.textContent = v.toFixed(2);
    select.appendChild(option);
  }
}

llenarSelect('od_esf', -24.00, 24.00, 0.25);
llenarSelect('oi_esf', -24.00, 24.00, 0.25);
llenarSelect('od_cil', -7.00, 7.00, 0.25);
llenarSelect('oi_cil', -7.00, 7.00, 0.25);

async function generarProximoNumeroTrabajo() {
  try {
    const res = await fetch(`${url}?proximoTrabajo=1`);
    const numero = await res.text();
    document.getElementById('numero_trabajo').value = numero;
  } catch (err) {
    console.error('Error obteniendo número de trabajo:', err);
  }
}

form.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const tag = e.target.tagName.toLowerCase();
    if (tag !== 'textarea') {
      e.preventDefault();
    }
  }
});

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
    if (text.includes('✅')) {
      Swal.fire({
        icon: 'success',
        title: 'Trabajo guardado',
        text: text,
        confirmButtonText: 'OK'
      });
      generarProximoNumeroTrabajo();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: text
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de red o conexión',
      text: err.message
    });
  }
  mostrarSpinner(false);
});

printBtn.addEventListener('click', () => {
  window.print();
});

clearBtn.addEventListener('click', () => {
  form.reset();
  fechaInput.value = `${dd}/${mm}/${yy}`;
  generarProximoNumeroTrabajo();
});

generarProximoNumeroTrabajo();
