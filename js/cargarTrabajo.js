import { mostrarSpinner } from './utilidades.js';
import { validarCamposTrabajo } from './validarTrabajo.js';

export function guardarTrabajo() {
  const nombre = document.getElementById('nombre').value.trim().toUpperCase();
  const dni = document.getElementById('dni').value.trim();
  const cristal = document.getElementById('cristal').value.trim().toUpperCase();
  const detalle = document.getElementById('detalle').value.trim().toUpperCase();
  const fecha_entrega = document.getElementById('fecha_entrega').value;

  if (!validarCamposTrabajo(nombre, dni, cristal)) {
    alert('Completá todos los campos obligatorios correctamente.');
    return;
  }

  mostrarSpinner(true);

  const data = {
    nombre,
    dni,
    cristal,
    detalle,
    fecha_entrega
  };

  const url = 'https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec';

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(respuesta => {
      mostrarSpinner(false);
      alert(respuesta.mensaje || 'Trabajo guardado con éxito');
      limpiarCampos();
    })
    .catch(error => {
      console.error('Error al guardar:', error);
      mostrarSpinner(false);
      alert('Error al guardar el trabajo.');
    });
}

function limpiarCampos() {
  document.getElementById('nombre').value = '';
  document.getElementById('dni').value = '';
  document.getElementById('cristal').value = '';
  document.getElementById('detalle').value = '';
  document.getElementById('fecha_entrega').value = '';
}
