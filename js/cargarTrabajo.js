import { mostrarSpinner, imprimirFormulario } from './utilidades.js';
import { validarCamposTrabajo, activarValidacionesEnVivo } from './validarTrabajo.js';

export function guardarTrabajo() {
  const nombre = document.getElementById('nombre').value.trim().toUpperCase();
  const dni = document.getElementById('dni').value.trim();
  const cristal = document.getElementById('cristal').value.trim().toUpperCase();
  const detalle = document.getElementById('detalle').value.trim().toUpperCase();
  const fecha_entrega = document.getElementById('fecha_entrega').value;

  if (!validarCamposTrabajo(nombre, dni, cristal)) {
    alert('Revisá los campos marcados.');
    return;
  }

  mostrarSpinner(true);

  const data = {
    nombre,
    dni,
    cristal,
    detalle,
    fecha_entrega,
    accion: 'guardar_imprimir_pdf'
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
      if (respuesta.ok) {
        imprimirFormulario();  // abre impresión
        limpiarCampos();
      } else {
        alert('Error en el servidor: ' + (respuesta.mensaje || 'Sin mensaje'));
      }
    })
    .catch(error => {
      console.error('Error al guardar:', error);
      mostrarSpinner(false);
      alert('Error al guardar el trabajo.');
    });
}

function limpiarCampos() {
  document.querySelectorAll('input').forEach(input => input.value = '');
}

// Activar validaciones en vivo al cargar el módulo
activarValidacionesEnVivo();
