// main.js
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoPrecios } from './calculos.js';
import { guardarTrabajo } from './guardar.js';

document.addEventListener("DOMContentLoaded", () => {
  const fechaRetiraInput     = document.getElementById("fecha_retira");
  const telefonoInput        = document.getElementById("telefono");
  const numeroTrabajoInput   = document.getElementById("numero_trabajo");
  const dniInput             = document.getElementById("dni");
  const nombreInput          = document.getElementById("nombre");
  const numeroArmazonInput   = document.getElementById("numero_armazon");
  const armazonDetalleInput  = document.getElementById("armazon_detalle");
  const precioArmazonInput   = document.getElementById("precio_armazon");
  const spinner              = document.getElementById("spinner");
  const radiosEntrega        = document.querySelectorAll("input[name='entrega']");

  // ✅ 1) Fecha de hoy en "Fecha que encarga"
  cargarFechaHoy(); // ahora sí existe y setea #fecha (dd/mm/aa):contentReference[oaicite:2]{index=2}

  // Helper: parsea "dd/mm/aa" o "dd/mm/aaaa" a Date
  function parseFechaDDMMYY(str) {
    if (!str) return new Date();
    const [d, m, a] = str.split("/");
    let year = parseInt(a, 10);
    if (a.length === 2) {
      year = 2000 + year; // 24 -> 2024
    }
    return new Date(parseInt(year,10), parseInt(m,10)-1, parseInt(d,10));
  }

  // Helper: formatea Date a "dd/mm/aa"
  function fmtDDMMYY(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio2 = String(date.getFullYear()).slice(-2);
    return `${dia}/${mes}/${anio2}`;
  }

  // ✅ 2) Calcula fecha estimada según radio seleccionado
  function recalcularFechaRetira() {
    const sel = document.querySelector("input[name='entrega']:checked");
    if (!sel) return;
    const dias = parseInt(sel.value, 10); // 7, 3 o 15 (Stock/Urgente/Laboratorio):contentReference[oaicite:3]{index=3}

    const fechaEncargoStr = (document.getElementById("fecha")?.value || "").trim();
    const base = parseFechaDDMMYY(fechaEncargoStr); // usa la fecha que encarga
    const estimada = new Date(base);
    estimada.setDate(estimada.getDate() + dias);

    if (fechaRetiraInput) fechaRetiraInput.value = fmtDDMMYY(estimada);
  }

  // Eventos para radios
  radiosEntrega.forEach(radio => {
    radio.addEventListener("change", recalcularFechaRetira);
  });

  // Cálculo inicial de la fecha estimada al cargar la página
  recalcularFechaRetira();

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
