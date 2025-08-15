// buscarNombre.js
import { API_URL } from './api.js';

/**
 * Busca en tu base por DNI y completa nombre y teléfono (si están guardados).
 * Muestra un spinner/lupita mientras busca.
 *
 * dniInput:        <input id="dni">
 * nombreInput:     <input id="nombre">
 * telefonoInput:   <input id="telefono">
 * indicadorInline: <span id="dni-loading"> (lupita)
 */
export async function buscarNombrePorDNI(dniInput, nombreInput, telefonoInput, indicadorInline) {
  const dni = (dniInput?.value || "").trim();
  if (!dni) {
    if (nombreInput)   nombreInput.value = "";
    if (telefonoInput) telefonoInput.value = "";
    return;
  }

  if (indicadorInline) indicadorInline.hidden = false;

  try {
    // Nuevo: pedimos JSON para traer nombre + teléfono
    const url = `${API_URL}?buscarDNI=${encodeURIComponent(dni)}&json=1`;
    const res = await fetch(url, { method: "GET" });

    // Intentamos JSON; si no, caemos a texto (compatibilidad)
    let data, txt;
    try {
      data = await res.json();
    } catch {
      txt = await res.text();
    }

    if (data && data.ok) {
      // Rellena si hay datos; el teléfono queda editable
      if (nombreInput)   nombreInput.value   = (data.nombre || "").toUpperCase();
      if (telefonoInput) telefonoInput.value = (data.telefono || "");
    } else {
      // Compatibilidad: si el backend devuelve solo texto
      const nombre = txt || "";
      if (nombre.startsWith("ERROR")) {
        if (nombreInput)   nombreInput.value = "";
        // no sobreescribo teléfono si hay uno tipeado
      } else {
        if (nombreInput) nombreInput.value = nombre.toUpperCase();
      }
    }
  } catch (err) {
    console.error("Error buscando nombre por DNI:", err);
    if (nombreInput)   nombreInput.value = "";
    // teléfono se deja como esté, por si ya lo escribiste
  } finally {
    if (indicadorInline) indicadorInline.hidden = true;
  }
}
