import { API_URL } from './api.js';

export async function buscarNombrePorDNI(dniInput, nombreInput, spinner) {
  try {
    spinner.style.display = "block";
    const res = await fetch(`${API_URL}?buscarDNI=${dniInput.value.trim()}`);
    const text = await res.text();
    nombreInput.value = text.startsWith("ERROR") ? "" : text;
  } catch (err) {
    console.error("Error buscando DNI:", err);
  } finally {
    spinner.style.display = "none";
  }
}
