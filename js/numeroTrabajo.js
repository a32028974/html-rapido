// numeroTrabajo.js
import { API_URL } from './api.js';

export async function obtenerNumeroTrabajo() {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");

  try {
    const res = await fetch(`${API_URL}?proximoTrabajo=1`);
    const texto = await res.text();
    const numero = parseInt(texto);

    if (!isNaN(numero)) {
      numeroTrabajoInput.value = numero;
    } else {
      numeroTrabajoInput.value = "100000"; // Valor base si algo falla
    }
  } catch (err) {
    console.error("Error obteniendo número de trabajo:", err);
    numeroTrabajoInput.value = "100000"; // Valor base por error
  }
}
