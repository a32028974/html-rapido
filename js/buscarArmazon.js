// buscarArmazon.js
import { API_URL } from './api.js';

export async function buscarArmazonPorNumero(numeroArmazon, armazonDetalle, precioArmazon, spinner) {
  try {
    if (spinner) spinner.style.display = "block";

    const res = await fetch(`${API_URL}?buscarArmazon=${numeroArmazon.value.trim()}`);
    const data = await res.json();

    if (data.modelo) {
      armazonDetalle.value = data.modelo;

      // Solo sobrescribe el precio si hay uno en la respuesta
      if (data.precio) {
        precioArmazon.value = data.precio;
      }
    } else {
      armazonDetalle.value = "No encontrado";
      // No borra el precio si ya había uno cargado
    }

  } catch (err) {
    console.error("Error buscando armazón:", err);
    armazonDetalle.value = "Error";
    // No borra el precio si ya había uno cargado
  } finally {
    if (spinner) spinner.style.display = "none";
  }
}
