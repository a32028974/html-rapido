// main.js
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoPrecios } from './calculos.js';
import { guardarTrabajo } from './guardar.js';

document.addEventListener("DOMContentLoaded", () => {
  const fechaRetiraInput = document.getElementById("fecha_retira");
  const telefonoInput = document.getElementById("telefono");
  const numeroTrabajoInput = document.getElementById("numero_trabajo");
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const numeroArmazonInput = document.getElementById("numero_armazon");
  const armazonDetalleInput = document.getElementById("armazon_detalle");
  const precioArmazonInput = document.getElementById("precio_armazon");
  const spinner = document.getElementById("spinner");
  const radiosEntrega = document.querySelectorAll("input[name='entrega']");

  // ✅ Cargar fecha de hoy sin parámetros
  cargarFechaHoy();

  // Calcular fecha estimada al cambiar opción de entrega
  radiosEntrega.forEach(radio => {
    radio.addEventListener("change", () => {
      const dias = parseInt(radio.value);
      const hoy = new Date();
      hoy.setDate(hoy.getDate() + dias);
      const dia = String(hoy.getDate()).padStart(2, '0');
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const anio = String(hoy.getFullYear()).slice(-2);
      fechaRetiraInput.value = `${dia}/${mes}/${anio}`;
    });
  });

  // Generar número de trabajo cuando se completa teléfono
  telefonoInput.addEventListener("blur", () => {
    const tel = telefonoInput.value.replace(/\D/g, '');
    if (tel.length >= 4) {
      const ultimos4 = tel.slice(-4);
      const ahora = new Date();
      const anio = ahora.getFullYear().toString().slice(-1);
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const dia = String(ahora.getDate()).padStart(2, '0');
      const hora = String(ahora.getHours()).padStart(2, '0');
      numeroTrabajoInput.value = `${anio}${mes}${dia}${hora}${ultimos4}`;
    } else {
      numeroTrabajoInput.value = "";
      alert("Por favor, ingresá un teléfono válido con al menos 4 dígitos.");
    }
  });

  // Traer nombre automáticamente por DNI
  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, spinner);
    }
  });

  // Buscar modelo y precio del armazón
  numeroArmazonInput.addEventListener("blur", () => {
    if (numeroArmazonInput.value.trim()) {
      buscarArmazonPorNumero(numeroArmazonInput, armazonDetalleInput, precioArmazonInput, spinner);
    }
  });

  // Calcular total y saldo
  configurarCalculoPrecios();

  // Guardar al enviar
  const form = document.getElementById("formulario");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await guardarTrabajo();
  });
});
