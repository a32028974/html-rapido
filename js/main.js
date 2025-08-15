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

  // === 1) Fecha hoy
  cargarFechaHoy();

  // === 2) Fecha estimada (según radios)
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
  function recalcularFechaRetira() {
    const sel = document.querySelector("input[name='entrega']:checked");
    if (!sel) return;
    const dias = parseInt(sel.value, 10); // 7, 3, 15
    const base = parseFechaDDMMYY((document.getElementById("fecha")?.value || "").trim());
    const estimada = new Date(base);
    estimada.setDate(estimada.getDate() + dias);
    if (fechaRetiraInput) fechaRetiraInput.value = fmtDDMMYY(estimada);
  }
  radiosEntrega.forEach(r => r.addEventListener("change", recalcularFechaRetira));
  recalcularFechaRetira();

  // === 3) N° de trabajo desde teléfono
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

  // === 4) DNI -> nombre + teléfono con lupita
  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) {
      buscarNombrePorDNI(dniInput, nombreInput, telefonoInput, dniLoading);
    }
  });

  // === 5) Modelo y precio de armazón
  numeroArmazonInput.addEventListener("blur", () => {
    if (numeroArmazonInput.value.trim()) {
      buscarArmazonPorNumero(numeroArmazonInput, armazonDetalleInput, precioArmazonInput, spinner);
    }
  });

  // === 6) Totales
  configurarCalculoPrecios();

  // === 7) Sugerencias de “Tipo de cristal”
  cargarCristales();

  // === 8) Graduaciones OD / OI (ESF, CIL, EJE)
  cargarOpcionesGraduacion();
  configurarValidacionesEje();

  // === 9) Guardar
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validarEjesRequeridos()) return;
    await guardarTrabajo();
  });
});

/* =======================
   Graduación: helpers
   ======================= */
function cargarOpcionesGraduacion() {
  const od_esf = document.getElementById("od_esf");
  const od_cil = document.getElementById("od_cil");
  const oi_esf = document.getElementById("oi_esf");
  const oi_cil = document.getElementById("oi_cil");

  if (!od_esf || !od_cil || !oi_esf || !oi_cil) return;

  // Limpio
  [od_esf, od_cil, oi_esf, oi_cil].forEach(sel => sel.innerHTML = "");

  // Placeholders
  agregarPlaceholder(od_esf, "ESF");
  agregarPlaceholder(od_cil, "CIL");
  agregarPlaceholder(oi_esf, "ESF");
  agregarPlaceholder(oi_cil, "CIL");

  // ESF: -15.00 a +15.00 (paso 0.25)
  const esfVals = rangoDecimales(-15, 15, 0.25, true); // incluye 0.00
  esfVals.forEach(v => {
    od_esf.appendChild(opcion(v));
    oi_esf.appendChild(opcion(v));
  });

  // CIL: 0.00 + negativos -0.25..-6.00 + positivos +0.25..+6.00
  const cilVals = ["0.00"]
    .concat(rangoDecimales(-0.25, -6, -0.25, false)) // descendente
    .concat(rangoDecimales(0.25, 6, 0.25, false));   // ascendente

  cilVals.forEach(v => {
    od_cil.appendChild(opcion(v));
    oi_cil.appendChild(opcion(v));
  });
}

function agregarPlaceholder(select, texto) {
  const opt = document.createElement("option");
  opt.textContent = texto;
  opt.value = "";
  opt.disabled = true;
  opt.selected = true;
  select.appendChild(opt);
}

function opcion(valor) {
  const opt = document.createElement("option");
  opt.value = valor;
  opt.textContent = valor;
  return opt;
}

// Genera array de strings con signo y 2 decimales (ej. "-3.25", "0.00", "+1.00")
function rangoDecimales(inicio, fin, paso, incluirCeroUnaVez = false) {
  const res = [];
  function fmt(n) {
    const s = Number(n).toFixed(2);
    if (Number(n) > 0) return `+${s}`;
    if (Number(n) === 0) return "0.00";
    return s; // ya tiene signo negativo
  }

  if (inicio <= fin && paso > 0) {
    for (let v = inicio; v <= fin + 1e-9; v += paso) {
      if (incluirCeroUnaVez && Math.abs(v) < 1e-9) continue; // evitamos duplicar 0.00 si lo agregamos a mano
      res.push(fmt(v));
    }
  } else {
    // descendente (ej: -0.25 a -6 de a -0.25)
    for (let v = inicio; v >= fin - 1e-9; v += paso) {
      if (incluirCeroUnaVez && Math.abs(v) < 1e-9) continue;
      res.push(fmt(v));
    }
  }

  // Si hay que incluir 0.00 explícito
  if (incluirCeroUnaVez) {
    // insertamos 0.00 en su lugar lógico
    const zero = "0.00";
    if (!res.includes(zero)) {
      // lo ponemos en el medio aproximado
      const mid = Math.floor(res.length / 2);
      res.splice(mid, 0, zero);
    }
  }
  return res;
}

/* =======================
   Validación de EJE
   ======================= */
function configurarValidacionesEje() {
  const map = [
    { cil: "od_cil", eje: "od_eje" },
    { cil: "oi_cil", eje: "oi_eje" }
  ];

  map.forEach(({ cil, eje }) => {
    const selCil = document.getElementById(cil);
    const inpEje = document.getElementById(eje);
    if (!selCil || !inpEje) return;

    // Cuando cambia CIL, si != 0.00 exigir EJE
    selCil.addEventListener("change", () => {
      checkEjeRequerido(selCil, inpEje);
    });

    // Limitar EJE 0–180 (solo enteros)
    inpEje.addEventListener("input", () => {
      let v = inpEje.value.replace(/\D/g, "");
      if (v === "") { inpEje.dataset.valid = "0"; styleEje(inpEje, true); return; }
      let n = parseInt(v, 10);
      if (isNaN(n)) n = "";
      if (n < 0) n = 0;
      if (n > 180) n = 180;
      inpEje.value = n.toString();
      // si CIL ≠ 0, validar
      checkEjeRequerido(selCil, inpEje);
    });
  });
}

function checkEjeRequerido(selCil, inpEje) {
  const cilVal = (selCil.value || "").trim();
  const requiere = cilVal !== "" && cilVal !== "0.00";
  const ejeVal = (inpEje.value || "").trim();

  if (requiere && ejeVal === "") {
    styleEje(inpEje, false); // marca error
    inpEje.dataset.valid = "0";
  } else {
    styleEje(inpEje, true);
    inpEje.dataset.valid = "1";
  }
}

function styleEje(inp, ok) {
  inp.style.borderColor = ok ? "#ccc" : "red";
}

function validarEjesRequeridos() {
  const od_cil = document.getElementById("od_cil");
  const od_eje = document.getElementById("od_eje");
  const oi_cil = document.getElementById("oi_cil");
  const oi_eje = document.getElementById("oi_eje");

  const odReq = od_cil && od_cil.value && od_cil.value !== "0.00" && od_eje && !od_eje.value;
  const oiReq = oi_cil && oi_cil.value && oi_cil.value !== "0.00" && oi_eje && !oi_eje.value;

  if (odReq) {
    alert("Falta el EJE en OD (porque el CIL es distinto de 0).");
    od_eje && od_eje.focus();
    return false;
  }
  if (oiReq) {
    alert("Falta el EJE en OI (porque el CIL es distinto de 0).");
    oi_eje && oi_eje.focus();
    return false;
  }
  return true;
}
