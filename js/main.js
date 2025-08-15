// main.js
import { cargarFechaHoy } from './fechaHoy.js';
import { buscarNombrePorDNI } from './buscarNombre.js';
import { buscarArmazonPorNumero } from './buscarArmazon.js';
import { configurarCalculoPrecios } from './calculos.js';
import { guardarTrabajo } from './guardar.js';
import { cargarCristales } from './sugerencias.js';

document.addEventListener("DOMContentLoaded", () => {
  const fechaRetiraInput     = document.getElementById("fecha_retira");
  const telefonoInput        = document.getElementById("telefono");
  const numeroTrabajoInput   = document.getElementById("numero_trabajo");
  const dniInput             = document.getElementById("dni");
  const dniLoading           = document.getElementById("dni-loading");
  const nombreInput          = document.getElementById("nombre");
  const numeroArmazonInput   = document.getElementById("numero_armazon");
  const armazonDetalleInput  = document.getElementById("armazon_detalle");
  const precioArmazonInput   = document.getElementById("precio_armazon");
  const spinner              = document.getElementById("spinner");
  const radiosEntrega        = document.querySelectorAll("input[name='entrega']");

  // 1) Fecha de hoy (dd/mm/aa)
  cargarFechaHoy();

  // Helpers fecha
  function parseFechaDDMMYY(str) {
    if (!str) return new Date();
    const [d, m, a] = str.split("/");
    let year = parseInt(a, 10);
    if (a.length === 2) year = 2000 + year;
    return new Date(year, parseInt(m,10)-1, parseInt(d,10));
  }
  function fmtDDMMYY(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(-2);
    return `${d}/${m}/${y}`;
  }

  // 2) Fecha estimada
  function recalcularFechaRetira() {
    const sel = document.querySelector("input[name='entrega']:checked");
    if (!sel) return;
    const dias = parseInt(sel.value, 10);
    const base = parseFechaDDMMYY((document.getElementById("fecha")?.value || "").trim());
    const estimada = new Date(base);
    estimada.setDate(estimada.getDate() + dias);
    if (fechaRetiraInput) fechaRetiraInput.value = fmtDDMMYY(estimada);
  }
  radiosEntrega.forEach(r => r.addEventListener("change", recalcularFechaRetira));
  recalcularFechaRetira();

  // 3) N° de trabajo desde teléfono
  telefonoInput.addEventListener("blur", () => {
    const tel = telefonoInput.value.replace(/\D/g, '');
    if (tel.length >= 4) {
      const ult4 = tel.slice(-4);
      const now  = new Date();
      const anio = now.getFullYear().toString().slice(-1);
      const mes  = String(now.getMonth() + 1).padStart(2, '0');
      const dia  = String(now.getDate()).padStart(2, '0');
      const hora = String(now.getHours()).padStart(2, '0');
      numeroTrabajoInput.value = `${anio}${mes}${dia}${hora}${ult4}`;
    } else {
      numeroTrabajoInput.value = "";
      alert("Por favor, ingresá un teléfono válido con al menos 4 dígitos.");
    }
  });

  // 4) DNI -> nombre + teléfono con lupita
  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, telefonoInput, dniLoading);
    }
  });

  // 5) Modelo y precio de armazón
  numeroArmazonInput.addEventListener("blur", () => {
    if (numeroArmazonInput.value.trim()) {
      buscarArmazonPorNumero(numeroArmazonInput, armazonDetalleInput, precioArmazonInput, spinner);
    }
  });

  // 6) Totales
  configurarCalculoPrecios();

  // 7) Sugerencias de “Tipo de cristal” desde la base
  cargarCristales(); // llena <datalist id="lista-cristales">

  // 8) Guardar
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    await guardarTrabajo();
  });
});
