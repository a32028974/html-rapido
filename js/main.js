import { obtenerNumeroTrabajo } from './numeroTrabajo.js';
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoOtroConcepto } from './calculos.js';

document.addEventListener("DOMContentLoaded", () => {
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const numeroArmazon = document.getElementById("numero_armazon");
  const armazonDetalle = document.getElementById("armazon_detalle");
  const totalInput = document.getElementById("total");
  const otroConceptoInput = document.getElementById("otro_concepto");
  const spinner = document.getElementById("spinner");

  obtenerNumeroTrabajo();
  cargarFechaHoy();

  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, spinner);
    }
  });

  numeroArmazon.addEventListener("blur", () => {
    if (numeroArmazon.value.trim()) {
      buscarArmazonPorNumero(numeroArmazon, armazonDetalle, totalInput, spinner);
    }
  });

  configurarCalculoOtroConcepto(otroConceptoInput, totalInput);
});
