import { API_URL } from './api.js';

export async function buscarArmazonPorNumero(numeroArmazon, armazonDetalle, precioArmazon, spinner) {
  try {
    if (spinner) spinner.style.display = "block";

    const res = await fetch(`${API_URL}?buscarArmazon=${numeroArmazon.value.trim()}`);
    const data = await res.json();

    if (data.modelo) {
      armazonDetalle.value = data.modelo;
      precioArmazon.value = data.precio || "";  // se llena el precio si viene
    } else {
      armazonDetalle.value = "No encontrado";
      precioArmazon.value = "";
    }

  } catch (err) {
    console.error("Error buscando armazón:", err);
    armazonDetalle.value = "Error";
    precioArmazon.value = "";
  } finally {
    if (spinner) spinner.style.display = "none";
  }
}
