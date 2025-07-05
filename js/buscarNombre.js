// buscarNombre.js
import { API_URL } from './api.js';

export async function buscarNombrePorDNI(dniInput, nombreInput, spinner) {
  try {
    if (spinner) spinner.style.display = "block";
    const dni = dniInput.value.trim();
    const res = await fetch(`${API_URL}?buscarDNI=${dni}`);
    const nombre = await res.text();

    if (nombre.startsWith("ERROR")) {
      nombreInput.value = "";
    } else {
      nombreInput.value = nombre;
    }
  } catch (err) {
    console.error("Error buscando nombre por DNI:", err);
    nombreInput.value = "";
  } finally {
    if (spinner) spinner.style.display = "none";
  }
}
