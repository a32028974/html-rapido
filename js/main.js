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

  // Fechas
  cargarFechaHoy();
  function parseFechaDDMMYY(str){ if(!str) return new Date(); const [d,m,a]=str.split("/"); let y=parseInt(a,10); if(a.length===2) y=2000+y; return new Date(y,parseInt(m,10)-1,parseInt(d,10)); }
  function fmtDDMMYY(date){ const d=String(date.getDate()).padStart(2,'0'); const m=String(date.getMonth()+1).padStart(2,'0'); const y=String(date.getFullYear()).slice(-2); return `${d}/${m}/${y}`; }
  function recalcularFechaRetira(){
    const sel = document.querySelector("input[name='entrega']:checked");
    if(!sel) return;
    const dias = parseInt(sel.value,10);
    const base = parseFechaDDMMYY((document.getElementById("fecha")?.value || "").trim());
    const estimada = new Date(base); estimada.setDate(estimada.getDate()+dias);
    if (fechaRetiraInput) fechaRetiraInput.value = fmtDDMMYY(estimada);
  }
  radiosEntrega.forEach(r => r.addEventListener("change", recalcularFechaRetira));
  recalcularFechaRetira();

  // N° trabajo desde teléfono
  telefonoInput.addEventListener("blur", () => {
    const tel = telefonoInput.value.replace(/\D/g,'');
    if (tel.length >= 4) {
      const ult4 = tel.slice(-4), now=new Date();
      const anio = now.getFullYear().toString().slice(-1);
      const mes  = String(now.getMonth()+1).padStart(2,'0');
      const dia  = String(now.getDate()).padStart(2,'0');
      const hora = String(now.getHours()).padStart(2,'0');
      numeroTrabajoInput.value = `${anio}${mes}${dia}${hora}${ult4}`;
    } else {
      numeroTrabajoInput.value = "";
      alert("Ingresá un teléfono válido (mínimo 4 dígitos).");
    }
  });

  // DNI -> nombre + teléfono
  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) buscarNombrePorDNI(dniInput, nombreInput, telefonoInput, dniLoading);
  });

  // Armazón -> modelo/precio/estado
  numeroArmazonInput.addEventListener("blur", () => {
    if (numeroArmazonInput.value.trim()) {
      buscarArmazonPorNumero(numeroArmazonInput, armazonDetalleInput, precioArmazonInput, spinner);
    }
  });

  // Totales y lista de cristales
  configurarCalculoPrecios();
  cargarCristales();

  // Guardar
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    await guardarTrabajo();
  });

  // Botones inferiores
  const btnImp = document.getElementById("btn-imprimir");
  const btnClr = document.getElementById("btn-limpiar");
  if (btnImp) btnImp.addEventListener("click", () => window.print());
  if (btnClr) btnClr.addEventListener("click", limpiarFormulario);
});

/* Limpia sin tocar fecha ni entrega (por si seguís con otro cliente) */
function limpiarFormulario(){
  const ids = [
    "numero_trabajo","dni","nombre","telefono",
    "cristal","precio_cristal","numero_armazon",
    "armazon_detalle","precio_armazon",
    "otro_concepto","precio_otro",
    "descripcion","tipo","dr",
    "od_esf","od_cil","od_eje","oi_esf","oi_cil","oi_eje","add",
    "vendedor","forma_pago","total","sena","saldo"
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });
}
