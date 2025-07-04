
const url = 'https://script.google.com/macros/s/AKfycbwL4_hTSQEDht0__mxASderbkns8bvgo8PrzaS1rmvTINJJXBh298YSTmqatqIifyKfAQ/exec';

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');
const spinner = document.getElementById('spinner');
const fechaInput = document.getElementById('fecha');
const hoy = new Date();
const dd = String(hoy.getDate()).padStart(2, '0');
const mm = String(hoy.getMonth() + 1).padStart(2, '0');
const yy = String(hoy.getFullYear()).slice(-2);
fechaInput.value = `${dd}/${mm}/${yy}`;

function mostrarSpinner(mostrar) {
  spinner.style.display = mostrar ? 'block' : 'none';
}

document.getElementById('dni').addEventListener('blur', async () => {
  const dni = document.getElementById('dni').value.trim();
  if (!dni) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarDNI=${dni}`);
    const nombre = await res.text();
    if (!nombre.includes('ERROR')) {
      document.getElementById('nombre').value = nombre;
    }
  } catch (err) {
    console.error(err);
  }
  mostrarSpinner(false);
});

document.getElementById('numero_armazon').addEventListener('blur', async () => {
  const codigo = document.getElementById('numero_armazon').value.trim();
  if (!codigo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarArmazon=${codigo}`);
    const data = await res.json();
    document.getElementById('armazon_detalle').value = data.modelo;
    document.getElementById('precio_armazon').value = `$${parseInt(data.precio) || 0}`;
    calcularTotal();
  } catch (err) {
    console.error(err);
  }
  mostrarSpinner(false);
});

document.getElementById('cristal').addEventListener('blur', async () => {
  const tipo = document.getElementById('cristal').value.trim();
  if (!tipo) return;
  mostrarSpinner(true);
  try {
    const res = await fetch(`${url}?buscarCristal=${tipo}`);
    const precio = await res.text();
    document.getElementById('precio_cristal').value = `$${parseInt(precio) || 0}`;
    calcularTotal();
  } catch (err) {
    console.error(err);
  }
  mostrarSpinner(false);
});

document.getElementById('sena').addEventListener('input', calcularTotal);
document.getElementById('precio_otro').addEventListener('input', calcularTotal);

function llenarSelectConSigno(id, min, max, step) {
  const select = document.getElementById(id);
  for (let v = min; v <= max; v += step) {
    const label = v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2);
    const option = document.createElement('option');
    option.value = v.toFixed(2);
    option.textContent = label;
    select.appendChild(option);
  }
  select.value = '0.00';
}
['od_esf','oi_esf'].forEach(id => llenarSelectConSigno(id, -24, 24, 0.25));
['od_cil','oi_cil'].forEach(id => llenarSelectConSigno(id, -7, 7, 0.25));

function calcularTotal() {
  const a = n => parseInt((document.getElementById(n)?.value || '').replace(/\D/g, '')) || 0;
  const otroRaw = document.getElementById('precio_otro')?.value.trim() || '0';
  const otro = parseInt(otroRaw.replace(/\D/g, '')) || 0;
  const signo = otroRaw.startsWith('-') ? -1 : 1;
  const total = a('precio_cristal') + a('precio_armazon') + signo * otro;
  const saldo = total - a('sena');
  document.getElementById('total').value = `$${total}`;
  document.getElementById('saldo').value = `$${saldo}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const mayusForm = new FormData();
  for (const [k, v] of data.entries()) mayusForm.append(k, v.toUpperCase());
  mostrarSpinner(true);
  try {
    const res = await fetch(url, { method: 'POST', body: mayusForm });
    const text = await res.text();
    Swal.fire(text.includes('✅') ? { icon: 'success', title: 'Guardado', text } : { icon: 'error', title: 'Error', text });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error de red', text: err.message });
  }
  mostrarSpinner(false);
});

document.getElementById('btn-imprimir').onclick = () => window.print();
document.getElementById('btn-limpiar').onclick = () => {
  form.reset(); fechaInput.value = `${dd}/${mm}/${yy}`;
}

async function generarProximoNumeroTrabajo() {
  try {
    const res = await fetch(`${url}?proximoTrabajo=1`);
    const numero = await res.text();
    document.getElementById('numero_trabajo').value = numero;
  } catch (err) {
    console.error('Error obteniendo número de trabajo:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fecha').value = `${dd}/${mm}/${yy}`;
  generarProximoNumeroTrabajo();
});
