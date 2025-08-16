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

  // === Graduaciones ===
  cargarOpcionesGraduacion();
  configurarValidacionesEje();

  // Guardar
  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validarEjesRequeridos()) return;
    await guardarTrabajo();
  });

  // Botones inferiores
  const btnImp = document.getElementById("btn-imprimir");
  const btnClr = document.getElementById("btn-limpiar");
  if (btnImp) btnImp.addEventListener("click", () => { buildPrintArea(); window.print(); });
  if (btnClr) btnClr.addEventListener("click", limpiarFormulario);

  // Exponer para que guardar.js pueda imprimir con el formato
  window.__buildPrintArea = buildPrintArea;
});

/* ========= Graduación ========= */
function cargarOpcionesGraduacion() {
  const od_esf = document.getElementById("od_esf");
  const od_cil = document.getElementById("od_cil");
  const oi_esf = document.getElementById("oi_esf");
  const oi_cil = document.getElementById("oi_cil");
  if (!od_esf || !od_cil || !oi_esf || !oi_cil) return;

  [od_esf, od_cil, oi_esf, oi_cil].forEach(sel => sel.innerHTML = "");
  agregarPlaceholder(od_esf, "ESF"); agregarPlaceholder(od_cil, "CIL");
  agregarPlaceholder(oi_esf, "ESF"); agregarPlaceholder(oi_cil, "CIL");

  const esfVals = rangoDecimales(-15, 15, 0.25, true); // incluye 0.00 una vez
  esfVals.forEach(v => { od_esf.appendChild(opcion(v)); oi_esf.appendChild(opcion(v)); });

  const cilVals = ["0.00"]
    .concat(rangoDecimales(-0.25, -6, -0.25, false))
    .concat(rangoDecimales(0.25, 6, 0.25, false));
  cilVals.forEach(v => { od_cil.appendChild(opcion(v)); oi_cil.appendChild(opcion(v)); });
}
function agregarPlaceholder(select, texto){ const o=document.createElement("option"); o.textContent=texto; o.value=""; o.disabled=true; o.selected=true; select.appendChild(o); }
function opcion(valor){ const o=document.createElement("option"); o.value=valor; o.textContent=valor; return o; }
function rangoDecimales(inicio, fin, paso, skipZero){
  const res=[]; const fmt=n=>{ const s=Number(n).toFixed(2); return Number(n)>0?`+${s}`:Number(n)===0?"0.00":s; };
  if (inicio<=fin && paso>0){ for(let v=inicio; v<=fin+1e-9; v+=paso){ if(skipZero && Math.abs(v)<1e-9) continue; res.push(fmt(v)); } }
  else { for(let v=inicio; v>=fin-1e-9; v+=paso){ if(skipZero && Math.abs(v)<1e-9) continue; res.push(fmt(v)); } }
  if (skipZero && !res.includes("0.00")) res.splice(Math.floor(res.length/2),0,"0.00");
  return res;
}

/* ===== Validación EJE ===== */
function configurarValidacionesEje() {
  [{cil:"od_cil",eje:"od_eje"},{cil:"oi_cil",eje:"oi_eje"}].forEach(({cil,eje})=>{
    const sel=document.getElementById(cil), inp=document.getElementById(eje);
    if(!sel||!inp) return;
    sel.addEventListener("change",()=>checkEjeRequerido(sel,inp));
    inp.addEventListener("input",()=>{
      let v=inp.value.replace(/\D/g,"");
      if(v===""){ styleEje(inp,true); return; }
      let n=parseInt(v,10); if(isNaN(n)) n=""; if(n<0)n=0; if(n>180)n=180; inp.value=n.toString();
      checkEjeRequerido(sel,inp);
    });
  });
}
function checkEjeRequerido(selCil, inpEje){
  const requiere = selCil.value && selCil.value !== "0.00";
  if (requiere && !inpEje.value){ styleEje(inpEje,false); }
  else { styleEje(inpEje,true); }
}
function styleEje(inp, ok){ inp.style.borderColor = ok ? "#d7dbe0" : "red"; }
function validarEjesRequeridos(){
  const od = document.getElementById("od_cil"), odE=document.getElementById("od_eje");
  const oi = document.getElementById("oi_cil"), oiE=document.getElementById("oi_eje");
  if (od && od.value && od.value!=="0.00" && odE && !odE.value){ alert("Falta el EJE en OD."); odE.focus(); return false; }
  if (oi && oi.value && oi.value!=="0.00" && oiE && !oiE.value){ alert("Falta el EJE en OI."); oiE.focus(); return false; }
  return true;
}

/* ========= LIMPIAR ========= */
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

/* ========= IMPRESIÓN ========= */
function buildPrintArea(){
  const P = (id) => (document.getElementById(id)?.value || "").toString();

  const html = `
    <div class="print-box">
      <div class="title">Ingreso de trabajo</div>
      <div class="grid">
        <div><strong>Fecha:</strong> ${P("fecha")}</div>
        <div><strong>Retira:</strong> ${P("fecha_retira")}</div>
        <div><strong>N° trabajo:</strong> ${P("numero_trabajo")}</div>
        <div><strong>DR:</strong> ${P("dr")}</div>
        <div><strong>DNI:</strong> ${P("dni")}</div>
        <div><strong>Tel:</strong> ${P("telefono")}</div>
        <div style="grid-column:1/-1;"><strong>Cliente:</strong> ${P("nombre")}</div>
      </div>

      <div class="print-box">
        <div class="print-row"><strong>Cristal:</strong><span>${P("cristal")} — $${P("precio_cristal")}</span></div>
        <div class="print-row"><strong>Armazón:</strong><span>${P("numero_armazon")} ${P("armazon_detalle")} — $${P("precio_armazon")}</span></div>
        <div class="print-row"><strong>Otro:</strong><span>${P("otro_concepto")} — $${P("precio_otro")}</span></div>
        <div class="print-row"><strong>Descripción:</strong><span>${P("descripcion")}</span></div>
        <div class="print-row"><strong>Tipo:</strong><span>${P("tipo")}</span></div>
      </div>

      <div class="print-box">
        <div class="print-row"><strong>OD:</strong>
          <span>ESF ${P("od_esf")}  |  CIL ${P("od_cil")}  |  EJE ${P("od_eje")}</span>
        </div>
        <div class="print-row"><strong>OI:</strong>
          <span>ESF ${P("oi_esf")}  |  CIL ${P("oi_cil")}  |  EJE ${P("oi_eje")}</span>
        </div>
        <div class="print-row"><strong>ADD:</strong><span>${P("add")}</span></div>
      </div>

      <div class="print-box">
        <div class="print-row"><strong>TOTAL:</strong><span>$${P("total")}</span></div>
        <div class="print-row"><strong>SEÑA:</strong><span>$${P("sena")}</span></div>
        <div class="print-row"><strong>SALDO:</strong><span>$${P("saldo")}</span></div>
        <div class="print-row"><strong>Forma de pago:</strong><span>${P("forma_pago")}</span></div>
        <div class="print-row"><strong>Vendedor:</strong><span>${P("vendedor")}</span></div>
      </div>
    </div>
  `;
  const area = document.getElementById("print-area");
  if (area) area.innerHTML = html;
}
