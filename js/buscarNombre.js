// buscarNombre.js
import { API_URL } from './api.js';

export async function buscarNombrePorDNI(dniInput, nombreInput, indicadorInline) {
  const dni = (dniInput?.value || "").trim();
  if (!dni) {
    if (nombreInput) nombreInput.value = "";
    return;
  }

  // mostrar lupita inline
  if (indicadorInline) indicadorInline.hidden = false;

  try {
    const res = await fetch(`${API_URL}?buscarDNI=${encodeURIComponent(dni)}`);
    const nombre = await res.text();

    if (nombre.startsWith("ERROR")) {
      nombreInput.value = "";
    } else {
      nombreInput.value = nombre.toUpperCase();
    }
  } catch (err) {
    console.error("Error buscando nombre por DNI:", err);
    nombreInput.value = "";
  } finally {
    // ocultar lupita inline
    if (indicadorInline) indicadorInline.hidden = true;
  }
}
