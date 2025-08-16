// buscarArmazon.js
import { API_URL } from './api.js';

export async function buscarArmazonPorNumero(
  numeroArmazonInput,
  armazonDetalleInput,
  precioArmazonInput,
  spinnerGlobal // no lo usamos para bloquear; mantenemos compatibilidad
) {
  const numero = (numeroArmazonInput?.value || "").trim();
  if (!numero) {
    if (armazonDetalleInput) armazonDetalleInput.value = "";
    if (precioArmazonInput)  precioArmazonInput.value  = "";
    marcarEstado(numeroArmazonInput, null); // resetea estilos
    return;
  }

  try {
    const url = `${API_URL}?buscarArmazon=${encodeURIComponent(numero)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && !data.error) {
      // Completar modelo y precio
      if (armazonDetalleInput) armazonDetalleInput.value = (data.modelo || "").toUpperCase();
      if (precioArmazonInput)  precioArmazonInput.value  = (data.precio || "");

      // Estado (DISPONIBLE / VENDIDO / desconocido)
      const estado   = (data.estado || "DESCONOCIDO").toUpperCase();
      const vendedor = (data.vendedor || "").toUpperCase();
      const fecha    = (data.fecha || "");

      mostrarAvisoEstado(estado, vendedor, fecha);
      marcarEstado(numeroArmazonInput, estado);
    } else {
      // No encontrado
      if (armazonDetalleInput) armazonDetalleInput.value = "";
      if (precioArmazonInput)  precioArmazonInput.value  = "";
      marcarEstado(numeroArmazonInput, "NO_ENCONTRADO");
      Swal.fire({
        icon: "warning",
        title: "Armazón no encontrado",
        toast: true, position: "top-end", timer: 2500, showConfirmButton: false
      });
    }
  } catch (err) {
    console.error("Error buscando armazón:", err);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      toast: true, position: "top-end", timer: 2500, showConfirmButton: false
    });
  }
}

/* ===== UI helpers ===== */

function mostrarAvisoEstado(estado, vendedor, fecha) {
  if (!window.Swal) return; // por si no está cargado sweetalert

  if (estado === "VENDIDO") {
    const texto = [
      "Este armazón figura VENDIDO.",
      vendedor ? `Vendedor: ${vendedor}.` : "",
      fecha ? `Fecha: ${fecha}.` : ""
    ].filter(Boolean).join(" ");
    Swal.fire({
      icon: "warning",
      title: "Armazón VENDIDO",
      text: texto,
      toast: true,
      position: "top-end",
      timer: 3800,
      showConfirmButton: false
    });
  } else if (estado === "DISPONIBLE") {
    Swal.fire({
      icon: "success",
      title: "Armazón disponible",
      toast: true,
      position: "top-end",
      timer: 1800,
      showConfirmButton: false
    });
  } else {
    // Desconocido: no molestamos con toast; sólo no pintamos nada
  }
}

function marcarEstado(input, estado) {
  if (!input) return;
  // Limpio
  input.style.outline = "";
  input.style.borderColor = "";

  if (estado === "VENDIDO") {
    input.style.borderColor = "red";
    input.style.outline     = "2px solid rgba(255,0,0,.35)";
  } else if (estado === "DISPONIBLE") {
    input.style.borderColor = "green";
    input.style.outline     = "2px solid rgba(0,128,0,.25)";
  } else if (estado === "NO_ENCONTRADO") {
    input.style.borderColor = "#cc8800";
    input.style.outline     = "2px solid rgba(230,160,0,.25)";
  }
}
