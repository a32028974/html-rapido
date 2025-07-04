import { API_URL } from './api.js';

export async function buscarArmazonPorNumero(numeroArmazon, armazonDetalle, totalInput, spinner) {
  try {
    spinner.style.display = "block";
    const res = await fetch(`${API_URL}?buscarArmazon=${numeroArmazon.value.trim()}`);
    const data = await res.json();
    if (data.modelo) {
      armazonDetalle.value = data.modelo;
      if (totalInput.value === "") totalInput.value = data.precio;
    } else {
      armazonDetalle.value = "No encontrado";
    }
  } catch (err) {
    console.error("Error buscando armazón:", err);
    armazonDetalle.value = "Error";
  } finally {
    spinner.style.display = "none";
  }
}
