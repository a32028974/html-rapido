import { obtenerNumeroTrabajo } from './numeroTrabajo.js';
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoPrecios } from './calculos.js';

document.addEventListener("DOMContentLoaded", () => {
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const numeroArmazon = document.getElementById("numero_armazon");
  const armazonDetalle = document.getElementById("armazon_detalle");
  const precioArmazon = document.getElementById("precio_armazon");
  const celularInput = document.getElementById("telefono");
  const spinner = document.getElementById("spinner");

  cargarFechaHoy();

  celularInput.addEventListener("blur", () => {
    if (celularInput.value.trim().length >= 4) {
      obtenerNumeroTrabajo();
    }
  });

  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, spinner);
    }
  });

  numeroArmazon.addEventListener("blur", () => {
    if (numeroArmazon.value.trim()) {
      buscarArmazonPorNumero(numeroArmazon, armazonDetalle, precioArmazon, spinner);
    }
  });

  configurarCalculoPrecios();

  // Módulo para calcular la fecha de retiro
  const fechaInput = document.getElementById("fecha");
  const radiosDias = document.querySelectorAll("input[name='dias_entrega']");

  radiosDias.forEach(radio => {
    radio.addEventListener("change", () => {
      const dias = parseInt(radio.value);
      if (!isNaN(dias)) {
        const hoy = new Date();
        hoy.setDate(hoy.getDate() + dias);
        const dia = String(hoy.getDate()).padStart(2, '0');
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const anio = String(hoy.getFullYear()).slice(2);
        fechaInput.value = `${dia}/${mes}/${anio}`;
      }
    });
  });
});
