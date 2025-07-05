// main.js
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoPrecios } from './calculos.js';

document.addEventListener("DOMContentLoaded", () => {
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const numeroArmazon = document.getElementById("numero_armazon");
  const armazonDetalle = document.getElementById("armazon_detalle");
  const totalInput = document.getElementById("total");
  const otroConceptoInput = document.getElementById("otro_concepto");
  const telefonoInput = document.getElementById("telefono");
  const numeroTrabajoInput = document.getElementById("numero_trabajo");
  const spinner = document.getElementById("spinner");

  cargarFechaHoy();
  configurarCalculoPrecios();

  // Buscar nombre por DNI
  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, spinner);
    }
  });

  // Buscar armazón por número
  numeroArmazon.addEventListener("blur", () => {
    if (numeroArmazon.value.trim()) {
      buscarArmazonPorNumero(numeroArmazon, armazonDetalle, spinner);
    }
  });

  // Generar número de trabajo cuando se ingresa el teléfono
  telefonoInput.addEventListener("blur", () => {
    const telefono = telefonoInput.value.trim();
    if (telefono.length >= 4) {
      const fecha = new Date();
      const año = fecha.getFullYear().toString().slice(-1); // último dígito del año
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const dia = fecha.getDate().toString().padStart(2, "0");
      const hora = fecha.getHours().toString().padStart(2, "0");
      const ultimos4 = telefono.slice(-4);

      const numeroTrabajo = `${año}${mes}${dia}${hora}-${ultimos4}`;
      numeroTrabajoInput.value = numeroTrabajo;
    } else {
      numeroTrabajoInput.value = "";
      alert("⚠️ Ingresá al menos los últimos 4 dígitos del teléfono para generar el número de trabajo.");
    }
  });
});
