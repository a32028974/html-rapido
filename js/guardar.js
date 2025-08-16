// guardar.js
import { API_URL } from './api.js';

// helpers
const $ = (id) => document.getElementById(id);
const toUpper = (v) => (v ?? "").toString().trim().toUpperCase();

// Radios entrega (7,3,15) -> NORMAL / URGENTE / LABORATORIO
function getRetiroTipo() {
  const sel = document.querySelector("input[name='entrega']:checked");
  if (!sel) return "";
  switch (sel.value) {
    case "7":  return "NORMAL";
    case "3":  return "URGENTE";
    case "15": return "LABORATORIO";
    default:   return "";
  }
}

function showMsg(text, color = "green") {
  const p = $("mensaje");
  if (!p) return;
  p.textContent = text;
  p.style.color = color;
}

function buildBody() {
  const params = new URLSearchParams({
    numero_trabajo : ($("numero_trabajo")?.value || "").trim(),
    dni            : ($("dni")?.value || "").trim(),
    nombre         : toUpper($("nombre")?.value),
    telefono       : ($("telefono")?.value || "").trim(),

    cristal        : toUpper($("cristal")?.value),
    numero_armazon : ($("numero_armazon")?.value || "").trim(),
    armazon_detalle: toUpper($("armazon_detalle")?.value),

    total          : (()=>{
      const a = parseFloat(($("precio_cristal")?.value || "0").replace(",", ".")) || 0;
      const b = parseFloat(($("precio_armazon")?.value || "0").replace(",", ".")) || 0;
      const c = parseFloat(($("precio_otro")?.value || "0").replace(",", ".")) || 0;
      return (a + b + c).toFixed(2);
    })(),
    sena           : ($("sena")?.value || "").trim(),
    saldo          : ($("saldo")?.value || "").trim(),
    forma_pago     : toUpper(document.querySelector("input[name='forma_pago']")?.value),

    otro_concepto  : toUpper($("otro_concepto")?.value),
    descripcion    : toUpper(document.querySelector("input[name='descripcion']")?.value),
    tipo           : toUpper(document.querySelector("input[name='tipo']")?.value),

    od_esf         : ($("od_esf")?.value || "").trim(),
    od_cil         : ($("od_cil")?.value || "").trim(),
    od_eje         : ($("od_eje")?.value || "").trim(),
    oi_esf         : ($("oi_esf")?.value || "").trim(),
    oi_cil         : ($("oi_cil")?.value || "").trim(),
    oi_eje         : ($("oi_eje")?.value || "").trim(),
    add            : ($("add")?.value || "").trim(),

    vendedor       : toUpper($("vendedor")?.value),

    // nuevo: DR (oculista)
    dr             : toUpper($("dr")?.value),

    // info para backend
    retiro_tipo    : getRetiroTipo()
  });
  return params;
}

export async function guardarTrabajo() {
  const spinner = document.getElementById("spinner");

  try {
    if (spinner) spinner.style.display = "block";
    showMsg("Guardando…", "gray");

    if (!($("numero_trabajo")?.value || "").trim()) { showMsg("⚠ Ingresá el número de trabajo.", "red"); return; }
    if (!($("dni")?.value || "").trim())              { showMsg("⚠ Ingresá el DNI.", "red");              return; }
    if (!($("nombre")?.value || "").trim())           { showMsg("⚠ Ingresá el nombre.", "red");           return; }

    const body = buildBody();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    const text = await res.text();
    if (res.ok && text.startsWith("✅")) {
      showMsg("✅ Guardado. Podés imprimir o seguir editando.", "green");

      // Ofrecer imprimir
      if (window.Swal) {
        Swal.fire({
          title: "Trabajo guardado",
          text: "¿Imprimir ahora?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Imprimir",
          cancelButtonText: "Cerrar"
        }).then(r => { if (r.isConfirmed) window.print(); });
      }
      // ⚠️ Ya no limpiamos el formulario automáticamente
    } else {
      showMsg(text || "❌ Error al guardar.", "red");
    }
  } catch (err) {
    console.error("Error guardando trabajo:", err);
    showMsg("❌ Error de conexión.", "red");
  } finally {
    if (spinner) spinner.style.display = "none";
  }
}
